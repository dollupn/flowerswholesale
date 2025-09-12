import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Home } from 'lucide-react';

export function AdminHeader() {
  const { signOut } = useAuth();

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/admin" className="text-xl font-bold text-primary">
            Admin Dashboard
          </Link>
          <nav className="flex gap-4">
            <Link to="/admin" className="text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link to="/admin/products" className="text-muted-foreground hover:text-foreground">
              Products
            </Link>
            <Link to="/admin/orders" className="text-muted-foreground hover:text-foreground">
              Orders
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              View Site
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}