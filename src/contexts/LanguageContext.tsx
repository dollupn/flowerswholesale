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
    const savedLanguage = localStorage.getItem('fwm-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('fwm-language', lang);
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
      'hero.title1': 'Fresh Wholesale',
      'hero.title2': 'Flowers',
      'hero.subtitle': 'Premium flowers for events, weddings, and businesses in Mauritius. Expertly conditioned and delivered at their freshest.',
      'hero.shopNow': 'Shop Now',
      'hero.learnStory': 'Learn Our Story',
      'hero.gradeA': '50+ Floral Varieties',
      'hero.directlySourced': 'Hand-selected from trusted growers',
      
      // Featured Products
      'featured.title': 'Featured Flowers',
      'featured.description': 'Discover our curated lineup of premium stems ready for weddings, events, and bespoke deliveries.',
      'featured.viewAll': 'View All Products',
      
      // Why Choose Us
      'whyChoose.title': 'Why Choose Flowers Wholesale Mauritius?',
      'whyChoose.description': 'We\'re committed to bringing you floral artistry with the freshest stems in Mauritius.',
      'whyChoose.premiumSource': 'Freshly Cut Blooms',
      'whyChoose.premiumSourceDesc': 'Harvested each morning from our partner farms',
      'whyChoose.authenticFlavor': 'Bespoke Floral Styling',
      'whyChoose.authenticFlavorDesc': 'Bouquets, centerpieces, and installations tailored to your event',
      'whyChoose.handpicked': 'Expert Care',
      'whyChoose.handpickedDesc': 'Professional conditioning and quality control for every stem',
      
      // Recipes
      'recipes.title': 'Arrangement Guides',
      'recipes.description': 'Get inspired by curated arrangement guides for weddings, events, and gifts.',
      'recipes.featuredRecipe': 'Featured Guide',
      'recipes.viewFullRecipe': 'View full guide',
      'recipes.chefTip': 'Florist\'s Tip',
      'recipes.chefTipDesc': 'Keep stems hydrated and trim at an angle for maximum freshness and longevity.',
      'recipes.madagascarVanilla': 'Seasonal Blooms',
      
      // Testimonials
      'testimonials.title': 'What Our Customers Say',
      
      // Delivery
      'delivery.islandWide': 'Island-wide Delivery',
      'delivery.qualityGuaranteed': 'Quality Guaranteed',
      
      // About Page
      'about.title': 'Our Story',
      'about.subtitle': 'Born from a passion for fresh blooms and quality service, Flowers Wholesale Mauritius brings you premium wholesale flowers for every occasion.',
      'about.fromFarms': 'From Suppliers to Your Events',
      'about.vision': 'Our Vision',
      'about.mission': 'Our Mission',
      'about.whatWeStandFor': 'What We Stand For',
      'about.sourcingTransparency': 'Sourcing Transparency',
      'about.readyToExperience': 'Ready for Fresh Wholesale Flowers?',
      'about.contactUs': 'Contact Us',
      
      // Values
      'values.premiumQuality': 'Premium Quality',
      'values.premiumQualityDesc': 'We source only the freshest flowers from trusted local and international suppliers.',
      'values.directTrade': 'Direct Sourcing',
      'values.directTradeDesc': 'Building long-term relationships with growers for consistent quality and fair pricing.',
      'values.freshDelivery': 'Fresh Delivery',
      'values.freshDeliveryDesc': 'Fast, reliable delivery across Mauritius to ensure maximum freshness.',
      'values.passionDriven': 'Passion Driven',
      'values.passionDrivenDesc': 'Our love for fresh flowers drives everything we do at Flowers Wholesale Mauritius.',
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
      'hero.title1': 'Fleurs Fraîches',
      'hero.title2': 'en Gros',
      'hero.subtitle': 'Fleurs premium pour événements, mariages et entreprises à Maurice. Préparées avec soin et livrées à la fraîcheur maximale.',
      'hero.shopNow': 'Acheter Maintenant',
      'hero.learnStory': 'Découvrir Notre Histoire',
      'hero.gradeA': '50+ Variétés Florales',
      'hero.directlySourced': 'Sélectionnées auprès de producteurs de confiance',
      
      // Featured Products
      'featured.title': 'Fleurs Vedettes',
      'featured.description': 'Découvrez notre sélection de tiges premium, idéale pour mariages, événements et livraisons sur mesure.',
      'featured.viewAll': 'Voir Tous les Produits',
      
      // Why Choose Us
      'whyChoose.title': 'Pourquoi Choisir Flowers Wholesale Mauritius?',
      'whyChoose.description': 'Nous mettons notre art floral et les tiges les plus fraîches de Maurice à votre service.',
      'whyChoose.premiumSource': 'Fleurs Fraîchement Coupées',
      'whyChoose.premiumSourceDesc': 'Récoltées chaque matin auprès de nos partenaires horticoles',
      'whyChoose.authenticFlavor': 'Créations Florales Sur Mesure',
      'whyChoose.authenticFlavorDesc': 'Bouquets, centres de table et installations adaptés à chaque événement',
      'whyChoose.handpicked': 'Soin Expert',
      'whyChoose.handpickedDesc': 'Préparation professionnelle et contrôle qualité de chaque tige',
      
      // Recipes
      'recipes.title': 'Guides d\'Arrangement',
      'recipes.description': 'Laissez-vous inspirer par des guides d\'arrangements créés pour mariages, événements et cadeaux.',
      'recipes.featuredRecipe': 'Guide Vedette',
      'recipes.viewFullRecipe': 'Voir le guide complet',
      'recipes.chefTip': 'Conseil du Fleuriste',
      'recipes.chefTipDesc': 'Hydratez bien les tiges et coupez-les en biais pour une fraîcheur et une longévité optimales.',
      'recipes.madagascarVanilla': 'Fleurs de Saison',
      
      // Testimonials
      'testimonials.title': 'Ce Que Disent Nos Clients',
      
      // Delivery
      'delivery.islandWide': 'Livraison dans Toute l\'Île',
      'delivery.qualityGuaranteed': 'Qualité Garantie',
      
      // About Page
      'about.title': 'Notre Histoire',
      'about.subtitle': 'Née d\'une passion pour les fleurs fraîches et un service de qualité, Flowers Wholesale Mauritius vous apporte des fleurs en gros premium pour chaque occasion.',
      'about.fromFarms': 'Des Fournisseurs à Vos Événements',
      'about.vision': 'Notre Vision',
      'about.mission': 'Notre Mission',
      'about.whatWeStandFor': 'Nos Valeurs',
      'about.sourcingTransparency': 'Transparence d\'Approvisionnement',
      'about.readyToExperience': 'Prêt pour des Fleurs Fraîches en Gros?',
      'about.contactUs': 'Nous Contacter',
      
      // Values
      'values.premiumQuality': 'Qualité Premium',
      'values.premiumQualityDesc': 'Nous nous approvisionnons uniquement en fleurs fraîches auprès de fournisseurs locaux et internationaux de confiance.',
      'values.directTrade': 'Approvisionnement Direct',
      'values.directTradeDesc': 'Construction de relations à long terme avec les producteurs pour une qualité constante et des prix équitables.',
      'values.freshDelivery': 'Livraison Fraîche',
      'values.freshDeliveryDesc': 'Livraison rapide et fiable à travers Maurice pour assurer une fraîcheur maximale.',
      'values.passionDriven': 'Animés par la Passion',
      'values.passionDrivenDesc': 'Notre amour pour les fleurs fraîches guide tout ce que nous faisons chez Flowers Wholesale Mauritius.',
    }
  };
  
  return translations[lang];
};