import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('vanilluxe-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('vanilluxe-language', lang);
  };

  // Translation function - will be enhanced with actual translations
  const t = (key: string): string => {
    // Import translations dynamically
    const translations = getTranslations(language);
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Translation data
const getTranslations = (lang: Language): Record<string, string> => {
  const translations = {
    en: {
      // Navigation
      'nav.home': 'Home',
      'nav.shop': 'Shop',
      'nav.about': 'About',
      'nav.contact': 'Contact',
      'nav.faq': 'FAQ',
      
      // Authentication
      'auth.signIn': 'Sign In',
      'auth.signOut': 'Sign Out',
      'auth.profile': 'Profile',
      'auth.myOrders': 'My Orders',
      'auth.adminDashboard': 'Admin Dashboard',
      
      // Hero Section
      'hero.title1': 'Pure Madagascar',
      'hero.title2': 'Vanilla',
      'hero.subtitle': 'Delivered with Elegance to Mauritius. Experience the authentic taste of premium vanilla beans, sourced directly from Madagascar\'s finest farms.',
      'hero.shopNow': 'Shop Now',
      'hero.learnStory': 'Learn Our Story',
      'hero.gradeA': 'Grade A Quality',
      'hero.directlySourced': 'Directly sourced',
      
      // Featured Products
      'featured.title': 'Featured Products',
      'featured.description': 'Discover our premium selection of Madagascar vanilla products, perfect for gourmet cooking and baking.',
      'featured.viewAll': 'View All Products',
      
      // Why Choose Us
      'whyChoose.title': 'Why Choose Vanilluxe?',
      'whyChoose.description': 'We\'re committed to bringing you the finest vanilla experience in Mauritius.',
      'whyChoose.premiumSource': 'Premium Source',
      'whyChoose.premiumSourceDesc': 'Direct from Madagascar\'s finest vanilla farms',
      'whyChoose.authenticFlavor': 'Authentic Flavor',
      'whyChoose.authenticFlavorDesc': '100% pure, no artificial additives or preservatives',
      'whyChoose.handpicked': 'Handpicked Quality',
      'whyChoose.handpickedDesc': 'Grade A beans selected by experienced farmers',
      
      // Recipes
      'recipes.title': 'Vanilla Recipes',
      'recipes.description': 'Explore decadent ways to savour our Madagascar vanilla with easy-to-follow recipes.',
      'recipes.featuredRecipe': 'Featured Recipe',
      'recipes.viewFullRecipe': 'View full recipe',
      'recipes.chefTip': 'Chef\'s Tip',
      'recipes.chefTipDesc': 'Split the vanilla bean lengthwise and scrape out the seeds to infuse the richest flavour into your dessert.',
      'recipes.madagascarVanilla': 'Madagascar Vanilla',
      
      // Testimonials
      'testimonials.title': 'What Our Customers Say',
      
      // Delivery
      'delivery.islandWide': 'Island-wide Delivery',
      'delivery.qualityGuaranteed': 'Quality Guaranteed',
      
      // About Page
      'about.title': 'Our Story',
      'about.subtitle': 'Born from a passion for authentic flavors and a deep connection to Madagascar\'s vanilla heritage, Vanilluxe brings you the world\'s finest vanilla to Mauritius.',
      'about.fromFarms': 'From Madagascar Farms to Your Kitchen',
      'about.vision': 'Our Vision',
      'about.mission': 'Our Mission',
      'about.whatWeStandFor': 'What We Stand For',
      'about.sourcingTransparency': 'Sourcing Transparency',
      'about.readyToExperience': 'Ready to Experience Premium Vanilla?',
      'about.contactUs': 'Contact Us',
      
      // Values
      'values.premiumQuality': 'Premium Quality',
      'values.premiumQualityDesc': 'We source only the finest Grade A vanilla beans from trusted Madagascar farmers.',
      'values.directTrade': 'Direct Trade',
      'values.directTradeDesc': 'Building long-term relationships with vanilla farmers for fair and sustainable trade.',
      'values.freshDelivery': 'Fresh Delivery',
      'values.freshDeliveryDesc': 'Fast, reliable delivery across Mauritius to ensure maximum freshness.',
      'values.passionDriven': 'Passion Driven',
      'values.passionDrivenDesc': 'Our love for authentic vanilla drives everything we do at Vanilluxe.',
    },
    fr: {
      // Navigation
      'nav.home': 'Accueil',
      'nav.shop': 'Boutique',
      'nav.about': 'À Propos',
      'nav.contact': 'Contact',
      'nav.faq': 'FAQ',
      
      // Authentication
      'auth.signIn': 'Se Connecter',
      'auth.signOut': 'Déconnexion',
      'auth.profile': 'Profil',
      'auth.myOrders': 'Mes Commandes',
      'auth.adminDashboard': 'Tableau de Bord Admin',
      
      // Hero Section
      'hero.title1': 'Vanille Pure de',
      'hero.title2': 'Madagascar',
      'hero.subtitle': 'Livrée avec Élégance à Maurice. Découvrez le goût authentique des gousses de vanille premium, provenant directement des meilleures fermes de Madagascar.',
      'hero.shopNow': 'Acheter Maintenant',
      'hero.learnStory': 'Découvrir Notre Histoire',
      'hero.gradeA': 'Qualité Grade A',
      'hero.directlySourced': 'Source directe',
      
      // Featured Products
      'featured.title': 'Produits Vedettes',
      'featured.description': 'Découvrez notre sélection premium de produits à la vanille de Madagascar, parfaits pour la cuisine gastronomique et la pâtisserie.',
      'featured.viewAll': 'Voir Tous les Produits',
      
      // Why Choose Us
      'whyChoose.title': 'Pourquoi Choisir Vanilluxe?',
      'whyChoose.description': 'Nous nous engageons à vous offrir la meilleure expérience vanille à Maurice.',
      'whyChoose.premiumSource': 'Source Premium',
      'whyChoose.premiumSourceDesc': 'Directement des meilleures fermes de vanille de Madagascar',
      'whyChoose.authenticFlavor': 'Saveur Authentique',
      'whyChoose.authenticFlavorDesc': '100% pure, sans additifs artificiels ni conservateurs',
      'whyChoose.handpicked': 'Qualité Sélectionnée',
      'whyChoose.handpickedDesc': 'Gousses Grade A sélectionnées par des agriculteurs expérimentés',
      
      // Recipes
      'recipes.title': 'Recettes à la Vanille',
      'recipes.description': 'Explorez des façons décadentes de savourer notre vanille de Madagascar avec des recettes faciles à suivre.',
      'recipes.featuredRecipe': 'Recette Vedette',
      'recipes.viewFullRecipe': 'Voir la recette complète',
      'recipes.chefTip': 'Conseil du Chef',
      'recipes.chefTipDesc': 'Fendez la gousse de vanille dans le sens de la longueur et grattez les graines pour infuser la saveur la plus riche dans votre dessert.',
      'recipes.madagascarVanilla': 'Vanille de Madagascar',
      
      // Testimonials
      'testimonials.title': 'Ce Que Disent Nos Clients',
      
      // Delivery
      'delivery.islandWide': 'Livraison dans Toute l\'Île',
      'delivery.qualityGuaranteed': 'Qualité Garantie',
      
      // About Page
      'about.title': 'Notre Histoire',
      'about.subtitle': 'Née d\'une passion pour les saveurs authentiques et d\'un lien profond avec l\'héritage vanillier de Madagascar, Vanilluxe vous apporte la meilleure vanille du monde à Maurice.',
      'about.fromFarms': 'Des Fermes de Madagascar à Votre Cuisine',
      'about.vision': 'Notre Vision',
      'about.mission': 'Notre Mission',
      'about.whatWeStandFor': 'Nos Valeurs',
      'about.sourcingTransparency': 'Transparence d\'Approvisionnement',
      'about.readyToExperience': 'Prêt à Découvrir la Vanille Premium?',
      'about.contactUs': 'Nous Contacter',
      
      // Values
      'values.premiumQuality': 'Qualité Premium',
      'values.premiumQualityDesc': 'Nous nous approvisionnons uniquement en gousses de vanille Grade A auprès d\'agriculteurs malgaches de confiance.',
      'values.directTrade': 'Commerce Direct',
      'values.directTradeDesc': 'Construction de relations à long terme avec les cultivateurs de vanille pour un commerce équitable et durable.',
      'values.freshDelivery': 'Livraison Fraîche',
      'values.freshDeliveryDesc': 'Livraison rapide et fiable à travers Maurice pour assurer une fraîcheur maximale.',
      'values.passionDriven': 'Animés par la Passion',
      'values.passionDrivenDesc': 'Notre amour pour la vanille authentique guide tout ce que nous faisons chez Vanilluxe.',
    }
  };
  
  return translations[lang];
};