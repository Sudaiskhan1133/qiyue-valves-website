import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md mx-4 shadow-xl border-border/60">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h1 className="text-2xl font-bold text-foreground">404 Page Not Found</h1>
          </div>
          <p className="mt-4 text-muted-foreground pb-6">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link href="/">
            <Button className="w-full bg-primary hover:bg-primary/90">Return Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
