import { Layout } from "@/components/Layout";
import { Award, CheckCircle, Users, Globe } from "lucide-react";
import { Helmet } from "react-helmet";

export default function About() {
  return (
    <Layout>
      <Helmet>
        <title>About Us - Qingdao Qiyue Technology Equipment Co., Ltd. | Valve Manufacturer Since 1998</title>
        <meta name="description" content="Learn about Qingdao Qiyue Technology Equipment Co., Ltd. - ISO 9001 certified industrial valve manufacturer with 25+ years experience, exporting to 50+ countries. Quality engineering, precision manufacturing." />
        <meta name="keywords" content="Qingdao Qiyue about, valve manufacturer history, ISO 9001 valve company, China valve factory, industrial valve quality control, NDT testing valves, hydrostatic testing" />
        <meta property="og:title" content="About Qingdao Qiyue - Industrial Valve Excellence Since 1998" />
        <meta property="og:description" content="ISO 9001 certified valve manufacturer with 25+ years of experience, serving 50+ countries worldwide." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://qiyuevalves.com/about" />
        <link rel="canonical" href="https://qiyuevalves.com/about" />
      </Helmet>

      {/* Page Header */}
      <div className="bg-primary py-20 text-white relative overflow-hidden">
        {/* Unsplash abstract engineering bg */}
        <img 
          src="https://images.unsplash.com/photo-1565793298595-6a879b1d9492?q=80&w=2071&auto=format&fit=crop" 
          alt="Engineering Blueprint" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">About Qingdao Qiyue</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Innovating industrial valve manufacturing since 1998. We build the components that power global infrastructure.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Mission/Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-primary">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              At Qingdao Qiyue Technology Equipment Co., Ltd., our mission is to deliver precision-engineered industrial valves that exceed international quality standards.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We are committed to sustainable manufacturing practices, continuous innovation, and the safety of our workforce.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop" className="rounded-lg shadow-lg w-full h-48 object-cover" alt="Factory Interior" />
            <img src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2070&auto=format&fit=crop" className="rounded-lg shadow-lg w-full h-48 object-cover mt-8" alt="Engineer at work" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          {[
            { icon: Award, title: "ISO 9001", desc: "Certified Quality" },
            { icon: Globe, title: "50+ Countries", desc: "Global Export" },
            { icon: Users, title: "500+ Staff", desc: "Expert Team" },
            { icon: CheckCircle, title: "25 Years", desc: "Industry Leadership" },
          ].map((item, i) => (
            <div key={i} className="bg-secondary/20 p-8 rounded-lg text-center border border-border">
              <item.icon className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Quality Control Section */}
        <div className="bg-primary rounded-2xl overflow-hidden text-white mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-12">
              <h2 className="text-3xl font-bold mb-6">Uncompromising Quality</h2>
              <p className="text-primary-foreground/80 mb-8 leading-relaxed">
                Our Quality Assurance department operates independently from production to ensure unbiased testing. Every component undergoes rigorous inspection using CMM, ultrasonic testing, and pressure testing protocols.
              </p>
              <ul className="space-y-4">
                {[
                  "Material traceability for 100% of components",
                  "In-house NDT (Non-Destructive Testing) capabilities",
                  "Hydrostatic testing up to 20,000 PSI",
                  "Third-party inspection coordination (TUV, DNV, BV)"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="h-full min-h-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop" 
                alt="Quality Inspection" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
