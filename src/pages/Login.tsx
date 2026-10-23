import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
const Login = () => {
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const { login, loading, isAuthenticated, homePath } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!loading && isAuthenticated) navigate(homePath, { replace: true }); }, [loading, isAuthenticated, homePath, navigate]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError(''); setNotice('');
    try {
      if (register) {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: window.location.origin, data: { nombre, apellido } } });
        if (error) throw error;
        setNotice(data.session ? 'Cuenta creada.' : 'Revisá tu correo y confirmá tu cuenta antes de iniciar sesión.');
      } else await login(email, password);
    } catch { setError(register ? 'No se pudo crear la cuenta. Revisá los datos o intentá más tarde.' : 'No se pudo iniciar sesión. Revisá el correo, la contraseña y la confirmación de tu cuenta.'); }
    finally { setBusy(false); }
  };
  const socialLogin = async (provider: 'google' | 'lovable') => {
    setBusy(true); setError('');
    try { const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin }); if (result.error) throw result.error; }
    catch { setError('No se pudo iniciar sesión con esta cuenta.'); }
    finally { setBusy(false); }
  };
  return <div className="min-h-screen flex items-center justify-center bg-muted px-4 py-8">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center space-y-3">
        <img src="/lovable-uploads/23fe776b-bfc4-4d5b-91a2-a06fdf2c43d1.png" alt="CET N° 31" className="h-16 w-16 object-contain mx-auto" />
        <CardTitle className="text-2xl">CET N° 31</CardTitle>
        <p className="text-muted-foreground">Sistema de Gestión Escolar</p>
        <h1 className="text-lg font-semibold">{register ? 'Crear cuenta' : 'Iniciar sesión'}</h1>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {register && <div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label htmlFor="nombre">Nombre</Label><Input id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} required autoComplete="given-name" /></div><div className="space-y-2"><Label htmlFor="apellido">Apellido</Label><Input id="apellido" value={apellido} onChange={e => setApellido(e.target.value)} required autoComplete="family-name" /></div></div>}
          <div className="space-y-2"><Label htmlFor="email">Correo electrónico</Label><Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required disabled={busy} /></div>
          <div className="space-y-2"><Label htmlFor="password">Contraseña</Label><Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete={register ? 'new-password' : 'current-password'} minLength={register ? 8 : undefined} required disabled={busy} /></div>
          {!register && <Link to="/olvide-contrasena" className="block text-sm text-primary underline">¿Olvidó su contraseña?</Link>}
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          {notice && <p role="status" className="text-sm">{notice}</p>}
          <Button type="submit" className="w-full" disabled={busy || loading}>{busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{register ? 'Crear cuenta' : 'Iniciar sesión'}</Button>
        </form>
        <div className="grid gap-2"><Button variant="outline" disabled={busy} onClick={() => socialLogin('google')}>Continuar con Google</Button><Button variant="outline" disabled={busy} onClick={() => socialLogin('lovable')}>Continuar con Lovable</Button></div>
        <Button variant="link" className="w-full" onClick={() => { setRegister(!register); setError(''); setNotice(''); }}>{register ? 'Ya tengo una cuenta' : 'Crear cuenta'}</Button>
      </CardContent>
    </Card>
  </div>;
};
export default Login;
