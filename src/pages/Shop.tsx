
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProducts } from "@/hooks/useProducts";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const { data: products = [], isLoading } = useProducts();

  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(product => 
    selectedCategory === "All" || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="mobile-safe-bottom">
      <Header />
      
      <div className="min-h-screen bg-vanilla-cream">
        {/* Header */}
        <section className="gradient-bg py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-vanilla-brown mb-4">
              Premium Vanilla Collection
            </h1>
            <p className="text-xl text-vanilla-brown/80 max-w-2xl mx-auto">
              Discover our complete range of Madagascar vanilla products, 
              from premium beans to artisanal extracts.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-vanilla-beige/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className={`
                      ${selectedCategory === category 
                        ? "bg-vanilla-brown text-vanilla-cream" 
                        : "border-vanilla-brown text-vanilla-brown hover:bg-vanilla-brown/5"
                      }
                    `}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Sort Filter */}
              <div className="flex items-center gap-2">
                <span className="text-vanilla-brown/70 text-sm">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-vanilla-beige rounded-md px-3 py-1 bg-vanilla-cream text-vanilla-brown"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <div className="aspect-square bg-vanilla-beige/20 rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-vanilla-beige/20 rounded mb-2"></div>
                      <div className="h-6 bg-vanilla-beige/20 rounded mb-3"></div>
                      <div className="h-4 bg-vanilla-beige/20 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {!isLoading && sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-vanilla-brown/70 text-lg">
                  No products found in this category.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
