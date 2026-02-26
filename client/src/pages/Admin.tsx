import { useState, useEffect, createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Trash2, Plus, X, LogOut, Eye, Pencil, Package, Grid3X3, MessageSquare, Lock, Languages, Upload, Link } from "lucide-react";
import type { Product, Category, Inquiry } from "@shared/schema";

type Lang = "en" | "zh";

const translations = {
  en: {
    adminPanel: "Admin Panel",
    companyName: "Qingdao Qiyue Technology Equipment Co., Ltd.",
    username: "Username",
    password: "Password",
    enterUsername: "Enter username",
    enterPassword: "Enter password",
    signIn: "Sign In",
    signingIn: "Signing in...",
    invalidCredentials: "Invalid username or password",
    loginFailed: "Login failed. Please try again.",
    qiyueAdmin: "Qiyue Admin",
    logout: "Logout",
    products: "Products",
    categories: "Categories",
    inquiries: "Inquiries",
    addProduct: "Add Product",
    editProduct: "Edit Product",
    addNewProduct: "Add New Product",
    productName: "Product Name *",
    productNamePlaceholder: "e.g. API 600 Gate Valve",
    urlSlug: "URL Slug *",
    urlSlugPlaceholder: "e.g. api-600-gate-valve",
    category: "Category",
    selectCategory: "Select category",
    shortDesc: "Short Description *",
    shortDescPlaceholder: "Brief product summary",
    fullDesc: "Full Description *",
    fullDescPlaceholder: "Detailed product description",
    imageUrls: "Product Images",
    addImage: "Add Image",
    uploadImage: "Upload Image",
    uploading: "Uploading...",
    orEnterUrl: "Or enter URL",
    specifications: "Specifications",
    addSpec: "Add Spec",
    specNamePlaceholder: "Spec name (e.g. Pressure)",
    specValuePlaceholder: "Value (e.g. 150-2500 LB)",
    features: "Features",
    addFeature: "Add Feature",
    featurePlaceholder: "e.g. Fire Safe Design",
    seoFields: "SEO Fields (Optional)",
    metaTitle: "Meta Title",
    seoTitle: "SEO title",
    metaDescription: "Meta Description",
    seoDescription: "SEO description",
    keywords: "Keywords",
    keywordsPlaceholder: "Comma separated keywords",
    saving: "Saving...",
    updateProduct: "Update Product",
    cancel: "Cancel",
    loadingProducts: "Loading products...",
    noProducts: "No products yet. Click \"Add Product\" to create one.",
    image: "Image",
    name: "Name",
    images: "Images",
    actions: "Actions",
    confirmDelete: "Are you sure you want to delete this product?",
    productCreated: "Product created successfully",
    productUpdated: "Product updated successfully",
    productDeleted: "Product deleted",
    error: "Error",
    loading: "Loading...",
    editImage: "Edit Image",
    newImageUrl: "New image URL",
    save: "Save",
    categoryUpdated: "Category updated",
    noInquiries: "No inquiries received yet.",
    email: "Email",
    phone: "Phone",
    message: "Message",
    date: "Date",
  },
  zh: {
    adminPanel: "管理面板",
    companyName: "青岛启越科技设备有限公司",
    username: "用户名",
    password: "密码",
    enterUsername: "请输入用户名",
    enterPassword: "请输入密码",
    signIn: "登录",
    signingIn: "登录中...",
    invalidCredentials: "用户名或密码错误",
    loginFailed: "登录失败，请重试。",
    qiyueAdmin: "启越管理",
    logout: "退出登录",
    products: "产品管理",
    categories: "分类管理",
    inquiries: "询盘管理",
    addProduct: "添加产品",
    editProduct: "编辑产品",
    addNewProduct: "添加新产品",
    productName: "产品名称 *",
    productNamePlaceholder: "例如: API 600 闸阀",
    urlSlug: "URL 别名 *",
    urlSlugPlaceholder: "例如: api-600-gate-valve",
    category: "分类",
    selectCategory: "选择分类",
    shortDesc: "简要描述 *",
    shortDescPlaceholder: "产品简要概述",
    fullDesc: "详细描述 *",
    fullDescPlaceholder: "产品详细描述",
    imageUrls: "产品图片",
    addImage: "添加图片",
    uploadImage: "上传图片",
    uploading: "上传中...",
    orEnterUrl: "或输入链接",
    specifications: "技术规格",
    addSpec: "添加规格",
    specNamePlaceholder: "规格名称（例如: 压力）",
    specValuePlaceholder: "值（例如: 150-2500 LB）",
    features: "产品特点",
    addFeature: "添加特点",
    featurePlaceholder: "例如: 防火设计",
    seoFields: "SEO 字段（可选）",
    metaTitle: "Meta 标题",
    seoTitle: "SEO 标题",
    metaDescription: "Meta 描述",
    seoDescription: "SEO 描述",
    keywords: "关键词",
    keywordsPlaceholder: "用逗号分隔的关键词",
    saving: "保存中...",
    updateProduct: "更新产品",
    cancel: "取消",
    loadingProducts: "加载产品中...",
    noProducts: "暂无产品。点击「添加产品」创建一个。",
    image: "图片",
    name: "名称",
    images: "图片",
    actions: "操作",
    confirmDelete: "确定要删除此产品吗？",
    productCreated: "产品创建成功",
    productUpdated: "产品更新成功",
    productDeleted: "产品已删除",
    error: "错误",
    loading: "加载中...",
    editImage: "编辑图片",
    newImageUrl: "新图片链接",
    save: "保存",
    categoryUpdated: "分类已更新",
    noInquiries: "暂无询盘。",
    email: "邮箱",
    phone: "电话",
    message: "留言内容",
    date: "日期",
  },
};

const LangContext = createContext<{ lang: Lang; t: typeof translations.en; toggle: () => void }>({
  lang: "en",
  t: translations.en,
  toggle: () => {},
});

function useLang() {
  return useContext(LangContext);
}

function LangToggle() {
  const { lang, toggle } = useLang();
  return (
    <Button variant="outline" size="sm" onClick={toggle} className="gap-2" data-testid="button-lang-toggle">
      <Languages className="w-4 h-4" />
      {lang === "en" ? "中文" : "English"}
    </Button>
  );
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const { t } = useLang();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      if (res.ok) {
        onLogin();
      } else {
        setError(t.invalidCredentials);
      }
    } catch {
      setError(t.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-end -mt-2 -mr-2">
            <LangToggle />
          </div>
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl" data-testid="text-admin-title">{t.adminPanel}</CardTitle>
          <p className="text-muted-foreground text-sm mt-1">{t.companyName}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">{t.username}</label>
              <Input
                data-testid="input-admin-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t.enterUsername}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{t.password}</label>
              <Input
                data-testid="input-admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.enterPassword}
              />
            </div>
            {error && <p className="text-sm text-destructive" data-testid="text-login-error">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading} data-testid="button-admin-login">
              {loading ? t.signingIn : t.signIn}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ProductForm({ categories, editProduct, onClose }: {
  categories: Category[];
  editProduct?: Product | null;
  onClose: () => void;
}) {
  const { t } = useLang();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState(editProduct?.name || "");
  const [slug, setSlug] = useState(editProduct?.slug || "");
  const [shortDescription, setShortDescription] = useState(editProduct?.shortDescription || "");
  const [description, setDescription] = useState(editProduct?.description || "");
  const [categoryId, setCategoryId] = useState<string>(editProduct?.categoryId?.toString() || "");
  const [images, setImages] = useState<string[]>(editProduct?.images || [""]);
  const [specKeys, setSpecKeys] = useState<string[]>(editProduct ? Object.keys(editProduct.specifications as Record<string, string>) : [""]);
  const [specValues, setSpecValues] = useState<string[]>(editProduct ? Object.values(editProduct.specifications as Record<string, string>) : [""]);
  const [features, setFeatures] = useState<string[]>(editProduct?.features || [""]);
  const [metaTitle, setMetaTitle] = useState(editProduct?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(editProduct?.metaDescription || "");
  const [keywords, setKeywords] = useState(editProduct?.keywords || "");

  useEffect(() => {
    if (!editProduct && name) {
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }, [name, editProduct]);

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (index: number, file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      const newImages = [...images];
      newImages[index] = data.url;
      setImages(newImages);
      toast({ title: "Image uploaded" });
    } catch {
      toast({ title: t.error, description: "Failed to upload image", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/products", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: t.productCreated });
      onClose();
    },
    onError: (err: Error) => {
      toast({ title: t.error, description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("PATCH", `/api/admin/products/${editProduct!.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: t.productUpdated });
      onClose();
    },
    onError: (err: Error) => {
      toast({ title: t.error, description: err.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const specs: Record<string, string> = {};
    specKeys.forEach((key, i) => {
      if (key.trim()) specs[key.trim()] = specValues[i] || "";
    });

    const productData = {
      name,
      slug,
      shortDescription,
      description,
      categoryId: categoryId ? parseInt(categoryId) : null,
      images: images.filter(img => img.trim()),
      specifications: specs,
      features: features.filter(f => f.trim()),
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      keywords: keywords || null,
    };

    if (editProduct) {
      updateMutation.mutate(productData);
    } else {
      createMutation.mutate(productData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>{editProduct ? t.editProduct : t.addNewProduct}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-form">
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">{t.productName}</label>
              <Input data-testid="input-product-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.productNamePlaceholder} required />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{t.urlSlug}</label>
              <Input data-testid="input-product-slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={t.urlSlugPlaceholder} required />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">{t.category}</label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger data-testid="select-product-category">
                <SelectValue placeholder={t.selectCategory} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">{t.shortDesc}</label>
            <Textarea data-testid="input-product-short-desc" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder={t.shortDescPlaceholder} required />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">{t.fullDesc}</label>
            <Textarea data-testid="input-product-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t.fullDescPlaceholder} rows={4} required />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">{t.imageUrls}</label>
              <Button type="button" variant="outline" size="sm" onClick={() => setImages([...images, ""])} data-testid="button-add-image">
                <Plus className="w-3 h-3 mr-1" /> {t.addImage}
              </Button>
            </div>
            <div className="space-y-3">
              {images.map((img, i) => (
                <div key={i} className="border rounded-lg p-3 space-y-2">
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 flex gap-2">
                      <label className="flex-shrink-0">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          data-testid={`input-image-file-${i}`}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(i, file);
                          }}
                          disabled={uploading}
                        />
                        <span className="inline-flex items-center gap-1 px-3 py-2 text-sm border rounded-md cursor-pointer hover:bg-muted transition-colors">
                          <Upload className="w-4 h-4" />
                          {uploading ? t.uploading : t.uploadImage}
                        </span>
                      </label>
                      <Input
                        data-testid={`input-image-url-${i}`}
                        value={img}
                        onChange={(e) => {
                          const newImages = [...images];
                          newImages[i] = e.target.value;
                          setImages(newImages);
                        }}
                        placeholder={t.orEnterUrl + ": https://example.com/image.jpg"}
                        className="flex-1"
                      />
                    </div>
                    {images.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => setImages(images.filter((_, idx) => idx !== i))} data-testid={`button-remove-image-${i}`}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  {img && (
                    <div className="flex items-center gap-2">
                      <img src={img} alt="preview" className="w-16 h-16 rounded object-contain border bg-white p-1" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      <span className="text-xs text-muted-foreground truncate max-w-[300px]">{img}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">{t.specifications}</label>
              <Button type="button" variant="outline" size="sm" onClick={() => { setSpecKeys([...specKeys, ""]); setSpecValues([...specValues, ""]); }} data-testid="button-add-spec">
                <Plus className="w-3 h-3 mr-1" /> {t.addSpec}
              </Button>
            </div>
            <div className="space-y-2">
              {specKeys.map((key, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input
                    value={key}
                    onChange={(e) => { const nk = [...specKeys]; nk[i] = e.target.value; setSpecKeys(nk); }}
                    placeholder={t.specNamePlaceholder}
                    className="w-1/3"
                  />
                  <Input
                    value={specValues[i]}
                    onChange={(e) => { const nv = [...specValues]; nv[i] = e.target.value; setSpecValues(nv); }}
                    placeholder={t.specValuePlaceholder}
                    className="flex-1"
                  />
                  {specKeys.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => { setSpecKeys(specKeys.filter((_, idx) => idx !== i)); setSpecValues(specValues.filter((_, idx) => idx !== i)); }}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">{t.features}</label>
              <Button type="button" variant="outline" size="sm" onClick={() => setFeatures([...features, ""])} data-testid="button-add-feature">
                <Plus className="w-3 h-3 mr-1" /> {t.addFeature}
              </Button>
            </div>
            <div className="space-y-2">
              {features.map((feature, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input
                    value={feature}
                    onChange={(e) => { const nf = [...features]; nf[i] = e.target.value; setFeatures(nf); }}
                    placeholder={t.featurePlaceholder}
                  />
                  {features.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => setFeatures(features.filter((_, idx) => idx !== i))}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-bold mb-3 text-muted-foreground uppercase tracking-wider">{t.seoFields}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">{t.metaTitle}</label>
                <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder={t.seoTitle} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{t.metaDescription}</label>
                <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder={t.seoDescription} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{t.keywords}</label>
                <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder={t.keywordsPlaceholder} />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isPending} data-testid="button-submit-product">
              {isPending ? t.saving : editProduct ? t.updateProduct : t.addProduct}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>{t.cancel}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ProductsList({ categories }: { categories: Category[] }) {
  const { t } = useLang();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: products, isLoading } = useQuery<(Product & { category?: Category | null })[]>({
    queryKey: ["/api/products"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: t.productDeleted });
    },
    onError: (err: Error) => {
      toast({ title: t.error, description: err.message, variant: "destructive" });
    },
  });

  if (showForm || editProduct) {
    return (
      <ProductForm
        categories={categories}
        editProduct={editProduct}
        onClose={() => { setShowForm(false); setEditProduct(null); }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{t.products} ({products?.length || 0})</h2>
        <Button onClick={() => setShowForm(true)} data-testid="button-add-product">
          <Plus className="w-4 h-4 mr-2" /> {t.addProduct}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">{t.loadingProducts}</div>
      ) : products?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
          {t.noProducts}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">{t.image}</TableHead>
                <TableHead>{t.name}</TableHead>
                <TableHead className="hidden md:table-cell">{t.category}</TableHead>
                <TableHead className="hidden md:table-cell">{t.images}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.images?.[0] || "https://placehold.co/40x40?text=N/A"}
                      alt={product.name}
                      className="w-10 h-10 rounded object-cover border"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm" data-testid={`text-product-name-${product.id}`}>{product.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{product.shortDescription}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">{product.category?.name || "—"}</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">{product.images?.length || 0}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => window.open(`/products/${product.slug}`, '_blank')} data-testid={`button-view-product-${product.id}`}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setEditProduct(product)} data-testid={`button-edit-product-${product.id}`}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm(t.confirmDelete)) {
                            deleteMutation.mutate(product.id);
                          }
                        }}
                        data-testid={`button-delete-product-${product.id}`}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function CategoriesList() {
  const { t } = useLang();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editId, setEditId] = useState<number | null>(null);
  const [editImage, setEditImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, imageUrl }: { id: number; imageUrl: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/categories/${id}`, { imageUrl });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: t.categoryUpdated });
      setEditId(null);
    },
  });

  const handleCategoryImageUpload = async (catId: number, file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setEditImage(data.url);
      updateMutation.mutate({ id: catId, imageUrl: data.url });
    } catch {
      toast({ title: t.error, description: "Failed to upload image", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{t.categories} ({categories?.length || 0})</h2>
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">{t.loading}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories?.map((cat) => (
            <Card key={cat.id}>
              <CardContent className="p-4">
                <img
                  src={cat.imageUrl || "https://placehold.co/300x200?text=No+Image"}
                  alt={cat.name}
                  className="w-full h-36 object-cover rounded-md mb-3"
                />
                <h3 className="font-bold" data-testid={`text-category-name-${cat.id}`}>{cat.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{cat.description}</p>
                {editId === cat.id ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <label className="flex-shrink-0">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          data-testid={`input-category-file-${cat.id}`}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleCategoryImageUpload(cat.id, file);
                          }}
                          disabled={uploading}
                        />
                        <span className="inline-flex items-center gap-1 px-3 py-2 text-sm border rounded-md cursor-pointer hover:bg-muted transition-colors">
                          <Upload className="w-4 h-4" />
                          {uploading ? t.uploading : t.uploadImage}
                        </span>
                      </label>
                    </div>
                    <Input
                      value={editImage}
                      onChange={(e) => setEditImage(e.target.value)}
                      placeholder={t.orEnterUrl + ": https://example.com/image.jpg"}
                      data-testid={`input-category-image-${cat.id}`}
                    />
                    {editImage && (
                      <img src={editImage} alt="preview" className="w-full h-24 object-cover rounded border" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateMutation.mutate({ id: cat.id, imageUrl: editImage })} disabled={updateMutation.isPending || uploading}>
                        {t.save}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditId(null)}>{t.cancel}</Button>
                    </div>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => { setEditId(cat.id); setEditImage(cat.imageUrl || ""); }} data-testid={`button-edit-category-${cat.id}`}>
                    <Pencil className="w-3 h-3 mr-1" /> {t.editImage}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function InquiriesList() {
  const { t } = useLang();
  const { data: inquiries, isLoading } = useQuery<Inquiry[]>({
    queryKey: ["/api/admin/inquiries"],
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{t.inquiries} ({inquiries?.length || 0})</h2>
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">{t.loading}</div>
      ) : inquiries?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
          {t.noInquiries}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.name}</TableHead>
                <TableHead>{t.email}</TableHead>
                <TableHead className="hidden md:table-cell">{t.phone}</TableHead>
                <TableHead>{t.message}</TableHead>
                <TableHead className="hidden md:table-cell">{t.date}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries?.map((inquiry) => (
                <TableRow key={inquiry.id} data-testid={`row-inquiry-${inquiry.id}`}>
                  <TableCell className="font-medium text-sm" data-testid={`text-inquiry-name-${inquiry.id}`}>{inquiry.name}</TableCell>
                  <TableCell className="text-sm" data-testid={`text-inquiry-email-${inquiry.id}`}>{inquiry.email}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{inquiry.phone || "—"}</TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground truncate max-w-[250px]">{inquiry.message}</p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString() : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { t } = useLang();
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            <h1 className="text-lg font-bold">{t.qiyueAdmin}</h1>
          </div>
          <div className="flex items-center gap-2">
            <LangToggle />
            <Button variant="ghost" onClick={onLogout} data-testid="button-admin-logout">
              <LogOut className="w-4 h-4 mr-2" /> {t.logout}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products" className="gap-2" data-testid="tab-products">
              <Package className="w-4 h-4" /> {t.products}
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2" data-testid="tab-categories">
              <Grid3X3 className="w-4 h-4" /> {t.categories}
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="gap-2" data-testid="tab-inquiries">
              <MessageSquare className="w-4 h-4" /> {t.inquiries}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsList categories={categories || []} />
          </TabsContent>

          <TabsContent value="categories">
            <CategoriesList />
          </TabsContent>

          <TabsContent value="inquiries">
            <InquiriesList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("admin-lang") as Lang) || "en";
    }
    return "en";
  });

  const toggle = () => {
    const next = lang === "en" ? "zh" : "en";
    setLang(next);
    localStorage.setItem("admin-lang", next);
  };

  useEffect(() => {
    fetch("/api/admin/check", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setAuthenticated(data.authenticated))
      .catch(() => setAuthenticated(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    setAuthenticated(false);
  };

  const langValue = { lang, t: translations[lang], toggle };

  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <LangContext.Provider value={langValue}>
      {!authenticated ? (
        <AdminLogin onLogin={() => setAuthenticated(true)} />
      ) : (
        <AdminDashboard onLogout={handleLogout} />
      )}
    </LangContext.Provider>
  );
}
