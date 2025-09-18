import { AdminHeader } from '@/components/AdminHeader';
import { AdminGuard } from '@/components/AdminGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function OrdersManagement() {
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      console.log('Fetching orders...');
      // 1) Fetch orders first (no relations)
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Orders base query error:', ordersError);
        throw ordersError;
      }

      if (!ordersData || ordersData.length === 0) {
        console.log('No orders found.');
        return [] as any[];
      }

      const userIds = Array.from(new Set(ordersData.map((o: any) => o.user_id).filter(Boolean))) as string[];
      const orderIds = ordersData.map((o: any) => o.id) as string[];

      // 2) Fetch related data in parallel without relying on FKs
      const [profilesRes, orderItemsRes] = await Promise.all([
        supabase.from('profiles').select('id, first_name, last_name, email').in('id', userIds as string[]),
        supabase.from('order_items').select('id, order_id, product_id, quantity, price_per_item, created_at').in('order_id', orderIds as string[]),
      ]);

      const profilesError = (profilesRes as any).error;
      const orderItemsError = (orderItemsRes as any).error;

      if (profilesError) console.warn('Profiles fetch warning:', profilesError);
      if (orderItemsError) console.warn('Order items fetch warning:', orderItemsError);

      const profilesData = (profilesRes as any).data ?? [];
      const orderItemsData = (orderItemsRes as any).data ?? [];

      const productIds = Array.from(new Set(orderItemsData.map((i: any) => i.product_id).filter(Boolean))) as string[];

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name')
        .in('id', productIds as string[]);

      if (productsError) console.warn('Products fetch warning:', productsError);

      // 3) Build maps for quick lookup
      const profilesMap = new Map<string, any>(profilesData.map((p: any) => [p.id as string, p]));
      const productsMap = new Map<string, any>((productsData ?? []).map((p: any) => [p.id as string, p]));

      const itemsByOrder = new Map<string, any[]>();
      for (const item of orderItemsData) {
        const list = itemsByOrder.get(item.order_id) ?? [];
        list.push(item);
        itemsByOrder.set(item.order_id, list);
      }

      // 4) Enrich orders to match UI shape (profiles, order_items.products)
      const enriched = ordersData.map((o: any) => {
        const profile = profilesMap.get(o.user_id);
        const items = (itemsByOrder.get(o.id) ?? []).map((it: any) => ({
          quantity: it.quantity,
          price_per_item: it.price_per_item,
          products: { name: productsMap.get(it.product_id)?.name ?? 'Unknown product' },
        }));
        return {
          ...o,
          profiles: profile
            ? { first_name: profile.first_name, last_name: profile.last_name, email: profile.email }
            : null,
          order_items: items,
        };
      });

      console.log('Enriched orders result:', enriched);
      return enriched as any[];
    },
  });

  console.log('Orders in component:', orders, 'Loading:', isLoading, 'Error:', error);

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

  const formatPrice = (priceInCents: number) => `Rs ${(priceInCents / 100).toFixed(2)}`;

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
                        {formatPrice(order.total_amount)}
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
                        <span>{formatPrice(item.price_per_item)}</span>
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