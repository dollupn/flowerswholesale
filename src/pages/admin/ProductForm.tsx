import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminHeader } from '@/components/AdminHeader';
import { AdminGuard } from '@/components/AdminGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { parseProductVariations } from '@/lib/product';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  gallery: string[];
  label: string;
  in_stock: boolean;
  featured: boolean;
  origin: string;
  grade: string;
  processing: string;
  storage: string;
  uses: string[];
}

interface VariationForm {
  id: string;
  label: string;
  sku: string;
  quantity: string;
  price: string;
}

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    image_url: '',
    gallery: [],
    label: '',
    in_stock: true,
    featured: false,
    origin: '',
    grade: '',
    processing: '',
    storage: '',
    uses: [],
  });

  const [loading, setLoading] = useState(false);
  const [usesInput, setUsesInput] = useState('');
  const [galleryInput, setGalleryInput] = useState('');
  const [variationForms, setVariationForms] = useState<VariationForm[]>([]);

  const createVariationForm = (): VariationForm => ({
    id: Math.random().toString(36).slice(2),
    label: '',
    sku: '',
    quantity: '',
    price: '',
  });

  const addVariation = () => {
    setVariationForms(prev => [...prev, createVariationForm()]);
  };

  const updateVariation = (id: string, field: keyof Omit<VariationForm, 'id'>, value: string) => {
    setVariationForms(prev => prev.map(variation => (
      variation.id === id ? { ...variation, [field]: value } : variation
    )));
  };

  const removeVariation = (id: string) => {
    setVariationForms(prev => prev.filter(variation => variation.id !== id));
  };

  useEffect(() => {
    if (isEditing && id) {
      loadProduct(id);
    }
  }, [id, isEditing]);

  const loadProduct = async (productId: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load product',
        variant: 'destructive',
      });
      navigate('/admin/products');
      return;
    }

    setFormData({
      ...data,
      price: data.price / 100, // Convert from cents
      uses: data.uses || [],
      gallery: data.gallery || [],
      label: data.label || '',
    });
    setUsesInput((data.uses || []).join(', '));
    setGalleryInput((data.gallery || []).join(', '));
    const parsedVariations = parseProductVariations(data.variations);
    setVariationForms(
      (parsedVariations || []).map(variation => ({
        id: variation.sku || Math.random().toString(36).slice(2),
        label: variation.label,
        sku: variation.sku,
        quantity: variation.quantity != null ? String(variation.quantity) : '',
        price: String(variation.price / 100),
      }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const variationsPayload = variationForms
      .map((variation) => {
        const label = variation.label.trim();
        const sku = variation.sku.trim();
        const priceValue = parseFloat(variation.price);
        const quantityValue = variation.quantity.trim();

        if (!label || !sku || Number.isNaN(priceValue)) {
          return null;
        }

        const quantity = quantityValue ? Number(quantityValue) : null;

        return {
          label,
          sku,
          quantity: quantity != null && !Number.isNaN(quantity) ? quantity : null,
          price: Math.round(priceValue * 100),
        };
      })
      .filter((variation): variation is { label: string; sku: string; quantity: number | null; price: number } => variation !== null);

    const productData = {
      ...formData,
      price: Math.round(formData.price * 100), // Convert to cents
      uses: usesInput.split(',').map(use => use.trim()).filter(Boolean),
      gallery: galleryInput.split(',').map(url => url.trim()).filter(Boolean),
      variations: variationsPayload.length > 0 ? variationsPayload : null,
    };

    try {
      if (isEditing) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Product created successfully',
        });
      }

      navigate('/admin/products');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save product',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/products">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-3xl font-bold">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h1>
            </div>
          </div>

          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>{isEditing ? 'Edit Product' : 'Product Details'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (MUR) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="label">Custom Label</Label>
                    <Input
                      id="label"
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      placeholder="Coming Soon, Best Seller, Limited Edition..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin">Origin</Label>
                    <Input
                      id="origin"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image_url">Main Image URL</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade</Label>
                    <Input
                      id="grade"
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="processing">Processing</Label>
                    <Input
                      id="processing"
                      value={formData.processing}
                      onChange={(e) => setFormData({ ...formData, processing: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storage">Storage Instructions</Label>
                  <Input
                    id="storage"
                    value={formData.storage}
                    onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="uses">Uses (comma-separated)</Label>
                  <Input
                    id="uses"
                    value={usesInput}
                    onChange={(e) => setUsesInput(e.target.value)}
                    placeholder="Baking, Desserts, Aromatherapy"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gallery">Gallery Images (comma-separated URLs)</Label>
                  <Textarea
                    id="gallery"
                    value={galleryInput}
                    onChange={(e) => setGalleryInput(e.target.value)}
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">
                    Add additional product images separated by commas
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Variations</Label>
                      <p className="text-sm text-muted-foreground">
                        Add quantity-based pricing options for this product.
                      </p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addVariation}>
                      Add Variation
                    </Button>
                  </div>

                  {variationForms.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No variations added yet. Click "Add Variation" to create one.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {variationForms.map((variation) => (
                        <div
                          key={variation.id}
                          className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end border border-muted rounded-lg p-3"
                        >
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor={`variation-label-${variation.id}`}>Label</Label>
                            <Input
                              id={`variation-label-${variation.id}`}
                              value={variation.label}
                              onChange={(e) => updateVariation(variation.id, 'label', e.target.value)}
                              placeholder="3 Vanilla Beans"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`variation-sku-${variation.id}`}>SKU</Label>
                            <Input
                              id={`variation-sku-${variation.id}`}
                              value={variation.sku}
                              onChange={(e) => updateVariation(variation.id, 'sku', e.target.value)}
                              placeholder="VL1-3"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`variation-quantity-${variation.id}`}>Quantity</Label>
                            <Input
                              id={`variation-quantity-${variation.id}`}
                              type="number"
                              min="0"
                              value={variation.quantity}
                              onChange={(e) => updateVariation(variation.id, 'quantity', e.target.value)}
                              placeholder="3"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`variation-price-${variation.id}`}>Price (MUR)</Label>
                            <Input
                              id={`variation-price-${variation.id}`}
                              type="number"
                              min="0"
                              step="0.01"
                              value={variation.price}
                              onChange={(e) => updateVariation(variation.id, 'price', e.target.value)}
                              placeholder="210"
                            />
                          </div>
                          <div className="md:col-span-1">
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => removeVariation(variation.id)}
                              className="w-full"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="in_stock"
                      checked={formData.in_stock}
                      onCheckedChange={(checked) => setFormData({ ...formData, in_stock: checked })}
                    />
                    <Label htmlFor="in_stock">In Stock</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    />
                    <Label htmlFor="featured">Featured Product</Label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link to="/admin/products">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </AdminGuard>
  );
}