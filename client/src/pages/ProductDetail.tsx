import { useRoute, Link } from "wouter";
import { useProduct, useProducts } from "@/hooks/use-products";
import { Layout } from "@/components/Layout";
import { InquiryForm } from "@/components/InquiryForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ChevronRight, FileText, CheckCircle2, Download } from "lucide-react";
import { Helmet } from "react-helmet";
import { ProductCard } from "@/components/ProductCard";
import { useState } from "react";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:slug");
  const slug = params?.slug || "";
  const { data: product, isLoading, isError } = useProduct(slug);
  const [activeImage, setActiveImage] = useState(0);

  // Fetch related products (same category)
  const { data: relatedProducts } = useProducts({ 
    category: product?.category?.slug 
  });
  
  // Filter out current product and limit to 3
  const filteredRelated = relatedProducts?.filter(p => p.id !== product?.id).slice(0, 3);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (isError || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/products"><Button>Return to Catalog</Button></Link>
        </div>
      </Layout>
    );
  }

  const specs = (typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications) as Record<string, string>;
  const features = (typeof product.features === 'string' ? JSON.parse(product.features) : product.features) || [];
  const rawImages = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
  const images = Array.isArray(rawImages) && rawImages.length > 0 ? rawImages : ["https://placehold.co/800x600?text=No+Image"];

  return (
    <Layout>
      <Helmet>
        <title>{product.metaTitle || `${product.name} - ${product.category?.name || 'Industrial Valve'} | Qingdao Qiyue`}</title>
        <meta name="description" content={product.metaDescription || product.shortDescription || `${product.name} - High quality industrial valve from Qingdao Qiyue Technology Equipment Co., Ltd.`} />
        <meta name="keywords" content={product.keywords || `${product.name}, ${product.category?.name || 'industrial valve'}, valve manufacturer, Qingdao Qiyue`} />
        <meta property="og:title" content={product.metaTitle || `${product.name} | Qingdao Qiyue`} />
        <meta property="og:description" content={product.metaDescription || product.shortDescription} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://qiyuevalves.com/products/${product.slug}`} />
        {images[0] && <meta property="og:image" content={images[0]} />}
        <link rel="canonical" href={`https://qiyuevalves.com/products/${product.slug}`} />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-secondary/30 py-4 border-b border-border">
        <div className="container mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/products">Products</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {product.category && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/products?category=${product.category.slug}`}>
                      {product.category.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              <BreadcrumbItem>
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-white rounded-lg overflow-hidden border border-border shadow-md flex items-center justify-center">
              <img 
                src={images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-contain p-4"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/800x600?text=No+Image"; }}
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`aspect-square rounded cursor-pointer overflow-hidden border-2 ${activeImage === idx ? 'border-accent' : 'border-transparent'}`}
                    onClick={() => setActiveImage(idx)}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              {product.category && (
                <span className="text-accent font-bold text-sm uppercase tracking-wider mb-2 block">
                  {product.category.name}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary font-display">{product.name}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {product.shortDescription}
              </p>
            </div>

            <div className="flex gap-4 mb-8 pb-8 border-b border-border">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-bold px-8" onClick={() => document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' })}>
                Request a Quote
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <FileText className="w-4 h-4" /> Download Datasheet
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent" /> Key Features
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Details Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Tabs defaultValue="specs" className="w-full">
              <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0 mb-6">
                <TabsTrigger 
                  value="specs" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-primary px-6 py-3 text-base font-bold uppercase tracking-wide"
                >
                  Specifications
                </TabsTrigger>
                <TabsTrigger 
                  value="description" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-primary px-6 py-3 text-base font-bold uppercase tracking-wide"
                >
                  Full Description
                </TabsTrigger>
                <TabsTrigger 
                  value="downloads" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-primary px-6 py-3 text-base font-bold uppercase tracking-wide"
                >
                  Downloads
                </TabsTrigger>
              </TabsList>

              <TabsContent value="specs" className="mt-0">
                <div className="bg-white border border-border rounded-lg overflow-hidden">
                  <Table>
                    <TableBody>
                      {Object.entries(specs).map(([key, value], i) => (
                        <TableRow key={key} className={i % 2 === 0 ? "bg-muted/30" : ""}>
                          <TableCell className="font-bold text-muted-foreground w-1/3 p-4 border-r border-border/50">{key}</TableCell>
                          <TableCell className="p-4">{value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="description" className="mt-0">
                <div className="prose prose-slate max-w-none text-muted-foreground">
                  <p className="whitespace-pre-line leading-relaxed">{product.description}</p>
                </div>
              </TabsContent>

              <TabsContent value="downloads" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center p-4 border border-border rounded-lg hover:border-accent transition-colors cursor-pointer group bg-white">
                      <div className="w-10 h-10 bg-red-100 text-red-600 rounded flex items-center justify-center mr-4">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold group-hover:text-primary transition-colors">Technical Datasheet.pdf</h4>
                        <p className="text-xs text-muted-foreground">2.4 MB • PDF</p>
                      </div>
                      <Download className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Quote Form */}
          <div className="lg:col-span-1" id="inquiry-form">
            <div className="sticky top-24">
              <InquiryForm productId={product.id} productName={product.name} />
            </div>
          </div>
        </div>

        {/* Related Products */}
        {filteredRelated && filteredRelated.length > 0 && (
          <div className="mt-20 pt-12 border-t border-border">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Related Products</h2>
              <Link href={`/products?category=${product.category?.slug}`}>
                <Button variant="link" className="text-accent hover:text-accent/80">View All <ChevronRight className="ml-1 w-4 h-4" /></Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredRelated.map((p) => (
                <div key={p.id} className="h-[380px]">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
