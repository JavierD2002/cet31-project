import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/supabase';
import { Loader2 } from 'lucide-react';
interface ProtectedRouteProps { children: React.ReactNode; allowedRoles?: UserRole[] }
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = ['administrador', 'directivo', 'docente', 'estudiante'] }) => {
  const { isAuthenticated, loading, hasRole } = useAuth();
  const location = useLocation();
  if (loading) return <div className="flex min-h-screen items-center justify-center gap-2"><Loader2 className="h-8 w-8 animate-spin text-primary" /><span>Cargando…</span></div>;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!hasRole(allowedRoles)) return <Navigate to="/acceso-denegado" replace />;
  return <>{children}</>;
};
export default ProtectedRoute;
