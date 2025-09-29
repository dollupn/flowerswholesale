import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Star,
  Truck,
  Shield,
  ChevronLeft,
  ChevronRight,
  Flower2,
  Palette,
  Sprout
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentRecipe, setCurrentRecipe] = useState(0);
  const { data: featuredProducts = [], isLoading } = useFeaturedProducts();
  const { t } = useLanguage();

  const testimonials = [
    {
      name: "Priya",
      role: "Wedding Planner",
      text: "Flowers Wholesale Mauritius provides the freshest blooms for our events. Consistently reliable quality.",
      rating: 5
    },
    {
      name: "Marc Laurent",
      role: "Hotel Manager",
      text: "We trust them for all our floral arrangements. Fresh deliveries and beautiful varieties every time.",
      rating: 5
    },
    {
      name: "Sophie",
      role: "Event Coordinator",
      text: "Their roses and orchids are stunning. Perfect for corporate events and special occasions.",
      rating: 5
    }
  ];
  const testimonialCount = testimonials.length;

  const features = [
    {
      icon: Flower2,
      title: t("whyChoose.premiumSource"),
      description: t("whyChoose.premiumSourceDesc")
    },
    {
      icon: Palette,
      title: t("whyChoose.authenticFlavor"),
      description: t("whyChoose.authenticFlavorDesc")
    },
    {
      icon: Sprout,
      title: t("whyChoose.handpicked"),
      description: t("whyChoose.handpickedDesc")
    }
  ];

  // Flower arrangement guides with paths
  const recipes = [
    {
      title: "Luxe Wedding Tablescape",
      description:
        "Layer romantic roses, lisianthus, and trailing greenery to create statement centerpieces for island weddings.",
      image:
        "https://images.unsplash.com/photo-1511288590151-1e47ef91167d?auto=format&fit=crop&w=1200&q=80",
      prepTime: "Design time: 45 mins",
      serves: "10 centerpieces",
      path: "/contact"
    },
    {
      title: "Corporate Welcome Arrangement",
      description:
        "Blend elegant orchids with tropical foliage for reception desks and conference stages that impress your guests.",
      image:
        "https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?auto=format&fit=crop&w=1200&q=80",
      prepTime: "Design time: 1 hour",
      serves: "Lobby display",
      path: "/contact"
    },
    {
      title: "Seasonal Gift Bouquet",
      description:
        "Combine colourful seasonal blooms with textured accents for thoughtful bouquets ready to delight.",
      image:
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
      prepTime: "Design time: 20 mins",
      serves: "5 bouquets",
      path: "/shop"
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

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1800&q=80"
          alt="Colorful assortment of fresh flowers"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-vanilla-cream via-vanilla-beige/80 to-vanilla-brown/20 pointer-events-none" />
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-vanilla-brown mb-6">
                {t("hero.title1")}
                <span className="block text-vanilla-brown/80">{t("hero.title2")}</span>
              </h1>
              <p className="text-xl text-vanilla-brown/80 mb-8 leading-relaxed">
                {t("hero.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-vanilla-brown hover:bg-vanilla-brown/90 text-vanilla-cream px-8 shadow-lg"
                >
                  <Link to="/shop">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {t("hero.shopNow")}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-vanilla-brown text-vanilla-brown hover:bg-vanilla-brown/5"
                >
                  <Link to="/about">{t("hero.learnStory")}</Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-vanilla-brown/70">
                {t("hero.wholesaleMinimum")}
              </p>
            </div>
            <div className="hidden lg:block relative">
              <div className="grid grid-cols-2 gap-5">
                <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[3/4]">
                  <img
                    src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80"
                    alt="Wedding florist arranging roses"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-5">
                  <div className="rounded-3xl overflow-hidden shadow-xl aspect-square">
                    <img
                      src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=700&q=80"
                      alt="Colorful bouquet of seasonal flowers"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="rounded-3xl overflow-hidden shadow-xl aspect-square">
                    <img
                      src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=700&q=80"
                      alt="Freshly prepared floral centerpieces"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-vanilla-yellow px-6 py-4 rounded-xl luxury-shadow">
                <p className="text-vanilla-brown font-semibold">{t("hero.gradeA")}</p>
                <p className="text-vanilla-brown/70 text-sm">{t("hero.directlySourced")}</p>
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
              {t("featured.title")}
            </h2>
            <p className="text-vanilla-brown/70 max-w-2xl mx-auto">
              {t("featured.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {isLoading ? (
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
              <Link to="/shop">{t("featured.viewAll")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Vanilluxe */}
      <section className="py-16 bg-vanilla-beige/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-vanilla-brown mb-4">
              {t("whyChoose.title")}
            </h2>
            <p className="text-vanilla-brown/70 max-w-2xl mx-auto">
              {t("whyChoose.description")}
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

      {/* Vanilla Recipe Carousel (refined + dedicated page links) */}
      <section className="py-16 bg-vanilla-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-vanilla-brown mb-4">
              {t("recipes.title")}
            </h2>
            <p className="text-vanilla-brown/70 max-w-2xl mx-auto">
              {t("recipes.description")}
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <button
              type="button"
              onClick={() =>
                setCurrentRecipe((prev) => (prev - 1 + recipes.length) % recipes.length)
              }
              className="absolute left-2 md:-left-12 top-1/2 -translate-y-1/2 bg-vanilla-brown text-vanilla-cream p-2 md:p-3 rounded-full shadow-lg hover:bg-vanilla-brown/90 transition z-10"
              aria-label="Previous recipe"
            >
              <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentRecipe((prev) => (prev + 1) % recipes.length)}
              className="absolute right-2 md:-right-12 top-1/2 -translate-y-1/2 bg-vanilla-brown text-vanilla-cream p-2 md:p-3 rounded-full shadow-lg hover:bg-vanilla-brown/90 transition z-10"
              aria-label="Next recipe"
            >
              <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
            </button>

            <Card className="luxury-shadow border-vanilla-beige/30 bg-vanilla-cream">
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
                        {t("recipes.featuredRecipe")}
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
                        {t("recipes.madagascarVanilla")}
                      </span>
                    </div>

                    {recipes[currentRecipe].path && (
                      <Button
                        asChild
                        size="lg"
                        className="bg-vanilla-brown text-vanilla-cream hover:bg-vanilla-brown/90"
                      >
                        <Link to={recipes[currentRecipe].path}>{t("recipes.viewFullRecipe")}</Link>
                      </Button>
                    )}

                    <div className="text-sm text-vanilla-brown/60">
                      <p className="font-semibold text-vanilla-brown">{t("recipes.chefTip")}</p>
                      <p>
                        {t("recipes.chefTipDesc")}
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
              {t("testimonials.title")}
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
              <span className="font-medium">{t("delivery.islandWide")}</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-vanilla-cream/30"></div>
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6" />
              <span className="font-medium">{t("delivery.qualityGuaranteed")}</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
