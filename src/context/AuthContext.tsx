import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/supabase';
import { useToast } from '@/components/ui/use-toast';

type User = { id: number; authId: string; email: string; nombre: string; apellido: string; rol: UserRole; studentId?: number; teacherId?: number };
type AuthContextType = { user: User | null; loading: boolean; login: (email: string, password: string) => Promise<void>; logout: () => Promise<void>; isAuthenticated: boolean; hasRole: (roles: UserRole | UserRole[]) => boolean; homePath: string };
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const homePaths: Record<UserRole, string> = { administrador: '/admin/dashboard', directivo: '/directivo/dashboard', docente: '/docente/dashboard', estudiante: '/estudiante/dashboard', panolero: '/panol' };
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const version = useRef(0);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  useEffect(() => {
    localStorage.removeItem('sgcet31_user');
    let alive = true;
    const hydrate = async () => {
      const current = ++version.current;
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) {
          if (alive && current === version.current) { setUser(null); setAuthenticated(false); }
          return;
        }
        const account = data.user;
        const [profileResult, roleResult] = await Promise.all([
          supabase.from('profiles').select('usuario_id,nombre,apellido').eq('id', account.id).maybeSingle(),
          supabase.from('user_roles').select('role').eq('user_id', account.id).maybeSingle(),
        ]);
        if (profileResult.error || roleResult.error) throw profileResult.error || roleResult.error;
        const profile = profileResult.data;
        const role = roleResult.data?.role;
        let resolved: User | null = null;
        if (profile?.usuario_id && role) {
          const valid = await supabase.rpc('has_school_role', { wanted: role });
          if (valid.error) throw valid.error;
          if (valid.data) {
            const [student, teacher] = await Promise.all([
              role === 'estudiante' ? supabase.from('estudiantes').select('id').eq('usuario_id', profile.usuario_id).maybeSingle() : Promise.resolve({ data: null, error: null }),
              role === 'docente' ? supabase.from('docentes').select('id').eq('usuario_id', profile.usuario_id).maybeSingle() : Promise.resolve({ data: null, error: null }),
            ]);
            if (student.error || teacher.error) throw student.error || teacher.error;
            resolved = { id: profile.usuario_id, authId: account.id, email: account.email || '', nombre: profile.nombre, apellido: profile.apellido, rol: role, studentId: student.data?.id, teacherId: teacher.data?.id };
          }
        }
        if (alive && current === version.current) { setUser(resolved); setAuthenticated(true); }
      } catch {
        if (alive && current === version.current) { setUser(null); setAuthenticated(false); }
      } finally {
        if (alive && current === version.current) setLoading(false);
      }
    };
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        ++version.current;
        setUser(null); setAuthenticated(false); setLoading(false); queryClient.clear();
      } else {
        // Defer Auth calls until the listener releases its internal lock.
        window.setTimeout(() => { if (alive) void hydrate(); }, 0);
      }
    });
    void hydrate();
    const onFocus = () => void hydrate();
    window.addEventListener('focus', onFocus);
    return () => { alive = false; ++version.current; listener.subscription.unsubscribe(); window.removeEventListener('focus', onFocus); };
  }, [queryClient]);
  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw error;
  };
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) { toast({ title: 'No se pudo cerrar la sesión', variant: 'destructive' }); return; }
    queryClient.clear(); setUser(null); setAuthenticated(false); navigate('/login', { replace: true });
  };
  const hasRole = (roles: UserRole | UserRole[]) => !!user && (Array.isArray(roles) ? roles.includes(user.rol) : roles === user.rol);
  return <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: authenticated, hasRole, homePath: user ? homePaths[user.rol] : '/acceso-denegado' }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  return context;
};
