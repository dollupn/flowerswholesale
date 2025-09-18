
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Star,
  Truck,
  Shield,
  Award,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFeaturedProducts } from "@/hooks/useProducts";

const Index = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentRecipe, setCurrentRecipe] = useState(0);
  const { data: featuredProducts = [], isLoading } = useFeaturedProducts();

  const testimonials = [
    {
      name: "Neha",
      role: "Home Baker",
      text: "Vanilluxe vanilla beans are exceptional. The aroma and flavor are unmatched in Mauritius.",
      rating: 5
    },
    {
      name: "Raj Patel",
      role: "Chef",
      text: "Finally found authentic Madagascar vanilla in Mauritius! My desserts have never tasted better.",
      rating: 5
    },
    {
      name: "Lea",
      role: "Restaurant Owner",
      text: "The quality is consistent and the flavor is pure. Our customers love our vanilla desserts now.",
      rating: 5
    }
  ];

  const testimonialCount = testimonials.length;

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

  const recipes = [
    {
      title: "Vanilla Bean Crème Brûlée",
      description:
        "A silky custard infused with Madagascar vanilla, finished with a caramelised sugar crust.",
      image:
        "https://images.unsplash.com/photo-1541959833400-049d37f98ccd?auto=format&fit=crop&w=1200&q=80",
      prepTime: "45 mins",
      serves: "Serves 4",
      path: "/recipes/vanilla-bean-creme-brulee"
    },
    {
      title: "Mauritian Vanilla Gateau",
      description:
        "A moist butter cake layered with vanilla bean pastry cream and toasted coconut flakes.",
      image:
        "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80",
      prepTime: "1 hr 10 mins",
      serves: "Serves 8",
      path: "/recipes/mauritian-vanilla-gateau"
    },
    {
      title: "Vanilla & Spice Iced Latte",
      description:
        "Cold-brew coffee sweetened with vanilla bean syrup and a touch of island spices for a refreshing treat.",
      image:
        "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&w=1200&q=80",
      prepTime: "15 mins",
      serves: "Serves 2",
      path: "/recipes/vanilla-spice-iced-latte"
    }
  ];

  const recipeCount = recipes.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonialCount);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonialCount]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentRecipe((prev) => (prev + 1) % recipeCount);
    }, 6000);
    return () => clearInterval(timer);
  }, [recipeCount]);

  return (
    <div className="mobile-safe-bottom">
      <Header />
      
      {/* Hero Section (full background video) */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background video */}
        <video
          src="https://dollupboutique.com/wp-content/uploads/2025/09/vanilla.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="https://dollupboutique.com/wp-content/uploads/2025/09/vanilla-poster.jpg" // optional
          className="absolute inset-0 w-full h-full object-cover motion-safe:opacity-100"
        />

        {/* Readability overlay (tweak gradient/opacity if needed) */}
        <div className="absolute inset-0 bg-gradient-to-r from-vanilla-cream via-vanilla-cream/80 to-transparent pointer-events-none" />

        {/* Content on top */}
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-vanilla-brown mb-6">
                Pure Madagascar
                <span className="block text-vanilla-brown/80">Vanilla</span>
              </h1>
              <p className="text-xl text-vanilla-brown/80 mb-8 leading-relaxed">
                Delivered with Elegance to Mauritius. Experience the authentic taste of
                premium vanilla beans, sourced directly from Madagascar&apos;s finest farms.
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

            {/* Optional floating badge on the right side of hero */}
            <div className="hidden lg:block relative">
              <div className="absolute bottom-6 left-6 bg-vanilla-yellow p-4 rounded-xl luxury-shadow">
                <p className="text-vanilla-brown font-semibold">Grade A Quality</p>
                <p className="text-vanilla-brown/70 text-sm">Directly sourced</p>
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

      {/* Vanilla Recipe Carousel */}
      <section className="bg-[#738b16] py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Vanilla Recipes
            </h2>
            <p className="mx-auto max-w-2xl text-white/80">
              Explore decadent ways to savour our Madagascar vanilla with easy-to-follow recipes.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <button
              type="button"
              onClick={() =>
                setCurrentRecipe((prev) => (prev - 1 + recipes.length) % recipes.length)
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white p-2.5 text-[#738b16] shadow-lg transition hover:bg-white/90 sm:-left-12 sm:p-3"
              aria-label="Previous recipe"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentRecipe((prev) => (prev + 1) % recipes.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white p-2.5 text-[#738b16] shadow-lg transition hover:bg-white/90 sm:-right-12 sm:p-3"
              aria-label="Next recipe"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <Card className="luxury-shadow border-vanilla-beige/40 bg-white/95 backdrop-blur">
              <CardContent className="p-6 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="overflow-hidden rounded-2xl shadow-md aspect-[4/3]">
                    <img
                      src={recipes[currentRecipe].image}
                      alt={recipes[currentRecipe].title}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-5">
                    <div>
                      <span className="inline-block uppercase tracking-widest text-xs text-vanilla-brown/60 mb-2">
                        Featured Recipe
                      </span>
                      <h3 className="text-2xl md:text-3xl font-serif font-semibold text-vanilla-brown mb-3">
                        {recipes[currentRecipe].title}
                      </h3>
                      <p className="text-vanilla-brown/70 leading-relaxed">
                        {recipes[currentRecipe].description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm font-medium text-vanilla-brown">
                      <span className="bg-vanilla-yellow/30 px-3 py-1 rounded-full">
                        {recipes[currentRecipe].prepTime}
                      </span>
                      <span className="bg-vanilla-yellow/30 px-3 py-1 rounded-full">
                        {recipes[currentRecipe].serves}
                      </span>
                      <span className="bg-vanilla-yellow/30 px-3 py-1 rounded-full">
                        Madagascar Vanilla
                      </span>
                    </div>

                    <Button
                      asChild
                      className="bg-[#738b16] text-white hover:bg-[#5c6d11]"
                      size="lg"
                    >
                      <Link to={recipes[currentRecipe].path}>View full recipe</Link>
                    </Button>

                    <div className="text-sm text-vanilla-brown/60">
                      <p className="font-semibold text-vanilla-brown">Chef's Tip</p>
                      <p>
                        Split the vanilla bean lengthwise and scrape out the seeds to infuse the richest flavour
                        into your dessert.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center mt-6 space-x-2">
              {recipes.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentRecipe(index)}
                  className={`h-2.5 w-8 rounded-full transition-colors ${
                    currentRecipe === index ? "bg-vanilla-brown" : "bg-vanilla-brown/30"
                  }`}
                  aria-label={`View recipe ${index + 1}`}
                />
              ))}
            </div>
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
    </div>
  );
};

export default Index;
