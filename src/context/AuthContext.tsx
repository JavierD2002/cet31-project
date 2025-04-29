
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabase';
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verificar sesión al cargar
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem('sgcet31_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // En un entorno real, usaríamos supabase.auth.signInWithPassword
      // Pero aquí simplemente simularemos la autenticación con los datos de Supabase
      
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
      
      // Redirigir según el rol
      if (userData.rol === 'estudiante') {
        navigate('/estudiante/dashboard');
      } else if (userData.rol === 'docente') {
        navigate('/docente/dashboard');
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      isAuthenticated: !!user,
      hasRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
