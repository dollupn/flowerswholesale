import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/AuthGuard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });

  // Fetch profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: typeof formData) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: profileData.email,
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          phone: profileData.phone,
          address_line1: profileData.address,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      console.error('Profile update error:', error);
    },
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        email: profile.email || user?.email || "",
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        phone: profile.phone || "",
        address: profile.address_line1 || "",
      });
    }
  }, [profile, user?.email]);

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (profile) {
      setFormData({
        email: profile.email || user?.email || "",
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        phone: profile.phone || "",
        address: profile.address_line1 || "",
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-vanilla-cream via-white to-vanilla-beige">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-8"></div>
              <div className="bg-white rounded-lg p-6">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-vanilla-cream via-white to-vanilla-beige">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-vanilla-brown mb-8">My Profile</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Manage your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={formData.email}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                {isEditing ? (
                  <>
                    <Button 
                      onClick={handleSave} 
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleCancel}
                      disabled={updateProfileMutation.isPending}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function Profile() {
  return (
    <AuthGuard>
      <ProfilePage />
    </AuthGuard>
  );
}