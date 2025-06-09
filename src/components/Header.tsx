
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Settings,
  Home,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  FileText,
  BarChart3,
  Building
} from 'lucide-react';
import NotificationCenter from './NotificationCenter';

const Header = () => {
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();
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

  const getNavigationItems = () => {
    const items = [];

    // Dashboard según rol
    if (hasRole('administrador')) {
      items.push({ to: '/admin/dashboard', label: 'Dashboard Admin', icon: Home });
    } else if (hasRole('directivo')) {
      items.push({ to: '/directivo/dashboard', label: 'Dashboard Directivo', icon: Home });
    } else if (hasRole('docente')) {
      items.push({ to: '/docente/dashboard', label: 'Dashboard Docente', icon: Home });
    } else if (hasRole('estudiante')) {
      items.push({ to: '/estudiante/dashboard', label: 'Mi Dashboard', icon: Home });
    }

    // Navegación común para administradores y directivos
    if (hasRole(['administrador', 'directivo'])) {
      items.push(
        { to: '/estudiantes', label: 'Estudiantes', icon: GraduationCap },
        { to: '/docentes', label: 'Docentes', icon: Users },
        { to: '/asignaturas', label: 'Asignaturas', icon: BookOpen },
        { to: '/aulas', label: 'Aulas', icon: Building }
      );
    }

    // Navegación para docentes, directivos y administradores
    if (hasRole(['docente', 'directivo', 'administrador'])) {
      items.push(
        { to: '/asistencia', label: 'Asistencia', icon: Calendar },
        { to: '/calificaciones', label: 'Calificaciones', icon: FileText },
        { to: '/libro-de-tema', label: 'Libro de Tema', icon: BookOpen },
        { to: '/informes', label: 'Informes', icon: BarChart3 }
      );
    }

    // Administración exclusiva para administradores
    if (hasRole('administrador')) {
      items.push(
        { to: '/admin/usuarios', label: 'Gestión de Usuarios', icon: Settings }
      );
    }

    return items;
  };

  const navigationItems = getNavigationItems();

  if (!user) {
    return null;
  }

  return (
    <header className="bg-blue-600 shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/23fe776b-bfc4-4d5b-91a2-a06fdf2c43d1.png" 
                alt="Logo CET 31" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold text-white">
                SISTEMA DE GESTIÓN ESCOLAR - CET N° 31
              </span>
            </Link>
          </div>

          {/* Navegación principal */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.slice(0, 6).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-800 text-white'
                      : 'text-blue-100 hover:text-white hover:bg-blue-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {/* Más opciones si hay muchos elementos */}
            {navigationItems.length > 6 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-blue-100 hover:text-white hover:bg-blue-700">
                    Más
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {navigationItems.slice(6).map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem key={item.to} asChild>
                        <Link to={item.to} className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

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
