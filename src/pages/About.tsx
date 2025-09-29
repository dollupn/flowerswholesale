
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Truck, Heart } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Award,
      title: "Premium Quality",
      description: "We source only the freshest flowers from trusted local and international suppliers."
    },
    {
      icon: Users,
      title: "Direct Sourcing",
      description: "Building long-term relationships with growers for consistent quality and fair pricing."
    },
    {
      icon: Truck,
      title: "Fresh Delivery",
      description: "Fast, reliable delivery across Mauritius to ensure maximum freshness."
    },
    {
      icon: Heart,
      title: "Passion Driven",
      description: "Our love for fresh flowers drives everything we do at Flowers Wholesale Mauritius."
    }
  ];

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-vanilla-cream">
        {/* Hero Section */}
        <section className="gradient-bg py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-vanilla-brown mb-6">
              Our Story
            </h1>
            <p className="text-xl text-vanilla-brown/80 max-w-3xl mx-auto leading-relaxed">
              Born from a passion for fresh blooms and quality service, 
              Flowers Wholesale Mauritius brings you premium wholesale flowers for every occasion.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-serif font-bold text-vanilla-brown mb-6">
                  From Local & International Suppliers to Your Events
                </h2>
                <div className="space-y-4 text-vanilla-brown/80 leading-relaxed">
                  <p>
                    Our journey began with a simple mission: to provide fresh, high-quality wholesale flowers 
                    to event planners, florists, and businesses across Mauritius. We recognized the need 
                    for reliable wholesale flower services on the island.
                  </p>
                  <p>
                    Working with local growers and trusted international suppliers, 
                    we've established relationships built on trust, quality, and consistency. 
                    This network ensures that every stem meets our exacting standards 
                    while supporting the local floral industry.
                  </p>
                  <p>
                    Today, Flowers Wholesale Mauritius proudly serves event planners, wedding organizers, 
                    hotels, and florists across Mauritius with fresh flowers that create unforgettable moments.
                  </p>
                </div>
              </div>
              <div>
                <img
                  src="/lovable-uploads/farm.webp?w=600"
                  alt="Madagascar vanilla farm"
                  className="w-full h-auto rounded-2xl luxury-shadow"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-16 bg-vanilla-beige/20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <Card className="luxury-shadow border-vanilla-beige/30 bg-vanilla-cream">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-serif font-bold text-vanilla-brown mb-4">
                    Our Vision
                  </h3>
                  <p className="text-vanilla-brown/80 leading-relaxed">
                    To become the premier wholesale flower supplier in Mauritius, 
                    known for freshness, variety, and exceptional service.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="luxury-shadow border-vanilla-beige/30 bg-vanilla-cream">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-serif font-bold text-vanilla-brown mb-4">
                    Our Mission
                  </h3>
                  <p className="text-vanilla-brown/80 leading-relaxed">
                    To deliver fresh, premium flowers that elevate every occasion 
                    while supporting sustainable practices and building lasting relationships 
                    with our customers and suppliers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-vanilla-brown mb-4">
                What We Stand For
              </h2>
              <p className="text-vanilla-brown/70 max-w-2xl mx-auto">
                Our values guide everything we do, from sourcing to delivery.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center luxury-shadow border-vanilla-beige/30 bg-vanilla-cream hover-lift">
                  <CardContent className="p-6">
                    <div className="bg-vanilla-yellow/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-8 h-8 text-vanilla-brown" />
                    </div>
                    <h3 className="text-lg font-serif font-semibold text-vanilla-brown mb-3">
                      {value.title}
                    </h3>
                    <p className="text-vanilla-brown/70 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Sourcing Transparency */}
        <section className="py-16 bg-vanilla-brown text-vanilla-cream">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src="/lovable-uploads/process.webp?w=600"
                  alt="Vanilla processing"
                  className="w-full h-auto rounded-2xl luxury-shadow"
                />
              </div>
              <div>
                <h2 className="text-3xl font-serif font-bold mb-6">
                  Quality & Freshness
                </h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    We believe in complete transparency about our sourcing and quality standards. 
                    Every flower delivery is carefully selected and inspected 
                    to ensure peak freshness and quality.
                  </p>
                  <p>
                    Our flowers are sourced from temperature-controlled environments and 
                    delivered using proper cold-chain logistics. 
                    We work only with suppliers who maintain the highest standards.
                  </p>
                  <p>
                    Each shipment is carefully inspected for freshness, stem quality, 
                    and bloom condition before being approved for delivery. This rigorous quality control 
                    ensures that every Flowers Wholesale Mauritius order exceeds expectations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team or Contact CTA */}
        <section className="py-16 bg-vanilla-cream">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-serif font-bold text-vanilla-brown mb-6">
              Ready for Fresh Wholesale Flowers?
            </h2>
            <p className="text-vanilla-brown/80 mb-8 max-w-2xl mx-auto">
              Join event planners, florists, and businesses across Mauritius who trust 
              Flowers Wholesale Mauritius for their flower needs. From weddings to corporate events, 
              we're here to make your occasions bloom beautifully.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.open("/shop", "_self")}
                className="bg-vanilla-brown text-vanilla-cream px-8 py-3 rounded-lg hover:bg-vanilla-brown/90 transition-colors"
              >
                Shop Now
              </button>
              <button 
                onClick={() => window.open("https://wa.me/23059447719", "_blank")}
                className="border border-vanilla-brown text-vanilla-brown px-8 py-3 rounded-lg hover:bg-vanilla-brown/5 transition-colors"
              >
                Contact Us
              </button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default About;
