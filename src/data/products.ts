
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
    id: "vanilla-beans-premium",
    name: "Premium Madagascar Vanilla Beans",
    price: 21000,
    image: "https://images.unsplash.com/photo-1586049332816-6de5d1e8e38b?w=500",
    description: "Grade A vanilla beans directly sourced from Madagascar. Perfect for baking, desserts, and gourmet cooking.",
    category: "Vanilla Beans",
    featured: true,
    inStock: true,
    details: {
      origin: "Sambava, Madagascar",
      grade: "Grade A (Gourmet)",
      processing: "Traditional curing process",
      uses: ["Baking", "Ice cream", "Custards", "Cocktails"],
      storage: "Cool, dry place in airtight container"
    },
    gallery: [
      "https://images.unsplash.com/photo-1586049332816-6de5d1e8e38b?w=500",
      "https://images.unsplash.com/photo-1557679569-4bd6ac1bb98e?w=500",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500"
    ],
    variations: [
      { label: "3 Vanilla Beans", sku: "VL1-3", quantity: 3, price: 21000 },
      { label: "5 Vanilla Beans", sku: "VL1-5", quantity: 5, price: 32500 },
      { label: "10 Vanilla Beans", sku: "VL1-10", quantity: 10, price: 60000 },
      { label: "25 Vanilla Beans", sku: "VL1-25", quantity: 25, price: 140000 },
      { label: "50 Vanilla Beans", sku: "VL1-50", quantity: 50, price: 260000 }
    ]
  },
  {
    id: "vanilla-extract-pure",
    name: "Pure Vanilla Extract",
    price: 450,
    image: "https://images.unsplash.com/photo-1557679569-4bd6ac1bb98e?w=500",
    description: "100% pure vanilla extract made from Madagascar vanilla beans. No artificial flavors or additives.",
    category: "Vanilla Extract",
    featured: true,
    inStock: true,
    details: {
      origin: "Made from Madagascar vanilla beans",
      grade: "Pure extract (35% alcohol)",
      processing: "Slow extraction process",
      uses: ["Baking", "Beverages", "Desserts", "Marinades"],
      storage: "Room temperature, away from light"
    },
    gallery: [
      "https://images.unsplash.com/photo-1557679569-4bd6ac1bb98e?w=500",
      "https://images.unsplash.com/photo-1586049332816-6de5d1e8e38b?w=500"
    ]
  },
  {
    id: "vanilla-powder-fine",
    name: "Fine Vanilla Powder",
    price: 320,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
    description: "Finely ground vanilla beans powder. Perfect for dry mixes, chocolate, and where liquid extract isn't ideal.",
    category: "Vanilla Powder",
    featured: true,
    inStock: true,
    details: {
      origin: "Ground Madagascar vanilla beans",
      grade: "Fine powder",
      processing: "Ground whole vanilla beans",
      uses: ["Chocolate making", "Dry mixes", "Dusting", "Coffee"],
      storage: "Airtight container, cool dry place"
    },
    gallery: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
      "https://images.unsplash.com/photo-1586049332816-6de5d1e8e38b?w=500"
    ]
  },
  {
    id: "vanilla-beans-grade-b",
    name: "Grade B Vanilla Beans",
    price: 650,
    image: "https://images.unsplash.com/photo-1586049332816-6de5d1e8e38b?w=500",
    description: "Grade B vanilla beans, perfect for extract making and cooking. Lower moisture content, intense flavor.",
    category: "Vanilla Beans",
    featured: false,
    inStock: true,
    details: {
      origin: "Sambava, Madagascar",
      grade: "Grade B (Extract grade)",
      processing: "Traditional curing, lower moisture",
      uses: ["Extract making", "Cooking", "Infusions"],
      storage: "Cool, dry place in airtight container"
    },
    gallery: [
      "https://images.unsplash.com/photo-1586049332816-6de5d1e8e38b?w=500",
      "https://images.unsplash.com/photo-1557679569-4bd6ac1bb98e?w=500"
    ]
  },
  {
    id: "vanilla-paste-gourmet",
    name: "Gourmet Vanilla Paste",
    price: 550,
    image: "https://images.unsplash.com/photo-1557679569-4bd6ac1bb98e?w=500",
    description: "Rich vanilla paste with vanilla bean specks. Combines the convenience of extract with visual appeal.",
    category: "Vanilla Paste",
    featured: false,
    inStock: true,
    details: {
      origin: "Made from Madagascar vanilla beans",
      grade: "Gourmet paste with bean specks",
      processing: "Ground beans with extract",
      uses: ["Baking", "Frosting", "Ice cream", "Sauces"],
      storage: "Refrigerate after opening"
    },
    gallery: [
      "https://images.unsplash.com/photo-1557679569-4bd6ac1bb98e?w=500",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500"
    ]
  },
  {
    id: "vanilla-sugar-infused",
    name: "Vanilla-Infused Sugar",
    price: 280,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
    description: "Premium cane sugar infused with real vanilla beans. Perfect for baking and beverages.",
    category: "Vanilla Sugar",
    featured: false,
    inStock: true,
    details: {
      origin: "Mauritian cane sugar with Madagascar vanilla",
      grade: "Premium infused sugar",
      processing: "Long infusion process",
      uses: ["Baking", "Tea & coffee", "Desserts", "Cocktails"],
      storage: "Airtight container, room temperature"
    },
    gallery: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
      "https://images.unsplash.com/photo-1586049332816-6de5d1e8e38b?w=500"
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
