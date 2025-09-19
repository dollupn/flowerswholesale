
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Truck, Heart } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Award,
      title: "Premium Quality",
      description: "We source only the finest Grade A vanilla beans from trusted Madagascar farmers."
    },
    {
      icon: Users,
      title: "Direct Trade",
      description: "Building long-term relationships with vanilla farmers for fair and sustainable trade."
    },
    {
      icon: Truck,
      title: "Fresh Delivery",
      description: "Fast, reliable delivery across Mauritius to ensure maximum freshness."
    },
    {
      icon: Heart,
      title: "Passion Driven",
      description: "Our love for authentic vanilla drives everything we do at Vanilluxe."
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
              Born from a passion for authentic flavors and a deep connection to Madagascar's 
              vanilla heritage, Vanilluxe brings you the world's finest vanilla to Mauritius.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-serif font-bold text-vanilla-brown mb-6">
                  From Madagascar Farms to Your Kitchen
                </h2>
                <div className="space-y-4 text-vanilla-brown/80 leading-relaxed">
                  <p>
                    Our journey began with a simple mission: to bring the authentic taste of 
                    Madagascar vanilla to the beautiful island of Mauritius. We recognized that 
                    despite Mauritius's rich culinary heritage, access to premium vanilla was limited.
                  </p>
                  <p>
                    Working directly with vanilla farmers in the Sambava region of Madagascar, 
                    we've established relationships built on trust, quality, and fair trade practices. 
                    This connection ensures that every vanilla bean meets our exacting standards 
                    while supporting the livelihoods of farming communities.
                  </p>
                  <p>
                    Today, Vanilluxe proudly serves chefs, bakers, and food enthusiasts across 
                    Mauritius with vanilla products that represent the pinnacle of quality and authenticity.
                  </p>
                </div>
              </div>
              <div>
                <img
                  src="public/lovable-uploads/farm.webp?w=600"
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
                    To become the premier destination for authentic Madagascar vanilla in the 
                    Indian Ocean region, known for uncompromising quality and exceptional service.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="luxury-shadow border-vanilla-beige/30 bg-vanilla-cream">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-serif font-bold text-vanilla-brown mb-4">
                    Our Mission
                  </h3>
                  <p className="text-vanilla-brown/80 leading-relaxed">
                    To deliver pure, premium vanilla products that elevate culinary experiences 
                    while supporting sustainable farming practices and building lasting relationships 
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
                  src="public/lovable-uploads/process.webp?w=600"
                  alt="Vanilla processing"
                  className="w-full h-auto rounded-2xl luxury-shadow"
                />
              </div>
              <div>
                <h2 className="text-3xl font-serif font-bold mb-6">
                  Sourcing Transparency
                </h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    We believe in complete transparency about our sourcing practices. 
                    Every batch of vanilla beans can be traced back to specific farms 
                    in the Sambava and Antalaha regions of Madagascar.
                  </p>
                  <p>
                    Our vanilla undergoes traditional curing processes that take 6-9 months, 
                    ensuring the complex flavor profile that Madagascar vanilla is famous for. 
                    We work only with farmers who maintain organic and sustainable practices.
                  </p>
                  <p>
                    Each shipment is carefully inspected for moisture content, appearance, 
                    and aroma before being approved for sale. This rigorous quality control 
                    ensures that every Vanilluxe product meets our high standards.
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
              Ready to Experience Premium Vanilla?
            </h2>
            <p className="text-vanilla-brown/80 mb-8 max-w-2xl mx-auto">
              Join hundreds of satisfied customers across Mauritius who trust Vanilluxe 
              for their vanilla needs. From professional chefs to home bakers, 
              we're here to elevate your culinary creations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.open("/shop", "_self")}
                className="bg-vanilla-brown text-vanilla-cream px-8 py-3 rounded-lg hover:bg-vanilla-brown/90 transition-colors"
              >
                Shop Now
              </button>
              <button 
                onClick={() => window.open("https://wa.me/23052345678", "_blank")}
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
