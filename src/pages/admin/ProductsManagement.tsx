import { useState } from 'react';
import { AdminHeader } from '@/components/AdminHeader';
import { AdminGuard } from '@/components/AdminGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAllProducts } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus, Search, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductsManagement() {
  const { data: products = [], refetch } = useAllProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFeatured = async (productId: string, currentFeatured: boolean) => {
    const { error } = await supabase
      .from('products')
      .update({ featured: !currentFeatured })
      .eq('id', productId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update product',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
      refetch();
    }
  };

  const toggleStock = async (productId: string, currentStock: boolean) => {
    const { error } = await supabase
      .from('products')
      .update({ in_stock: !currentStock })
      .eq('id', productId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update product stock',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Product stock updated successfully',
      });
      refetch();
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
      refetch();
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Products Management</h1>
              <p className="text-muted-foreground">
                Manage your vanilla product catalog
              </p>
            </div>
            <Button asChild>
              <Link to="/admin/products/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {`Rs ${(product.price / 100).toFixed(2)}`}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant={product.in_stock ? 'default' : 'secondary'}>
                            {product.in_stock ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                          {product.featured && (
                            <Badge variant="outline">Featured</Badge>
                          )}
                          {product.label && (
                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                              {product.label}
                            </Badge>
                          )}
                          {product.category && (
                            <Badge variant="outline">{product.category}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFeatured(product.id, product.featured || false)}
                      >
                        {product.featured ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStock(product.id, product.in_stock || false)}
                      >
                        {product.in_stock ? 'Mark Out of Stock' : 'Mark In Stock'}
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/admin/products/edit/${product.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {product.description && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {product.description.substring(0, 150)}
                      {product.description.length > 150 ? '...' : ''}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchTerm ? 'No products found matching your search.' : 'No products found.'}
                </p>
                <Button className="mt-4" asChild>
                  <Link to="/admin/products/new">Add Your First Product</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </AdminGuard>
  );
}