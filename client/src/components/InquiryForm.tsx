import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInquirySchema, type InsertInquiry } from "@shared/schema";
import { useCreateInquiry } from "@/hooks/use-inquiries";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";

interface InquiryFormProps {
  productId?: number;
  productName?: string;
}

export function InquiryForm({ productId, productName }: InquiryFormProps) {
  const { mutate, isPending } = useCreateInquiry();
  
  const form = useForm<InsertInquiry>({
    resolver: zodResolver(insertInquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: productName 
        ? `I am interested in getting a quote for the ${productName}. Please send me more information.`
        : "",
      productId: productId || undefined,
    },
  });

  function onSubmit(data: InsertInquiry) {
    mutate(data, {
      onSuccess: () => form.reset(),
    });
  }

  return (
    <div className="bg-card border border-border/50 rounded-lg p-6 md:p-8 shadow-lg">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-primary mb-2">Request a Quote</h3>
        <p className="text-muted-foreground text-sm">
          Fill out the form below and our sales team will respond within 24 hours.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} className="bg-muted/50 border-border focus:border-accent focus:ring-accent/20" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Business Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@company.com" {...field} className="bg-muted/50 border-border focus:border-accent focus:ring-accent/20" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 000-0000" {...field} value={field.value || ""} className="bg-muted/50 border-border focus:border-accent focus:ring-accent/20" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Message</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell us about your requirements..." 
                    className="min-h-[120px] bg-muted/50 border-border focus:border-accent focus:ring-accent/20 resize-none" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-widest h-12 mt-2"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
              </>
            ) : (
              <>
                Submit Inquiry <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            By submitting this form, you agree to our privacy policy. Your information is safe with us.
          </p>
        </form>
      </Form>
    </div>
  );
}
