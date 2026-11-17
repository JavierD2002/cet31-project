import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Shield } from 'lucide-react';
import { useReportPermissions } from '@/hooks/useReportPermissions';
import { supabase } from '@/integrations/supabase/client';
import { reportTypes, reportRoles, canConsultReport } from '@/lib/reportPermissions';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function ReportPermissionsSettings() {
  const { user } = useAuth();
  const { data, isPending, isError, refetch } = useReportPermissions();
  const client = useQueryClient();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  if (user?.rol !== 'administrador') return null;
  if (isPending) return <p>Cargando permisos…</p>;
  if (isError || !data) return <div role="alert">No se pudieron cargar los permisos. <Button variant="outline" onClick={() => void refetch()}>Reintentar</Button></div>;
  const update = async (report_type: string, role: typeof reportRoles[number]['role'], allowed: boolean) => {
    setSaving(true);
    try {
      const { error } = await supabase.from('report_permissions').upsert({ report_type, role, allowed }, { onConflict: 'report_type,role' });
      if (error) throw error;
      // Remove cached school data so a newly restricted report cannot keep showing old rows.
      await client.invalidateQueries();
      toast({ title: 'Permiso guardado' });
    } catch {
      toast({ title: 'No se pudo guardar el permiso', variant: 'destructive' });
    } finally { setSaving(false); }
  };
  return <section className="space-y-4">
    <h2 className="text-xl font-semibold flex items-center gap-2"><Shield className="h-5 w-5" />Permisos de Reportes</h2>
    <div className="overflow-x-auto border rounded-md">
      <table className="w-full text-sm">
        <thead className="bg-muted"><tr><th className="text-left p-3 min-w-56">Tipo de reporte</th>{reportRoles.map(({ role, label }) => <th className="p-3" key={role}>{label}</th>)}</tr></thead>
        <tbody>{reportTypes.map(report => <tr className="border-t" key={report.key}>
          <th className="p-3 text-left font-medium">{report.label}</th>
          {reportRoles.map(({ role, label }) => <td key={role} className="p-3 text-center">
            {!report.roles.includes(role) ? <span className="text-muted-foreground" title="Módulo no autorizado para este rol">—</span> : <Switch
              aria-label={`${report.label}: ${label}`}
              checked={canConsultReport(report.key, role, data)}
              disabled={saving || role === 'administrador'}
              onCheckedChange={allowed => void update(report.key, role, allowed)}
            />}
          </td>)}
        </tr>)}</tbody>
      </table>
    </div>
  </section>;
}