
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Home,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  FileText,
  BarChart3,
  Building,
  Settings,
  User,
  BookUser
} from 'lucide-react';

export function AppSidebar() {
  const { hasRole } = useAuth();
  const location = useLocation();

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
        { to: '/libro-de-tema', label: 'Libro de Tema', icon: BookUser },
        { to: '/informes', label: 'Informes', icon: BarChart3 }
      );
    }

    return items;
  };

  const getAdminItems = () => {
    if (!hasRole('administrador')) return [];
    
    return [
      { to: '/admin/usuarios', label: 'Gestión de Usuarios', icon: User },
      { to: '/configuracion', label: 'Configuración', icon: Settings }
    ];
  };

  const navigationItems = getNavigationItems();
  const adminItems = getAdminItems();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/23fe776b-bfc4-4d5b-91a2-a06fdf2c43d1.png" 
            alt="Logo CET 31" 
            className="w-8 h-8 object-contain"
          />
          <span className="font-bold text-lg">CET N° 31</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.to} className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {adminItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Administración</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.to;
                  
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link to={item.to} className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground">
          Sistema de Gestión Escolar
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
