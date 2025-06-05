
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/supabase';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['administrador', 'directivo', 'docente', 'estudiante'] 
}) => {
  console.log('ProtectedRoute rendering...');
  
  let authData;
  try {
    authData = useAuth();
    console.log('useAuth successful:', authData);
  } catch (error) {
    console.error('useAuth error:', error);
    // Si hay error con useAuth, redirigir al login
    return <Navigate to="/login" replace />;
  }

  const { isAuthenticated, loading, hasRole } = authData;
  const location = useLocation();

  console.log('Auth state:', { isAuthenticated, loading, hasRole: typeof hasRole });

  // Si está cargando, mostrar un indicador de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Cargando...</span>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar si el usuario tiene el rol permitido
  if (!hasRole(allowedRoles)) {
    // Redirigir según el rol actual del usuario
    return <Navigate to="/acceso-denegado" replace />;
  }

  // Si está autenticado y tiene el rol permitido, mostrar la ruta protegida
  return <>{children}</>;
};

export default ProtectedRoute;
