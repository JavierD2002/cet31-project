
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, getMockUsers } from '@/services/supabase';
import { UserRole } from '@/types/supabase';
import { useToast } from '@/components/ui/use-toast';

type User = {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  rol: UserRole;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('AuthProvider rendering...');
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verificar sesión al cargar
  useEffect(() => {
    console.log('AuthProvider useEffect running...');
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem('sgcet31_user');
        if (storedUser) {
          console.log('Found stored user:', storedUser);
          setUser(JSON.parse(storedUser));
        } else {
          console.log('No stored user found');
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
      } finally {
        setLoading(false);
        console.log('Auth loading finished');
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Usuario administrador predefinido
      if (email === "admin" && password === "admin") {
        const adminUser: User = {
          id: 0,
          email: "admin@escuela.edu",
          nombre: "Administrador",
          apellido: "Sistema",
          rol: "administrador"
        };
        
        localStorage.setItem('sgcet31_user', JSON.stringify(adminUser));
        setUser(adminUser);
        
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido, Administrador del Sistema",
        });
        
        navigate('/admin/dashboard');
        return;
      }
      
      // Continuar con la lógica de autenticación existente para otros usuarios
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .single();
        
      if (error || !data) {
        throw new Error('Credenciales inválidas');
      }
      
      // En producción, verificaríamos la contraseña con supabase
      // Por ahora, solo simularemos que es correcta
      
      const userData: User = {
        id: data.id,
        email: data.email,
        nombre: data.nombre,
        apellido: data.apellido,
        rol: data.rol
      };
      
      // Guardar usuario en localStorage para mantener la sesión
      localStorage.setItem('sgcet31_user', JSON.stringify(userData));
      setUser(userData);
      
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${userData.nombre} ${userData.apellido}`,
      });
      
      // Redirigir según el rol al dashboard específico
      if (userData.rol === 'estudiante') {
        navigate('/estudiante/dashboard');
      } else if (userData.rol === 'docente') {
        navigate('/docente/dashboard');
      } else if (userData.rol === 'directivo') {
        navigate('/directivo/dashboard');
      } else if (userData.rol === 'administrador') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
      
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      toast({
        title: "Error de autenticación",
        description: "Usuario o contraseña incorrectos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // En producción: await supabase.auth.signOut();
      localStorage.removeItem('sgcet31_user');
      setUser(null);
      navigate('/login');
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión",
        variant: "destructive",
      });
    }
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.rol);
    }
    
    return user.rol === roles;
  };

  const contextValue = { 
    user, 
    loading, 
    login, 
    logout, 
    isAuthenticated: !!user,
    hasRole 
  };

  console.log('AuthProvider contextValue:', contextValue);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  console.log('useAuth called...');
  const context = useContext(AuthContext);
  console.log('useAuth context:', context);
  
  if (context === undefined) {
    console.error('useAuth error: context is undefined');
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
