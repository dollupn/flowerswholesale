
import { Link } from "react-router-dom";
import { Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const handleWhatsApp = () => {
    window.open("https://wa.me/23055310121", "_blank");
  };

  const handleInstagram = () => {
    window.open("https://instagram.com/vanilluxemu", "_blank");
  };

  const handleFacebook = () => {
    window.open("https://facebook.com/vanilluxemu", "_blank");
  };

  return (
    <footer className="bg-vanilla-brown text-vanilla-cream">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/lovable-uploads/fd43cf6a-6de6-42ab-8f98-3a49d52e16ec.png" 
                alt="Vanilluxe Logo" 
                className="h-12 w-auto filter invert"
              />
              <div>
                <h3 className="text-xl font-serif font-bold">Vanilluxe</h3>
                <p className="text-sm text-vanilla-cream/80">Pure Madagascar Vanilla, Delivered with Elegance</p>
              </div>
            </div>
            <p className="text-vanilla-cream/80 mb-6 max-w-md">
              Premium Madagascar vanilla products sourced directly from farmers.
              Experience the authentic taste of pure vanilla in Mauritius.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-vanilla-cream/80 hover:text-vanilla-cream transition-colors">Shop</Link></li>
              <li><Link to="/about" className="text-vanilla-cream/80 hover:text-vanilla-cream transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-vanilla-cream/80 hover:text-vanilla-cream transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="text-vanilla-cream/80 hover:text-vanilla-cream transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="space-y-3">
              <Button
                onClick={handleWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                WhatsApp Us
              </Button>
              <Button
                onClick={handleInstagram}
                className="w-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white hover:opacity-90"
              >
                <Instagram className="w-4 h-4 mr-2" />
                Follow on Instagram
              </Button>
              <Button
                onClick={handleFacebook}
                className="w-full bg-[#1877F2] hover:bg-[#0b5bd3] text-white"
              >
                <Facebook className="w-4 h-4 mr-2" />
                Follow on Facebook
              </Button>
            </div>
            <div className="mt-4 text-sm text-vanilla-cream/80">
              <p>Based in Mauritius</p>
              <p>Island-wide delivery available</p>
            </div>
          </div>
        </div>

        <div className="border-t border-vanilla-cream/20 mt-8 pt-6 text-center text-sm text-vanilla-cream/60">
          <p>&copy; 2025 Vanilluxe. All rights reserved. | Premium Madagascar Vanilla in Mauritius</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
