import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';

export type NotificationType = 'info' | 'warning' | 'error' | 'success';

export interface Notification {
  id: string;
  tipo: NotificationType;
  titulo: string;
  mensaje: string;
  fecha: Date;
  leida: boolean;
  accionUrl?: string;
  accionTexto?: string;
}

type Alerta = { id: number; created_at: string; tipo: string; titulo: string; mensaje: string };

const toNotification = (a: Alerta, leida: boolean): Notification => ({
  id: String(a.id),
  tipo: a.tipo === 'login_fallido' ? 'error' : 'warning',
  titulo: a.titulo,
  mensaje: a.mensaje,
  fecha: new Date(a.created_at),
  leida,
  accionUrl: '/auditoria',
  accionTexto: 'Ver registro',
});

export const useNotifications = () => {
  const { user, hasRole } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const isManager = !!user && hasRole(['administrador', 'directivo']);
  const uid = user?.id;

  const load = useCallback(async () => {
    if (!isManager) { setNotifications([]); return; }
    setLoading(true);
    const [{ data: alertas }, { data: leidas }] = await Promise.all([
      supabase.from('alertas_seguridad').select('id,created_at,tipo,titulo,mensaje').order('created_at', { ascending: false }).limit(50),
      supabase.from('alertas_leidas').select('alerta_id,oculta'),
    ]);
    const state = new Map((leidas ?? []).map(l => [l.alerta_id, l.oculta]));
    setNotifications((alertas ?? []).filter(a => state.get(a.id) !== true).map(a => toNotification(a, state.has(a.id))));
    setLoading(false);
  }, [isManager]);

  useEffect(() => { void load(); }, [load, uid]);

  useEffect(() => {
    if (!isManager) return;
    const channel = supabase
      .channel(`alertas-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'alertas_seguridad' }, (payload) => {
        const a = payload.new as Alerta;
        setNotifications(prev => prev.some(n => n.id === String(a.id)) ? prev : [toNotification(a, false), ...prev]);
        toast({ title: a.titulo, description: a.mensaje, variant: a.tipo === 'login_fallido' ? 'destructive' : 'default' });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isManager, toast]);

  const save = async (ids: string[], oculta: boolean) => {
    const { data } = await supabase.auth.getUser();
    if (!data.user || ids.length === 0) return;
    await supabase.from('alertas_leidas').upsert(ids.map(id => ({ alerta_id: Number(id), user_id: data.user!.id, oculta })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n));
    void save([id], false);
  };

  const markAllAsRead = () => {
    const ids = notifications.filter(n => !n.leida).map(n => n.id);
    setNotifications(prev => prev.map(n => ({ ...n, leida: true })));
    void save(ids, false);
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    void save([id], true);
  };

  const unreadCount = notifications.filter(n => !n.leida).length;

  return { notifications, loading, unreadCount, markAsRead, markAllAsRead, deleteNotification };
};
