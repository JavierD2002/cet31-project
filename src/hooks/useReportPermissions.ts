import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { canConsultReport, type ReportType } from '@/lib/reportPermissions';

export function useReportPermissions() {
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ['reportPermissions', user?.authId],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from('report_permissions').select('*');
      if (error) throw error;
      return data;
    },
    refetchInterval: 10000,
    refetchOnWindowFocus: 'always',
  });
  return { ...query, canConsult: (type: ReportType) => !!user && !!query.data && !query.isError && canConsultReport(type, user.rol, query.data) };
}