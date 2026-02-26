import { db } from "./db";
import {
  products,
  categories,
  inquiries,
  type Product,
  type Category,
  type InsertInquiry,
  type Inquiry,
  type InsertProduct,
  type InsertCategory
} from "@shared/schema";
import { eq, like, desc } from "drizzle-orm";

function requireDb() {
  if (!db) throw new Error("Database is not available. Check MYSQL_DATABASE_URL configuration.");
  return db;
}

function parseProductJson(row: any): any {
  return {
    ...row,
    specifications: typeof row.specifications === 'string' ? JSON.parse(row.specifications) : (row.specifications || {}),
    features: typeof row.features === 'string' ? JSON.parse(row.features) : (row.features || []),
    images: typeof row.images === 'string' ? JSON.parse(row.images) : (row.images || []),
  };
}

export interface IStorage {
  getProducts(categorySlug?: string, search?: string): Promise<(Product & { category: Category | null })[]>;
  getProductBySlug(slug: string): Promise<(Product & { category: Category | null }) | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category>;
  getInquiries(): Promise<Inquiry[]>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  seedCategories(data: any[]): Promise<void>;
  seedProducts(data: any[]): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(categorySlug?: string, search?: string): Promise<(Product & { category: Category | null })[]> {
    const database = requireDb();
    let query = database.select({
      id: products.id,
      categoryId: products.categoryId,
      name: products.name,
      slug: products.slug,
      shortDescription: products.shortDescription,
      description: products.description,
      specifications: products.specifications,
      features: products.features,
      images: products.images,
      metaTitle: products.metaTitle,
      metaDescription: products.metaDescription,
      keywords: products.keywords,
      createdAt: products.createdAt,
      category: categories
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id));

    if (categorySlug && categorySlug !== 'all') {
      const category = await this.getCategoryBySlug(categorySlug);
      if (category) {
        // @ts-ignore
        query = query.where(eq(products.categoryId, category.id));
      } else {
        return [];
      }
    }

    if (search) {
      // @ts-ignore
      query = query.where(like(products.name, `%${search}%`));
    }

    const results = await query.orderBy(desc(products.createdAt));
    
    return results.map(row => ({
      ...parseProductJson(row),
      category: row.category
    }));
  }

  async getProductBySlug(slug: string): Promise<(Product & { category: Category | null }) | undefined> {
    const database = requireDb();
    const [result] = await database.select({
      id: products.id,
      categoryId: products.categoryId,
      name: products.name,
      slug: products.slug,
      shortDescription: products.shortDescription,
      description: products.description,
      specifications: products.specifications,
      features: products.features,
      images: products.images,
      metaTitle: products.metaTitle,
      metaDescription: products.metaDescription,
      keywords: products.keywords,
      createdAt: products.createdAt,
      category: categories
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug));

    if (!result) return undefined;
    
    return {
      ...parseProductJson(result),
      category: result.category
    };
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const database = requireDb();
    await database.insert(products).values(insertProduct as any);
    const [product] = await database.select().from(products).where(eq(products.slug, insertProduct.slug));
    return parseProductJson(product);
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product> {
    const database = requireDb();
    await database.update(products).set(updates as any).where(eq(products.id, id));
    const [product] = await database.select().from(products).where(eq(products.id, id));
    return parseProductJson(product);
  }

  async deleteProduct(id: number): Promise<void> {
    const database = requireDb();
    await database.delete(products).where(eq(products.id, id));
  }

  async getCategories(): Promise<Category[]> {
    const database = requireDb();
    return await database.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const database = requireDb();
    const [category] = await database.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async updateCategory(id: number, updates: Partial<InsertCategory>): Promise<Category> {
    const database = requireDb();
    await database.update(categories).set(updates as any).where(eq(categories.id, id));
    const [category] = await database.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async getInquiries(): Promise<Inquiry[]> {
    const database = requireDb();
    return await database.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const database = requireDb();
    await database.insert(inquiries).values(insertInquiry as any);
    const [inquiry] = await database.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(1);
    return inquiry;
  }

  async seedCategories(data: any[]): Promise<void> {
    const database = requireDb();
    const existing = await this.getCategories();
    if (existing.length < data.length) {
      await database.delete(products);
      await database.delete(categories);
      await database.insert(categories).values(data);
    }
  }

  async seedProducts(data: any[]): Promise<void> {
    const database = requireDb();
    const existing = await this.getProducts();
    if (existing.length === 0) {
      await database.insert(products).values(data);
    }
  }
}

export const storage = new DatabaseStorage();
