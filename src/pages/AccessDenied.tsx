
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { ShieldX, Home, LogOut } from 'lucide-react';

const AccessDenied = () => {
  const { logout, user } = useAuth();

  // Determinar página de inicio según el rol
  const getHomepage = () => {
    if (!user) return '/login';
    
    switch (user.rol) {
      case 'estudiante':
        return '/estudiante/dashboard';
      case 'docente':
        return '/docente/dashboard';
      default:
        return '/';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <ShieldX className="h-12 w-12 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">Acceso denegado</CardTitle>
          <CardDescription>
            No tiene permisos para acceder a esta sección del sistema.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">
            Su rol actual ({user?.rol}) no tiene los permisos necesarios para ver esta página.
            Por favor, contacte al administrador si cree que se trata de un error.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="default">
              <Link to={getHomepage()}>
                <Home className="mr-2 h-4 w-4" />
                Ir al inicio
              </Link>
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessDenied;
