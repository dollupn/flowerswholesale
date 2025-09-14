import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type UserRole = 'admin' | 'customer';

export function useRole() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) throw error;

      const roles = (data ?? []).map((r: { role: string }) => r.role as UserRole);
      if (roles.includes('admin')) return 'admin' as UserRole;
      if (roles.includes('customer')) return 'customer' as UserRole;
      return null;
    },
    enabled: !!user,
  });
}

export function useIsAdmin() {
  const { data: role, isLoading } = useRole();
  return {
    isAdmin: role === 'admin',
    isLoading,
  };
}