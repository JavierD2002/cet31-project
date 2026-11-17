import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/supabase';
import { Loader2 } from 'lucide-react';
import { useReportPermissions } from '@/hooks/useReportPermissions';
import { reportForPath } from '@/lib/reportPermissions';
interface ProtectedRouteProps { children: React.ReactNode; allowedRoles?: UserRole[] }
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = ['administrador', 'directivo', 'docente', 'estudiante'] }) => {
  const { isAuthenticated, loading, hasRole } = useAuth();
  const location = useLocation();
  const report = reportForPath(location.pathname);
  const permissions = useReportPermissions();
  if (loading) return <div className="flex min-h-screen items-center justify-center gap-2"><Loader2 className="h-8 w-8 animate-spin text-primary" /><span>Cargando…</span></div>;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!hasRole(allowedRoles)) return <Navigate to="/acceso-denegado" replace />;
  if (report && permissions.isPending) return <p className="p-8 text-muted-foreground">Cargando permisos…</p>;
  if (report && !permissions.canConsult(report)) return <Navigate to="/acceso-denegado" replace />;
  return <>{children}</>;
};
export default ProtectedRoute;
