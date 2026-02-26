import { Link } from "wouter";
import { type Product, type Category } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeCheck } from "lucide-react";

interface ProductCardProps {
  product: Product & { category?: Category };
}

export function ProductCard({ product }: ProductCardProps) {
  const images = Array.isArray(product.images) ? product.images : [];
  const imageUrl = images[0] || "https://placehold.co/600x400?text=Product+Image";

  return (
    <Card className="group overflow-hidden border-border/60 hover:border-primary/30 transition-all duration-300 hover:shadow-xl h-full flex flex-col" data-testid={`product-card-${product.id}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <div className="absolute top-2 right-2 z-10">
          {product.category && (
            <span className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded font-medium uppercase tracking-wider backdrop-blur-sm">
              {product.category.name}
            </span>
          )}
        </div>
        <img
          src={imageUrl}
          alt={product.name}
          className="object-contain w-full h-full bg-white p-2 transform transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Product+Image";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <Link href={`/products/${product.slug}`}>
            <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md">
              View Specs <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
          <Link href={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
          {product.shortDescription}
        </p>
        
        <div className="flex gap-2 mt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><BadgeCheck className="w-3 h-3 text-accent" /> ISO 9001</span>
          <span className="flex items-center gap-1"><BadgeCheck className="w-3 h-3 text-accent" /> Certified</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-6">
        <Link href={`/products/${product.slug}`} className="w-full">
          <Button variant="ghost" className="w-full text-primary hover:text-accent hover:bg-transparent p-0 flex justify-between group/btn">
            <span className="font-semibold uppercase text-xs tracking-widest border-b-2 border-transparent group-hover/btn:border-accent transition-all pb-1">
              Read More
            </span>
            <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
