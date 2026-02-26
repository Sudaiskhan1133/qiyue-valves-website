import { useProducts, useCategories } from "@/hooks/use-products";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";

const PRODUCTS_PER_PAGE = 9;

export default function ProductList() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const categoryParam = searchParams.get("category") || "";
  
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  const { data: products, isLoading: loadingProducts } = useProducts({ 
    category: activeCategory || undefined,
    search: search || undefined
  });
  
  const { data: categories } = useCategories();

  const totalProducts = products?.length || 0;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const paginatedProducts = products?.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, search]);

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    if (slug) {
      setLocation(`/products?category=${slug}`);
    } else {
      setLocation(`/products`);
    }
    setIsMobileFiltersOpen(false);
  };

  const activeCategoryName = categories?.find(c => c.slug === activeCategory)?.name;
  const seoTitle = activeCategoryName 
    ? `${activeCategoryName} - Industrial Valve Products | Qingdao Qiyue`
    : "Industrial Valve Products Catalog | Qingdao Qiyue Technology Equipment";
  const seoDescription = activeCategoryName
    ? `Browse our range of ${activeCategoryName} for industrial applications. High-quality valve solutions from Qingdao Qiyue Technology Equipment Co., Ltd.`
    : "Browse our complete catalog of industrial valves - ball valves, gate valves, globe valves, check valves, safety valves, and control valves. Quality manufacturing from China.";

  return (
    <Layout>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content="industrial valve catalog, ball valves, gate valves, globe valves, check valves, safety valves, control valves, valve products, China valve manufacturer, API valves, valve supplier" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://qiyuevalves.com/products${activeCategory ? `?category=${activeCategory}` : ''}`} />
        <link rel="canonical" href={`https://qiyuevalves.com/products${activeCategory ? `?category=${activeCategory}` : ''}`} />
      </Helmet>

      <div className="bg-secondary/30 py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Product Catalog</h1>
          <p className="text-muted-foreground max-w-2xl">
            Browse our extensive range of industrial components engineered for performance and reliability.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <aside className={`lg:w-1/4 ${isMobileFiltersOpen ? 'fixed inset-0 z-50 bg-background p-6 overflow-y-auto' : 'hidden lg:block'}`}>
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={() => setIsMobileFiltersOpen(false)}><X /></button>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Search</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name or ID..." 
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    data-testid="input-search-products"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange("")}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${!activeCategory ? 'bg-primary text-white font-medium' : 'hover:bg-secondary text-muted-foreground'}`}
                    data-testid="button-category-all"
                  >
                    All Categories
                  </button>
                  {categories?.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${activeCategory === cat.slug ? 'bg-primary text-white font-medium' : 'hover:bg-secondary text-muted-foreground'}`}
                      data-testid={`button-category-${cat.slug}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-secondary/50 p-6 rounded-lg border border-border mt-8 hidden lg:block">
                <h4 className="font-bold mb-2">Need a Custom Solution?</h4>
                <p className="text-sm text-muted-foreground mb-4">Our engineering team can design components to your exact specifications.</p>
                <Button variant="outline" className="w-full bg-white">Contact Engineers</Button>
              </div>
            </div>
          </aside>

          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground" data-testid="text-product-count">
                Showing {paginatedProducts?.length || 0} of {totalProducts} results
                {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="lg:hidden gap-2"
                onClick={() => setIsMobileFiltersOpen(true)}
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </Button>
            </div>

            {loadingProducts ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-96 bg-secondary/50 rounded-lg"></div>
                ))}
              </div>
            ) : totalProducts === 0 ? (
              <div className="text-center py-20 bg-secondary/10 rounded-lg border border-dashed border-border">
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search or category filters.</p>
                <Button onClick={() => { setSearch(""); handleCategoryChange(""); }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedProducts?.map((product) => (
                    <div key={product.id} data-testid={`card-product-${product.id}`}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10" data-testid="pagination">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                      data-testid="button-prev-page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="icon"
                        onClick={() => setCurrentPage(page)}
                        data-testid={`button-page-${page}`}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => p + 1)}
                      data-testid="button-next-page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
