import { Layout } from "@/components/Layout";
import { InquiryForm } from "@/components/InquiryForm";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";
import { Helmet } from "react-helmet";

const GOOGLE_MAPS_URL = "https://maps.google.com/?q=28th+Floor+Huishang+International+No.467+Middle+Changjiang+Road+Huangdao+District+Qingdao+Shandong+China";

export default function Contact() {
  return (
    <Layout>
      <Helmet>
        <title>Contact Us - Qingdao Qiyue Technology Equipment | Get a Valve Quote</title>
        <meta name="description" content="Contact Qingdao Qiyue Technology Equipment Co., Ltd. for industrial valve inquiries, quotations, and technical support. Phone: +86 183 6429 0533. Email: contact@qiyuevalves.com. Located in Qingdao, Shandong, China." />
        <meta name="keywords" content="contact Qingdao Qiyue, valve quote request, industrial valve inquiry, valve manufacturer contact, Qingdao valve company phone, valve supplier email" />
        <meta property="og:title" content="Contact Qingdao Qiyue - Get a Valve Quote" />
        <meta property="og:description" content="Reach out for industrial valve inquiries and quotations. Our team is ready to assist with your project requirements." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://qiyuevalves.com/contact" />
        <link rel="canonical" href="https://qiyuevalves.com/contact" />
      </Helmet>

      <div className="bg-secondary/30 py-12 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 font-display">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? Our team is ready to discuss your requirements and provide a detailed quotation.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-6 text-primary">Get in Touch</h2>
              <div className="space-y-8">
                <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group" data-testid="link-address">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 flex items-center gap-2">Headquarters <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" /></h3>
                    <p className="text-muted-foreground group-hover:text-primary transition-colors">
                      28th Floor, Huishang International, No. 467, Middle Changjiang Road,<br />
                      Huangdao District, Qingdao City, Shandong Province, China
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 text-primary">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Phone / WhatsApp</h3>
                    <a href="tel:+8618364290533" className="text-muted-foreground hover:text-primary transition-colors block mb-1" data-testid="link-phone">+86 183 6429 0533</a>
                    <a href="https://wa.me/8618364290533" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors block text-sm" data-testid="link-whatsapp">Chat on WhatsApp</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Email</h3>
                    <a href="mailto:contact@qiyuevalves.com" className="text-muted-foreground hover:text-primary transition-colors block" data-testid="link-email">contact@qiyuevalves.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 text-primary">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Working Hours</h3>
                    <p className="text-muted-foreground">Mon - Fri: 8:00 AM - 6:00 PM (CST)</p>
                    <p className="text-muted-foreground">Sat - Sun: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <a 
              href={GOOGLE_MAPS_URL}
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-muted w-full h-64 rounded-lg overflow-hidden relative group cursor-pointer border border-border hover:border-primary transition-colors"
              data-testid="link-map"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.5!2d120.19!3d35.96!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDU3JzM2LjAiTiAxMjDCsDExJzI0LjAiRQ!5e0!3m2!1sen!2s!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Qingdao Qiyue Location"
                className="pointer-events-none"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                <span className="bg-primary text-white px-4 py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-sm">
                  <ExternalLink className="w-4 h-4" /> Open in Google Maps
                </span>
              </div>
            </a>
          </div>

          {/* Form */}
          <div>
            <InquiryForm />
          </div>
        </div>
      </div>
    </Layout>
  );
}
