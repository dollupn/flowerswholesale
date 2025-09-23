
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, Search, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useRole";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, loading } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { totalItems } = useCart();
  const { t } = useLanguage();

  const navItems = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.shop"), path: "/shop" },
    { name: t("nav.about"), path: "/about" },
    { name: t("nav.contact"), path: "/contact" },
    { name: t("nav.faq"), path: "/faq" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-vanilla-cream/95 backdrop-blur-sm border-b border-vanilla-beige/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="Vanilluxe Logo"
              className="h-12 w-auto"
            />
            <span className="text-xl font-serif font-bold text-vanilla-brown sm:hidden">
              Vanilluxe
            </span>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-serif font-bold text-vanilla-brown">Vanilluxe</h1>
              <p className="text-xs text-vanilla-brown/70 -mt-1">Pure Madagascar Vanilla</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-vanilla-brown/80 ${
                  isActive(item.path) ? "text-vanilla-brown border-b-2 border-vanilla-brown" : "text-vanilla-brown/70"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Cart Button - Desktop */}
            <Link to="/cart" className="relative hidden sm:flex">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-vanilla-brown text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Authentication */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden md:flex">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem disabled className="font-medium">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      {t("auth.profile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {t("auth.myOrders")}
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <Settings className="mr-2 h-4 w-4" />
                        {t("auth.adminDashboard")}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={signOut}
                    disabled={loading}
                    className="text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("auth.signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default" className="hidden md:flex bg-vanilla-brown hover:bg-vanilla-brown/90">
                <Link to="/auth">{t("auth.signIn")}</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-vanilla-beige/20 pt-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.path) ? "text-vanilla-brown" : "text-vanilla-brown/70"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Auth */}
              <div className="pt-4 border-t border-vanilla-beige/20">
                {user ? (
                  <div className="space-y-3">
                    <div className="text-sm text-vanilla-brown/70">
                      Signed in as: {user.email}
                    </div>
                    <Link
                      to="/profile"
                      className="block text-sm font-medium text-vanilla-brown/70"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("auth.profile")}
                    </Link>
                    <Link
                      to="/orders"
                      className="block text-sm font-medium text-vanilla-brown/70"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("auth.myOrders")}
                    </Link>
                    {isAdmin && (
                        <Link
                          to="/admin"
                          className="block text-sm font-medium text-vanilla-brown/70"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {t("auth.adminDashboard")}
                        </Link>
                    )}
                    <Button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      variant="outline"
                      size="sm"
                      disabled={loading}
                      className="w-full border-vanilla-brown text-vanilla-brown"
                    >
                      {t("auth.signOut")}
                    </Button>
                  </div>
                ) : (
                  <Button
                    asChild
                    className="w-full bg-vanilla-brown hover:bg-vanilla-brown/90"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link to="/auth">{t("auth.signIn")}</Link>
                  </Button>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
