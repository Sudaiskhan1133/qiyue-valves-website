import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail, MapPin, Linkedin, Facebook, Twitter } from "lucide-react";
import { useState } from "react";
import logoImg from "/logo.png";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 text-sm hidden md:block border-b border-primary/20">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-6">
            <a href="tel:+8618364290533" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Phone className="w-4 h-4 text-accent" /> +86 183 6429 0533
            </a>
            <a href="mailto:contact@qiyuevalves.com" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Mail className="w-4 h-4 text-accent" /> contact@qiyuevalves.com
            </a>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-accent transition-colors"><Linkedin className="w-4 h-4" /></a>
            <a href="#" className="hover:text-accent transition-colors"><Facebook className="w-4 h-4" /></a>
            <a href="#" className="hover:text-accent transition-colors"><Twitter className="w-4 h-4" /></a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md border-b border-border/50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <img src="/logo.png" alt="Qingdao Qiyue Logo" className="w-12 h-12 object-contain" />
              <div>
                <h1 className="text-xl font-bold leading-none tracking-tighter text-foreground group-hover:text-primary transition-colors uppercase">Qingdao Qiyue</h1>
                <p className="text-[10px] text-muted-foreground font-sans tracking-widest uppercase">Technology Equipment Co., Ltd.</p>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={`text-sm font-medium uppercase tracking-wider cursor-pointer transition-colors hover:text-accent ${isActive(link.href) ? 'text-primary font-bold border-b-2 border-accent' : 'text-muted-foreground'}`}>
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link href="/contact">
              <Button className="hidden md:flex bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-wide">
                Get a Quote
              </Button>
            </Link>
            
            <button 
              className="md:hidden p-2 text-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-border absolute w-full shadow-lg">
            <nav className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span 
                    className={`block py-2 text-sm font-medium uppercase tracking-wider ${isActive(link.href) ? 'text-primary' : 'text-muted-foreground'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              <Link href="/contact">
                <Button className="w-full bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-wide mt-2">
                  Get a Quote
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground pt-16 pb-8 border-t-4 border-accent">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src={logoImg} alt="Qiyue Logo" className="w-10 h-10 object-contain bg-white rounded p-1" />
              <h3 className="text-white text-lg m-0 font-bold leading-tight">QINGDAO QIYUE</h3>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              Qingdao Qiyue Technology Equipment Co., Ltd. is a leading manufacturer of high-grade industrial valves. We deliver quality, precision, and reliability for global projects.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-primary-foreground/70 hover:text-accent transition-colors cursor-pointer text-sm">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white mb-6">Our Products</h4>
            <ul className="space-y-3">
              <li><Link href="/products?category=valves"><span className="text-primary-foreground/70 hover:text-accent transition-colors cursor-pointer text-sm">Industrial Valves</span></Link></li>
              <li><Link href="/products?category=pumps"><span className="text-primary-foreground/70 hover:text-accent transition-colors cursor-pointer text-sm">Heavy Duty Pumps</span></Link></li>
              <li><Link href="/products?category=pipes"><span className="text-primary-foreground/70 hover:text-accent transition-colors cursor-pointer text-sm">Steel Pipes</span></Link></li>
              <li><Link href="/products?category=fittings"><span className="text-primary-foreground/70 hover:text-accent transition-colors cursor-pointer text-sm">Pipe Fittings</span></Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <MapPin className="w-5 h-5 text-accent shrink-0" />
                <a href="https://maps.google.com/?q=28th+Floor+Huishang+International+No.467+Middle+Changjiang+Road+Huangdao+District+Qingdao+Shandong+China" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  28th Floor, Huishang International, No. 467, Middle Changjiang Road, Huangdao District, Qingdao City, Shandong Province, China
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <a href="tel:+8618364290533" className="hover:text-accent transition-colors">+86 183 6429 0533</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <a href="mailto:contact@qiyuevalves.com" className="hover:text-accent transition-colors">contact@qiyuevalves.com</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="container mx-auto px-4 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} Qingdao Qiyue Technology Equipment Co., Ltd. All rights reserved.
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/8618364290533" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center gap-2 group"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-medium">Chat with us</span>
      </a>
    </div>
  );
}
