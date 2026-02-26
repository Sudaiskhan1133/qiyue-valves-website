import { Link } from "wouter";
import { useProducts, useCategories } from "@/hooks/use-products";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight, Settings, ShieldCheck, Globe, Truck, Users, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

export default function Home() {
  const { data: categories, isLoading: isLoadingCats } = useCategories();
  const { data: featuredProducts, isLoading: isLoadingProds } = useProducts();

  // Filter 4 products for featured section
  const displayedProducts = featuredProducts?.slice(0, 4) || [];

  return (
    <Layout>
      <Helmet>
        <title>Qingdao Qiyue Technology Equipment Co., Ltd. | Industrial Valve Manufacturer & Exporter</title>
        <meta name="description" content="Leading manufacturer of industrial valves including ball valves, gate valves, globe valves, check valves, safety valves and control valves. ISO certified, exporting to 50+ countries worldwide." />
        <meta name="keywords" content="industrial valves, ball valve manufacturer, gate valve supplier, globe valve, check valve, safety valve, control valve, valve manufacturer China, Qingdao valve company, industrial valve exporter, API 6D valves, oil gas valves, petrochemical valves" />
        <meta property="og:title" content="Qingdao Qiyue - Industrial Valve Manufacturer & Exporter" />
        <meta property="og:description" content="Leading manufacturer of high-performance industrial valves for oil & gas, petrochemical, and power generation sectors worldwide." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://qiyuevalves.com/" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] flex items-center overflow-hidden bg-primary">
        {/* Unsplash industrial warehouse image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"
            alt="Industrial Factory Background" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-block border border-accent/50 bg-accent/10 px-4 py-1.5 rounded mb-6 backdrop-blur-sm">
              <span className="text-accent font-bold text-xs uppercase tracking-widest">Qingdao Qiyue Technology Equipment Co., Ltd.</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight font-display">
              Industrial <br />
              <span className="text-accent">Valve Excellence</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-lg leading-relaxed">
              Leading manufacturer of high-performance industrial valves for oil & gas, petrochemical, and power generation sectors worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-bold text-lg px-8 py-6 h-auto">
                  Explore Products
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-bold text-lg px-8 py-6 h-auto">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-secondary/30 py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Years Experience", value: "25+", icon: Award },
              { label: "Global Partners", value: "150+", icon: Globe },
              { label: "Projects Completed", value: "2000+", icon: Settings },
              { label: "Team Members", value: "500+", icon: Users },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4">
                <stat.icon className="w-8 h-8 text-accent mb-3" />
                <h3 className="text-3xl md:text-4xl font-bold text-primary mb-1 font-display">{stat.value}</h3>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Product Categories</h2>
            <div className="w-20 h-1 bg-accent mx-auto mb-6"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive solutions for oil & gas, petrochemical, power generation, and water treatment industries.
            </p>
          </div>

          {isLoadingCats ? (
            <div className="flex justify-center py-20">Loading categories...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories?.map((cat) => (
                <Link key={cat.id} href={`/products?category=${cat.slug}`}>
                  <div className="group relative h-80 overflow-hidden rounded-lg cursor-pointer">
                    {/* Unsplash fallback for categories */}
                    <img 
                      src={cat.imageUrl || "https://images.unsplash.com/photo-1531297461136-82lw8z09f9a?auto=format&fit=crop&q=80"} 
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex flex-col justify-end p-8">
                      <h3 className="text-2xl text-white font-bold mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        {cat.name}
                      </h3>
                      <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                        {cat.description || "View our range of high-quality products in this category."}
                      </p>
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 text-accent font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                        View Products <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Engineering Excellence You Can Rely On</h2>
              <p className="text-primary-foreground/70 text-lg mb-8 leading-relaxed">
                We combine state-of-the-art manufacturing with rigorous quality control to deliver components that perform in the harshest environments.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: "Quality Control", desc: "100% inspection rate with advanced testing equipment.", icon: ShieldCheck },
                  { title: "Global Logistics", desc: "Efficient worldwide shipping and handling network.", icon: Truck },
                  { title: "Custom Solutions", desc: "Tailored engineering for specific project requirements.", icon: Settings },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded bg-white/10 flex items-center justify-center flex-shrink-0 text-accent border border-white/10">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                      <p className="text-primary-foreground/60">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 border-2 border-accent/30 rounded-lg transform rotate-3"></div>
              {/* Unsplash industrial worker image */}
              <img 
                src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop" 
                alt="Quality Control Inspector" 
                className="rounded-lg shadow-2xl w-full relative z-10 grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <div className="w-16 h-1 bg-accent mb-4"></div>
            </div>
            <Link href="/products">
              <Button variant="outline" className="hidden md:flex">View All Catalog</Button>
            </Link>
          </div>

          {isLoadingProds ? (
            <div className="text-center py-12">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <div key={product.id} className="h-[420px]">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center md:hidden">
            <Link href="/products">
              <Button variant="outline" className="w-full">View All Catalog</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/10 transform skew-x-12 translate-x-20"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-12 relative z-10 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Optimize Your Operations?</h2>
                <p className="text-primary-foreground/80 mb-8 text-lg">
                  Get a custom quote for your specific requirements. Our engineers are ready to assist you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/contact">
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-bold border-0">
                      Request a Quote
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white hover:text-primary">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:flex justify-end">
                <ShieldCheck className="w-48 h-48 text-white/5" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
