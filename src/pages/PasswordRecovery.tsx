import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
const PasswordRecovery = ({ reset = false }: { reset?: boolean }) => {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState('');
  const [recovery, setRecovery] = useState(new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery');
  const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [notice, setNotice] = useState('');
  useEffect(() => { const { data } = supabase.auth.onAuthStateChange(event => { if (event === 'PASSWORD_RECOVERY') setRecovery(true); }); return () => data.subscription.unsubscribe(); }, []);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setNotice(''); setBusy(true);
    try {
      if (reset) {
        if (!recovery) throw new Error('Abrí el enlace de recuperación enviado a tu correo.');
        if (password !== confirm) throw new Error('Las contraseñas no coinciden.');
        const { error } = await supabase.auth.updateUser({ password }); if (error) throw new Error('No se pudo cambiar la contraseña. Solicitá otro enlace.');
        await supabase.auth.signOut(); setNotice('Contraseña actualizada. Ya podés iniciar sesión.');
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw new Error('No se pudo enviar el enlace. Intentá más tarde.');
        setNotice('Si existe una cuenta con este correo, recibirás un enlace de recuperación.');
      }
    } catch (err) { setError(err instanceof Error ? err.message : 'No se pudo completar la solicitud.'); } finally { setBusy(false); }
  };
  return <div className="min-h-screen flex items-center justify-center bg-muted px-4"><Card className="w-full max-w-md"><CardHeader><CardTitle>{reset ? 'Nueva contraseña' : 'Recuperar contraseña'}</CardTitle></CardHeader><CardContent className="space-y-4"><form onSubmit={submit} className="space-y-4">{reset ? <><Label htmlFor="new-password">Nueva contraseña</Label><Input id="new-password" type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} /><Label htmlFor="confirm-password">Confirmar contraseña</Label><Input id="confirm-password" type="password" autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={8} /></> : <><Label htmlFor="email">Correo electrónico</Label><Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required /></>}{error && <p role="alert" className="text-destructive text-sm">{error}</p>}{notice && <p role="status" className="text-sm">{notice}</p>}<Button type="submit" disabled={busy || (reset && (!recovery || !!notice))} className="w-full">{reset ? 'Guardar contraseña' : 'Enviar enlace'}</Button></form><Link to="/login" className="text-primary underline text-sm">Volver al inicio de sesión</Link></CardContent></Card></div>;
};
export default PasswordRecovery;
