import { AdminHeader } from '@/components/AdminHeader';
import { AdminGuard } from '@/components/AdminGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function OrdersManagement() {
  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles(first_name, last_name, email),
          order_items(
            quantity,
            price_per_item,
            products(name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'processing':
        return 'default';
      case 'shipped':
        return 'outline';
      case 'delivered':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Orders Management</h1>
            <p className="text-muted-foreground">Review and manage customer orders</p>
          </div>

          <div className="grid gap-4">
            {orders.map((order: any) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.id.slice(0, 8)}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {order.profiles?.first_name} {order.profiles?.last_name} - {order.profiles?.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <p className="text-lg font-semibold mt-1">
                        ${(order.total_amount / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium">Items:</h4>
                    {order.order_items?.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.products?.name} x{item.quantity}</span>
                        <span>${(item.price_per_item / 100).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  {order.shipping_address && (
                    <div className="mt-4">
                      <h4 className="font-medium">Shipping Address:</h4>
                      <p className="text-sm text-muted-foreground">
                        {order.shipping_address.address_line1}
                        {order.shipping_address.address_line2 && `, ${order.shipping_address.address_line2}`}
                        <br />
                        {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                        <br />
                        {order.shipping_address.country}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {orders.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No orders found.</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </AdminGuard>
  );
}