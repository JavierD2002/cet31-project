
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings } from 'lucide-react';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  // Función para obtener el texto del rol en español
  const getRolText = () => {
    if (!user) return '';
    
    switch (user.rol) {
      case 'administrador':
        return 'Administrador';
      case 'directivo':
        return 'Directivo';
      case 'docente':
        return 'Docente';
      case 'estudiante':
        return 'Estudiante';
      default:
        return '';
    }
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/23fe776b-bfc4-4d5b-91a2-a06fdf2c43d1.png" 
            alt="Logo CET31" 
            className="h-10 mr-3" 
          />
          <h1 className="text-2xl font-bold">Sistema de Gestión Escolar - CET31</h1>
        </div>
        
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm hidden sm:inline-block">
              {user?.nombre} {user?.apellido} - {getRolText()}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-blue-700">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link to={user?.rol === 'estudiante' 
                    ? `/estudiantes/${user?.id}/perfil` 
                    : user?.rol === 'docente'
                      ? `/docentes/${user?.id}/perfil`
                      : "/perfil"
                  }>
                    <User className="mr-2 h-4 w-4" />
                    <span>Mi perfil</span>
                  </Link>
                </DropdownMenuItem>
                
                {(user?.rol === 'administrador' || user?.rol === 'directivo') && (
                  <DropdownMenuItem asChild>
                    <Link to="/configuracion">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configuración</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Button variant="outline" size="sm" asChild className="text-white border-white hover:bg-blue-700">
            <Link to="/login">Iniciar sesión</Link>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
