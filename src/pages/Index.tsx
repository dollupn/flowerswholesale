
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star, Truck, Shield, Award } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFeaturedProducts } from "@/hooks/useProducts";

const Index = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { data: featuredProducts = [], isLoading } = useFeaturedProducts();

  const testimonials = [
    {
      name: "Sophie Laurent",
      role: "Chef at Le Meridien",
      text: "Vanilluxe vanilla beans are exceptional. The aroma and flavor are unmatched in Mauritius.",
      rating: 5
    },
    {
      name: "Raj Patel",
      role: "Home Baker",
      text: "Finally found authentic Madagascar vanilla in Mauritius! My desserts have never tasted better.",
      rating: 5
    },
    {
      name: "Marie Dubois",
      role: "Restaurant Owner",
      text: "The quality is consistent and the flavor is pure. Our customers love our vanilla desserts now.",
      rating: 5
    }
  ];

  const features = [
    {
      icon: Award,
      title: "Premium Source",
      description: "Direct from Madagascar's finest vanilla farms"
    },
    {
      icon: Shield,
      title: "Authentic Flavor",
      description: "100% pure, no artificial additives or preservatives"
    },
    {
      icon: Star,
      title: "Handpicked Quality",
      description: "Grade A beans selected by experienced farmers"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="gradient-bg min-h-[85vh] flex items-center">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-vanilla-brown mb-6">
                Pure Madagascar
                <span className="block text-vanilla-brown/80">Vanilla</span>
              </h1>
              <p className="text-xl text-vanilla-brown/80 mb-8 leading-relaxed">
                Delivered with Elegance to Mauritius. Experience the authentic taste of 
                premium vanilla beans, sourced directly from Madagascar's finest farms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild
                  size="lg" 
                  className="bg-vanilla-brown hover:bg-vanilla-brown/90 text-vanilla-cream px-8"
                >
                  <Link to="/shop">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Shop Now
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline" 
                  size="lg"
                  className="border-vanilla-brown text-vanilla-brown hover:bg-vanilla-brown/5"
                >
                  <Link to="/about">Learn Our Story</Link>
                </Button>
              </div>
            </div>
            <div className="animate-slide-up">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1586049332816-6de5d1e8e38b?w=600"
                  alt="Premium Madagascar Vanilla Beans"
                  className="w-full h-auto rounded-2xl luxury-shadow"
                />
                <div className="absolute -bottom-6 -left-6 bg-vanilla-yellow p-4 rounded-xl luxury-shadow">
                  <p className="text-vanilla-brown font-semibold">Grade A Quality</p>
                  <p className="text-vanilla-brown/70 text-sm">Directly sourced</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-vanilla-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-vanilla-brown mb-4">
              Featured Products
            </h2>
            <p className="text-vanilla-brown/70 max-w-2xl mx-auto">
              Discover our premium selection of Madagascar vanilla products, 
              perfect for gourmet cooking and baking.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="aspect-square bg-vanilla-beige/20 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-vanilla-beige/20 rounded mb-2"></div>
                    <div className="h-6 bg-vanilla-beige/20 rounded mb-3"></div>
                    <div className="h-4 bg-vanilla-beige/20 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
          
          <div className="text-center">
            <Button asChild size="lg" variant="outline" className="border-vanilla-brown text-vanilla-brown">
              <Link to="/shop">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Vanilluxe */}
      <section className="py-16 bg-vanilla-beige/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-vanilla-brown mb-4">
              Why Choose Vanilluxe?
            </h2>
            <p className="text-vanilla-brown/70 max-w-2xl mx-auto">
              We're committed to bringing you the finest vanilla experience in Mauritius.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center luxury-shadow border-vanilla-beige/30 bg-vanilla-cream">
                <CardContent className="p-8">
                  <div className="bg-vanilla-yellow/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-vanilla-brown" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-vanilla-brown mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-vanilla-brown/70">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-vanilla-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-vanilla-brown mb-4">
              What Our Customers Say
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="luxury-shadow border-vanilla-beige/30 bg-vanilla-cream">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-vanilla-yellow fill-current" />
                  ))}
                </div>
                <blockquote className="text-lg text-vanilla-brown/80 mb-6 italic">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                <div>
                  <p className="font-semibold text-vanilla-brown">
                    {testimonials[currentTestimonial].name}
                  </p>
                  <p className="text-vanilla-brown/60">
                    {testimonials[currentTestimonial].role}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-vanilla-brown' : 'bg-vanilla-brown/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Info */}
      <section className="py-12 bg-vanilla-brown text-vanilla-cream">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-3">
              <Truck className="w-6 h-6" />
              <span className="font-medium">Island-wide Delivery</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-vanilla-cream/30"></div>
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6" />
              <span className="font-medium">Quality Guaranteed</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Index;
