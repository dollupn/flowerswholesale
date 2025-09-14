import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, UserCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminSetup() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClaimAdmin = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to claim admin access.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert([{ user_id: user.id, role: 'admin' }]);

      if (error) {
        console.error('Error claiming admin:', error);
        // If duplicate key, the user already has the admin role
        if ((error as any).code === '23505') {
          toast({
            title: "You're already an admin",
            description: "Redirecting to admin dashboard...",
          });
          setTimeout(() => {
            navigate('/admin');
          }, 1000);
        } else {
          toast({
            title: "Error",
            description: "Failed to claim admin access. There might already be an admin user.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Success",
          description: "Admin access claimed successfully! Redirecting to admin dashboard...",
        });
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      }
    } catch (error) {
      console.error('Error claiming admin:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Setup</CardTitle>
          <CardDescription>
            Claim admin access to manage your store
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!user ? (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                You need to be logged in to claim admin access.
              </p>
              <Button asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-primary" />
                  <span className="font-medium">Logged in as:</span>
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Click below to claim admin access. This only works if no admin user exists yet.
              </p>
              
              <Button 
                onClick={handleClaimAdmin} 
                disabled={loading}
                className="w-full"
              >
                {loading ? "Claiming..." : "Claim Admin Access"}
              </Button>
              
              <div className="text-center">
                <Button variant="ghost" asChild>
                  <Link to="/">Back to Home</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}