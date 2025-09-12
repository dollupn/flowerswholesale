import { AdminHeader } from '@/components/AdminHeader';
import { AdminGuard } from '@/components/AdminGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProducts } from '@/hooks/useProducts';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { data: products = [] } = useProducts();

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      description: 'Active products in catalog',
    },
    {
      title: 'In Stock',
      value: products.filter(p => p.in_stock).length,
      icon: TrendingUp,
      description: 'Available for purchase',
    },
    {
      title: 'Featured',
      value: products.filter(p => p.featured).length,
      icon: ShoppingCart,
      description: 'Featured products',
    },
    {
      title: 'Categories',
      value: new Set(products.map(p => p.category).filter(Boolean)).size,
      icon: Users,
      description: 'Product categories',
    },
  ];

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your vanilla products and e-commerce store
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates to your store</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No recent activity to display
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <a href="/admin/products/new" className="block p-2 rounded hover:bg-muted">
                  Add New Product
                </a>
                <a href="/admin/products" className="block p-2 rounded hover:bg-muted">
                  Manage Products
                </a>
                <a href="/admin/orders" className="block p-2 rounded hover:bg-muted">
                  View Orders
                </a>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}