
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  LogOut, 
  User,
  Home
} from 'lucide-react';
import NotificationCenter from './NotificationCenter';

const Header = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getUserInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  const getRoleBadgeColor = (rol: string) => {
    switch (rol) {
      case 'administrador':
        return 'bg-red-100 text-red-800';
      case 'directivo':
        return 'bg-purple-100 text-purple-800';
      case 'docente':
        return 'bg-blue-100 text-blue-800';
      case 'estudiante':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <header className="bg-blue-600 shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Título simplificado */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              asChild
              className="text-white hover:bg-blue-700"
            >
              <Link to="/" className="flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span className="hidden md:inline">Inicio</span>
              </Link>
            </Button>
            <div className="h-8 w-px bg-blue-400 hidden md:block"></div>
            <span className="text-xl font-bold text-white">
              SISTEMA DE GESTIÓN ESCOLAR - CET N° 31
            </span>
          </div>

          {/* Área de usuario */}
          <div className="flex items-center space-x-3">
            {/* Centro de notificaciones */}
            <NotificationCenter />

            {/* Información del usuario */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-blue-700">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {getUserInitials(user.nombre, user.apellido)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-white">{user.nombre} {user.apellido}</p>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getRoleBadgeColor(user.rol)}`}
                    >
                      {user.rol.charAt(0).toUpperCase() + user.rol.slice(1)}
                    </Badge>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{user.nombre} {user.apellido}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Perfil según el rol */}
                {hasRole('estudiante') && (
                  <DropdownMenuItem asChild>
                    <Link to={`/estudiantes/${user.id}/perfil`} className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Mi Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                {hasRole('docente') && (
                  <DropdownMenuItem asChild>
                    <Link to={`/docentes/${user.id}/perfil`} className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Mi Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
