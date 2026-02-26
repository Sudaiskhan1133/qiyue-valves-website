import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";
import nodemailer from "nodemailer";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "qiyue2024";

const smtpTransport = process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD
  ? nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  : null;

async function sendInquiryNotification(inquiry: { name: string; email: string; phone?: string; message: string; productName?: string }) {
  if (!smtpTransport || !process.env.SMTP_EMAIL) return;
  try {
    await smtpTransport.sendMail({
      from: `"Qiyue Website" <${process.env.SMTP_EMAIL}>`,
      to: process.env.SMTP_EMAIL,
      replyTo: inquiry.email,
      subject: `New Inquiry from ${inquiry.name}${inquiry.productName ? ` - ${inquiry.productName}` : ""}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Name</td><td style="padding:8px;border:1px solid #ddd;">${inquiry.name}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #ddd;"><a href="mailto:${inquiry.email}">${inquiry.email}</a></td></tr>
          ${inquiry.phone ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Phone</td><td style="padding:8px;border:1px solid #ddd;">${inquiry.phone}</td></tr>` : ""}
          ${inquiry.productName ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Product</td><td style="padding:8px;border:1px solid #ddd;">${inquiry.productName}</td></tr>` : ""}
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Message</td><td style="padding:8px;border:1px solid #ddd;">${inquiry.message}</td></tr>
        </table>
        <p style="color:#888;font-size:12px;margin-top:20px;">This email was sent from the Qiyue Valves website contact form.</p>
      `,
    });
    console.log(`Inquiry notification sent for: ${inquiry.name}`);
  } catch (err) {
    console.error("Failed to send inquiry email notification:", err);
  }
}

declare module "express-session" {
  interface SessionData {
    isAdmin: boolean;
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.set("trust proxy", 1);

  const isProduction = process.env.NODE_ENV === "production";
  const SessionStore = MemoryStore(session);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "qiyue-admin-secret",
      resave: true,
      saveUninitialized: false,
      store: new SessionStore({ checkPeriod: 86400000 }),
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: isProduction ? "none" as const : "lax" as const,
        secure: isProduction,
      },
      proxy: isProduction,
    })
  );

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use("/uploads", express.static(uploadsDir));

  const upload = multer({
    storage: multer.diskStorage({
      destination: uploadsDir,
      filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const allowed = /jpeg|jpg|png|gif|webp/;
      const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
      const mimeOk = /image\/(jpeg|png|gif|webp)/.test(file.mimetype);
      cb(null, extOk && mimeOk);
    },
  });

  app.post("/api/admin/upload", requireAdmin, upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  });

  // === Admin Auth Routes ===
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      req.session.isAdmin = true;
      req.session.save((err) => {
        if (err) return res.status(500).json({ message: "Session error" });
        res.json({ success: true });
      });
      return;
    }
    return res.status(401).json({ message: "Invalid credentials" });
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/admin/check", (req, res) => {
    res.json({ authenticated: !!(req.session && req.session.isAdmin) });
  });

  // === Products Routes (Public) ===
  app.get(api.products.list.path, async (req, res) => {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    
    const productsList = await storage.getProducts(category, search);
    res.json(productsList);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProductBySlug(req.params.slug);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  // === Admin Product Management (Protected) ===
  app.post(api.products.create.path, requireAdmin, async (req, res) => {
    try {
      const input = api.products.create.input.parse(req.body);
      const product = await storage.createProduct(input);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch(api.products.update.path, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = api.products.update.input.parse(req.body);
      const product = await storage.updateProduct(id, updates);
      res.json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.products.delete.path, requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteProduct(id);
    res.status(204).end();
  });

  // === Categories Routes ===
  app.get(api.categories.list.path, async (req, res) => {
    const categoriesList = await storage.getCategories();
    res.json(categoriesList);
  });

  app.patch(api.categories.update.path, requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    const updates = api.categories.update.input.parse(req.body);
    const category = await storage.updateCategory(id, updates);
    res.json(category);
  });

  // === Inquiries Routes ===
  app.get(api.inquiries.list.path, requireAdmin, async (req, res) => {
    const inquiriesList = await storage.getInquiries();
    res.json(inquiriesList);
  });

  app.post(api.inquiries.create.path, async (req, res) => {
    try {
      const input = api.inquiries.create.input.parse(req.body);
      const inquiry = await storage.createInquiry(input);
      
      let productName: string | undefined;
      if (input.productId) {
        try {
          const products = await storage.getProducts();
          const product = products.find((p: any) => p.id === input.productId);
          if (product) productName = product.name;
        } catch {}
      }
      sendInquiryNotification({
        name: input.name,
        email: input.email,
        phone: input.phone || undefined,
        message: input.message,
        productName,
      });
      
      res.status(201).json({ success: true, id: inquiry.id });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  try {
    await seedDatabase();
  } catch (err) {
    console.error("Warning: Database seed failed (database may be unavailable):", (err as Error).message);
  }

  return httpServer;
}

async function seedDatabase() {
  const categoriesData = [
    { name: "Ball Valves", slug: "ball-valves", description: "Durable ball valves for precise control.", imageUrl: "https://placehold.co/600x400?text=Ball+Valves" },
    { name: "Gate Valves", slug: "gate-valves", description: "High-performance gate valves for industrial flow control.", imageUrl: "https://placehold.co/600x400?text=Gate+Valves" },
    { name: "Globe Valves", slug: "globe-valves", description: "Versatile globe valves for throttling and flow regulation.", imageUrl: "https://placehold.co/600x400?text=Globe+Valves" },
    { name: "Check Valves", slug: "check-valves", description: "Non-return valves to prevent backflow.", imageUrl: "https://placehold.co/600x400?text=Check+Valves" },
    { name: "Safety Valves", slug: "safety-valves", description: "Pressure relief safety valves for system protection.", imageUrl: "https://placehold.co/600x400?text=Safety+Valves" },
    { name: "Control Valves", slug: "control-valves", description: "Advanced control valves for automated flow management.", imageUrl: "https://placehold.co/600x400?text=Control+Valves" }
  ];

  await storage.seedCategories(categoriesData);

  const dbCategories = await storage.getCategories();
  const ballId = dbCategories.find(c => c.slug === "ball-valves")?.id;

  if (ballId) {
    const productsData = [
      {
        categoryId: ballId,
        name: "Floating Ball Valve - Qiyue Series",
        slug: "floating-ball-valve-qiyue",
        shortDescription: "Professional Floating Ball Valve by Qingdao Qiyue.",
        description: "Our Qiyue series floating ball valves are built for reliability and longevity in industrial applications.",
        specifications: { "Design": "API 6D", "Size": "1/2\" - 10\"", "Pressure": "Class 150-600" },
        features: ["Fire Safe", "Anti-Static"],
        images: ["https://placehold.co/600x400?text=Ball+Valve+1", "https://placehold.co/600x400?text=Ball+Valve+2"],
        metaTitle: "Floating Ball Valve | Qingdao Qiyue",
        metaDescription: "Professional valve equipment manufacturer Qingdao Qiyue Technology.",
        keywords: "ball valve, qiyue, industrial valves"
      }
    ];
    await storage.seedProducts(productsData);
  }
}
