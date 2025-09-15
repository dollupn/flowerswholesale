import { Home, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Badge } from "@/components/ui/badge";

export function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const { totalItems } = useCart();

  const navItems = [
    {
      label: "Home",
      path: "/",
      icon: Home,
    },
    {
      label: "Shop",
      path: "/shop",
      icon: ShoppingBag,
    },
    {
      label: "Cart",
      path: "/cart",
      icon: ShoppingCart,
      badge: totalItems > 0 ? totalItems : undefined,
    },
    {
      label: "Account",
      path: user ? "/admin" : "/auth",
      icon: User,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border md:hidden">
      <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-lg transition-colors ${
                active
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <div className="relative">
                <Icon size={20} className="mb-1" />
                {item.badge && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs min-w-[20px]"
                  >
                    {item.badge > 99 ? "99+" : item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}