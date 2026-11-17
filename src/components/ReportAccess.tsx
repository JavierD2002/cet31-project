import type { ReactNode } from 'react';
import { useReportPermissions } from '@/hooks/useReportPermissions';
import type { ReportType } from '@/lib/reportPermissions';

export default function ReportAccess({ type, children }: { type: ReportType; children: ReactNode }) {
  const { canConsult, isPending } = useReportPermissions();
  if (isPending) return <p className="text-muted-foreground py-4">Cargando permisos…</p>;
  if (!canConsult(type)) return <p className="text-muted-foreground py-4" role="status">No tienes permiso para consultar este reporte.</p>;
  return <>{children}</>;
}