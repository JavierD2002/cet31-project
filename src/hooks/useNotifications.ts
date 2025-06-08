
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from './use-toast';

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

// Simulación de notificaciones automáticas
const mockNotifications: Notification[] = [
  {
    id: '1',
    tipo: 'warning',
    titulo: 'Asistencia Baja',
    mensaje: 'El estudiante Juan Pérez tiene menos del 75% de asistencia',
    fecha: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
    leida: false,
    accionUrl: '/estudiantes/1/perfil',
    accionTexto: 'Ver Perfil'
  },
  {
    id: '2',
    tipo: 'info',
    titulo: 'Nuevo Informe',
    mensaje: 'Se ha generado el informe mensual de rendimiento académico',
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
    leida: false,
    accionUrl: '/informes',
    accionTexto: 'Ver Informes'
  },
  {
    id: '3',
    tipo: 'success',
    titulo: 'Calificaciones Actualizadas',
    mensaje: 'Se han cargado las calificaciones del primer trimestre',
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 horas atrás
    leida: true,
    accionUrl: '/calificaciones',
    accionTexto: 'Ver Calificaciones'
  },
  {
    id: '4',
    tipo: 'error',
    titulo: 'Error en Sistema',
    mensaje: 'Falló la sincronización automática de datos',
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 horas atrás
    leida: false
  }
];

export const useNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar notificaciones
  useEffect(() => {
    if (user) {
      setLoading(true);
      // Simular carga de notificaciones filtradas por rol
      const filteredNotifications = mockNotifications.filter(notification => {
        // Filtrar notificaciones según el rol del usuario
        if (user.rol === 'estudiante') {
          return ['info', 'success'].includes(notification.tipo);
        }
        if (user.rol === 'docente') {
          return notification.tipo !== 'error';
        }
        // Administradores y directivos ven todas las notificaciones
        return true;
      });
      
      setNotifications(filteredNotifications);
      setLoading(false);
    }
  }, [user]);

  // Verificar notificaciones nuevas cada 30 segundos
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      // Simular nuevas notificaciones automáticas
      const newNotifications = checkForNewNotifications();
      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev]);
        
        // Mostrar toast para notificaciones importantes
        newNotifications.forEach(notification => {
          if (notification.tipo === 'warning' || notification.tipo === 'error') {
            toast({
              title: notification.titulo,
              description: notification.mensaje,
              variant: notification.tipo === 'error' ? 'destructive' : 'default',
            });
          }
        });
      }
    }, 30000); // Cada 30 segundos

    return () => clearInterval(interval);
  }, [user, toast]);

  const checkForNewNotifications = (): Notification[] => {
    // Simular lógica de verificación de nuevas notificaciones
    const random = Math.random();
    
    if (random < 0.1) { // 10% de probabilidad
      const newNotification: Notification = {
        id: Date.now().toString(),
        tipo: 'info',
        titulo: 'Notificación Automática',
        mensaje: 'Se detectó una nueva actividad en el sistema',
        fecha: new Date(),
        leida: false
      };
      
      return [newNotification];
    }
    
    return [];
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, leida: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, leida: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const unreadCount = notifications.filter(n => !n.leida).length;

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};
