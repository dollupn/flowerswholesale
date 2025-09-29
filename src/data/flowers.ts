export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  featured: boolean;
  inStock: boolean;
  details: {
    origin: string;
    grade: string;
    processing: string;
    uses: string[];
    storage: string;
  };
  gallery: string[];
  variations?: {
    label: string;
    sku: string;
    quantity?: number;
    price: number;
  }[];
}

export const products: Product[] = [
  {
    id: "roses-red-premium",
    name: "Premium Red Roses",
    price: 15000,
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=500",
    description: "Fresh red roses, perfect for weddings, events, and romantic occasions. Sourced daily for maximum freshness.",
    category: "Roses",
    featured: true,
    inStock: true,
    details: {
      origin: "Ecuador & Kenya",
      grade: "Premium Grade",
      processing: "Fresh cut daily",
      uses: ["Weddings", "Events", "Bouquets", "Centerpieces"],
      storage: "Keep in water, cool place"
    },
    gallery: [
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=500",
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500",
      "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=500"
    ],
    variations: [
      { label: "12 Stems", sku: "RS-12", quantity: 12, price: 15000 },
      { label: "24 Stems", sku: "RS-24", quantity: 24, price: 28000 },
      { label: "50 Stems", sku: "RS-50", quantity: 50, price: 50000 },
      { label: "100 Stems", sku: "RS-100", quantity: 100, price: 95000 }
    ]
  },
  {
    id: "orchids-white",
    name: "White Phalaenopsis Orchids",
    price: 8500,
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=500",
    description: "Elegant white orchids ideal for corporate events, upscale venues, and sophisticated arrangements.",
    category: "Orchids",
    featured: true,
    inStock: true,
    details: {
      origin: "Thailand & Singapore",
      grade: "Exhibition Grade",
      processing: "Fresh import weekly",
      uses: ["Corporate Events", "Hotels", "Premium Arrangements"],
      storage: "Indirect light, moderate watering"
    },
    gallery: [
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=500",
      "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=500"
    ]
  },
  {
    id: "mixed-seasonal",
    name: "Seasonal Mixed Flowers",
    price: 12000,
    image: "https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=500",
    description: "Beautiful mix of seasonal blooms including tulips, lilies, and sunflowers. Perfect for versatile arrangements.",
    category: "Seasonal",
    featured: true,
    inStock: true,
    details: {
      origin: "Holland & Local",
      grade: "Fresh Grade A",
      processing: "Weekly fresh imports",
      uses: ["Bouquets", "Events", "Gifts", "Decorations"],
      storage: "Cool water, change daily"
    },
    gallery: [
      "https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=500",
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500"
    ]
  },
  {
    id: "roses-pink",
    name: "Soft Pink Roses",
    price: 14000,
    image: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=500",
    description: "Delicate pink roses for romantic weddings and elegant celebrations. Fresh and fragrant.",
    category: "Roses",
    featured: false,
    inStock: true,
    details: {
      origin: "Ecuador",
      grade: "Premium Grade",
      processing: "Fresh cut daily",
      uses: ["Weddings", "Romantic Events", "Gifts"],
      storage: "Keep in cool water"
    },
    gallery: [
      "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=500",
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=500"
    ]
  },
  {
    id: "lilies-white",
    name: "Pure White Lilies",
    price: 10000,
    image: "https://images.unsplash.com/photo-1524386416438-98b9b2d4b433?w=500",
    description: "Stunning white lilies with strong fragrance, perfect for church ceremonies and formal events.",
    category: "Lilies",
    featured: false,
    inStock: true,
    details: {
      origin: "Holland",
      grade: "Premium",
      processing: "Weekly imports",
      uses: ["Ceremonies", "Formal Events", "Sympathy"],
      storage: "Cool place, remove pollen"
    },
    gallery: [
      "https://images.unsplash.com/photo-1524386416438-98b9b2d4b433?w=500"
    ]
  },
  {
    id: "sunflowers-bright",
    name: "Bright Sunflowers",
    price: 8000,
    image: "https://images.unsplash.com/photo-1597848212624-e4c0f5e3e695?w=500",
    description: "Cheerful sunflowers bringing warmth and joy to any occasion. Perfect for summer events.",
    category: "Seasonal",
    featured: false,
    inStock: true,
    details: {
      origin: "Local & Kenya",
      grade: "Fresh Grade A",
      processing: "Fresh cut",
      uses: ["Summer Events", "Casual Decor", "Gifts"],
      storage: "Full sun, plenty of water"
    },
    gallery: [
      "https://images.unsplash.com/photo-1597848212624-e4c0f5e3e695?w=500"
    ]
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};
