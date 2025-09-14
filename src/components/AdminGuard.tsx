import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useRole';

interface AdminGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AdminGuard({ children, redirectTo = '/' }: AdminGuardProps) {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useIsAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !roleLoading) {
      if (!user) {
        console.log('AdminGuard: No user, redirecting to:', redirectTo);
        navigate(redirectTo);
      } else if (!isAdmin) {
        console.log('AdminGuard: User is not admin, redirecting to:', redirectTo);
        navigate(redirectTo);
      } else {
        console.log('AdminGuard: Access granted for admin user');
      }
    }
  }, [user, isAdmin, authLoading, roleLoading, navigate, redirectTo]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}