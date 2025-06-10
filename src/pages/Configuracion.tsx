import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Settings, 
  School, 
  Clock, 
  Bell, 
  Users, 
  Database, 
  Shield, 
  Globe,
  Save,
  RotateCcw,
  Home
} from 'lucide-react';

const Configuracion = () => {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  
  // Estados para la configuración general
  const [generalConfig, setGeneralConfig] = useState({
    nombreInstitucion: 'CET31 - Centro de Educación Técnica',
    direccion: 'Av. Principal 123, Ciudad',
    telefono: '+54 11 1234-5678',
    email: 'contacto@cet31.edu.ar',
    sitioWeb: 'https://www.cet31.edu.ar',
    anoLectivo: '2024'
  });

  // Estados para configuración académica
  const [academicConfig, setAcademicConfig] = useState({
    periodoEvaluacion: 'trimestral',
    notaMinima: 6,
    notaMaxima: 10,
    asistenciaMinima: 75,
    horaInicioClases: '08:00',
    horaFinClases: '17:00',
    duracionModulo: 80
  });

  // Estados para notificaciones
  const [notificationConfig, setNotificationConfig] = useState({
    notificacionesEmail: true,
    notificacionesAsistencia: true,
    notificacionesCalificaciones: true,
    notificacionesEventos: true,
    frecuenciaReportes: 'semanal'
  });

  // Estados para seguridad
  const [securityConfig, setSecurityConfig] = useState({
    sesionExpiracion: 60,
    intentosLoginMax: 3,
    requierePasswordCompleja: true,
    autenticacionDosFactor: false,
    backupAutomatico: true,
    frecuenciaBackup: 'diario'
  });

  const handleSaveGeneral = () => {
    // Aquí se guardaría la configuración general
    toast({
      title: "Configuración guardada",
      description: "La configuración general se ha actualizado correctamente.",
    });
  };

  const handleSaveAcademic = () => {
    // Aquí se guardaría la configuración académica
    toast({
      title: "Configuración académica guardada",
      description: "Los parámetros académicos se han actualizado correctamente.",
    });
  };

  const handleSaveNotifications = () => {
    // Aquí se guardaría la configuración de notificaciones
    toast({
      title: "Configuración de notificaciones guardada",
      description: "Las preferencias de notificaciones se han actualizado.",
    });
  };

  const handleSaveSecurity = () => {
    // Aquí se guardaría la configuración de seguridad
    toast({
      title: "Configuración de seguridad guardada",
      description: "Los parámetros de seguridad se han actualizado correctamente.",
    });
  };

  const handleReset = () => {
    // Resetear a valores por defecto
    toast({
      title: "Configuración restablecida",
      description: "Se han restaurado los valores por defecto.",
      variant: "destructive"
    });
  };

  // Verificar permisos
  if (!hasRole(['administrador'])) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-12 px-4">
          <Card>
            <CardContent className="p-8 text-center">
              <Shield className="h-16 w-16 mx-auto mb-4 text-red-500" />
              <h2 className="text-2xl font-bold mb-2">Acceso Denegado</h2>
              <p className="text-gray-600">Solo los administradores pueden acceder a la configuración del sistema.</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Settings className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
              <p className="text-gray-600 mt-2">
                Gestiona los parámetros y preferencias del sistema educativo
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Administrador
            </Badge>
            <Button asChild variant="outline">
              <Link to="/" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Volver al Inicio</span>
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <School className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="academic" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Académico
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Seguridad
            </TabsTrigger>
          </TabsList>

          {/* Configuración General */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5" />
                  Información de la Institución
                </CardTitle>
                <CardDescription>
                  Configuración básica de la institución educativa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombreInstitucion">Nombre de la Institución</Label>
                    <Input
                      id="nombreInstitucion"
                      value={generalConfig.nombreInstitucion}
                      onChange={(e) => setGeneralConfig({...generalConfig, nombreInstitucion: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="anoLectivo">Año Lectivo</Label>
                    <Input
                      id="anoLectivo"
                      value={generalConfig.anoLectivo}
                      onChange={(e) => setGeneralConfig({...generalConfig, anoLectivo: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    value={generalConfig.direccion}
                    onChange={(e) => setGeneralConfig({...generalConfig, direccion: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={generalConfig.telefono}
                      onChange={(e) => setGeneralConfig({...generalConfig, telefono: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={generalConfig.email}
                      onChange={(e) => setGeneralConfig({...generalConfig, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sitioWeb">Sitio Web</Label>
                    <Input
                      id="sitioWeb"
                      value={generalConfig.sitioWeb}
                      onChange={(e) => setGeneralConfig({...generalConfig, sitioWeb: e.target.value})}
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restablecer
                  </Button>
                  <Button onClick={handleSaveGeneral}>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuración Académica */}
          <TabsContent value="academic">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Parámetros Académicos
                </CardTitle>
                <CardDescription>
                  Configuración de evaluaciones, horarios y parámetros educativos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="periodoEvaluacion">Período de Evaluación</Label>
                    <Select value={academicConfig.periodoEvaluacion} onValueChange={(value) => setAcademicConfig({...academicConfig, periodoEvaluacion: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bimestral">Bimestral</SelectItem>
                        <SelectItem value="trimestral">Trimestral</SelectItem>
                        <SelectItem value="cuatrimestral">Cuatrimestral</SelectItem>
                        <SelectItem value="semestral">Semestral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duracionModulo">Duración del Módulo (minutos)</Label>
                    <Input
                      id="duracionModulo"
                      type="number"
                      value={academicConfig.duracionModulo}
                      onChange={(e) => setAcademicConfig({...academicConfig, duracionModulo: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="notaMinima">Nota Mínima</Label>
                    <Input
                      id="notaMinima"
                      type="number"
                      min="1"
                      max="10"
                      value={academicConfig.notaMinima}
                      onChange={(e) => setAcademicConfig({...academicConfig, notaMinima: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notaMaxima">Nota Máxima</Label>
                    <Input
                      id="notaMaxima"
                      type="number"
                      min="1"
                      max="10"
                      value={academicConfig.notaMaxima}
                      onChange={(e) => setAcademicConfig({...academicConfig, notaMaxima: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="asistenciaMinima">Asistencia Mínima Requerida (%)</Label>
                  <Input
                    id="asistenciaMinima"
                    type="number"
                    min="0"
                    max="100"
                    value={academicConfig.asistenciaMinima}
                    onChange={(e) => setAcademicConfig({...academicConfig, asistenciaMinima: parseInt(e.target.value)})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="horaInicioClases">Hora de Inicio de Clases</Label>
                    <Input
                      id="horaInicioClases"
                      type="time"
                      value={academicConfig.horaInicioClases}
                      onChange={(e) => setAcademicConfig({...academicConfig, horaInicioClases: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horaFinClases">Hora de Fin de Clases</Label>
                    <Input
                      id="horaFinClases"
                      type="time"
                      value={academicConfig.horaFinClases}
                      onChange={(e) => setAcademicConfig({...academicConfig, horaFinClases: e.target.value})}
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restablecer
                  </Button>
                  <Button onClick={handleSaveAcademic}>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuración de Notificaciones */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Configuración de Notificaciones
                </CardTitle>
                <CardDescription>
                  Gestiona las notificaciones automáticas del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notificacionesEmail">Notificaciones por Email</Label>
                      <p className="text-sm text-gray-500">
                        Enviar notificaciones importantes por correo electrónico
                      </p>
                    </div>
                    <Switch
                      id="notificacionesEmail"
                      checked={notificationConfig.notificacionesEmail}
                      onCheckedChange={(checked) => setNotificationConfig({...notificationConfig, notificacionesEmail: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notificacionesAsistencia">Notificaciones de Asistencia</Label>
                      <p className="text-sm text-gray-500">
                        Alertas automáticas por inasistencias
                      </p>
                    </div>
                    <Switch
                      id="notificacionesAsistencia"
                      checked={notificationConfig.notificacionesAsistencia}
                      onCheckedChange={(checked) => setNotificationConfig({...notificationConfig, notificacionesAsistencia: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notificacionesCalificaciones">Notificaciones de Calificaciones</Label>
                      <p className="text-sm text-gray-500">
                        Avisos cuando se cargan nuevas calificaciones
                      </p>
                    </div>
                    <Switch
                      id="notificacionesCalificaciones"
                      checked={notificationConfig.notificacionesCalificaciones}
                      onCheckedChange={(checked) => setNotificationConfig({...notificationConfig, notificacionesCalificaciones: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notificacionesEventos">Notificaciones de Eventos</Label>
                      <p className="text-sm text-gray-500">
                        Recordatorios de eventos y actividades
                      </p>
                    </div>
                    <Switch
                      id="notificacionesEventos"
                      checked={notificationConfig.notificacionesEventos}
                      onCheckedChange={(checked) => setNotificationConfig({...notificationConfig, notificacionesEventos: checked})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frecuenciaReportes">Frecuencia de Reportes</Label>
                  <Select value={notificationConfig.frecuenciaReportes} onValueChange={(value) => setNotificationConfig({...notificationConfig, frecuenciaReportes: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diario">Diario</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="quincenal">Quincenal</SelectItem>
                      <SelectItem value="mensual">Mensual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restablecer
                  </Button>
                  <Button onClick={handleSaveNotifications}>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuración de Seguridad */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Configuración de Seguridad
                </CardTitle>
                <CardDescription>
                  Parámetros de seguridad y respaldo del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sesionExpiracion">Expiración de Sesión (minutos)</Label>
                    <Input
                      id="sesionExpiracion"
                      type="number"
                      min="15"
                      max="480"
                      value={securityConfig.sesionExpiracion}
                      onChange={(e) => setSecurityConfig({...securityConfig, sesionExpiracion: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="intentosLoginMax">Máximo Intentos de Login</Label>
                    <Input
                      id="intentosLoginMax"
                      type="number"
                      min="3"
                      max="10"
                      value={securityConfig.intentosLoginMax}
                      onChange={(e) => setSecurityConfig({...securityConfig, intentosLoginMax: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="requierePasswordCompleja">Contraseña Compleja Requerida</Label>
                      <p className="text-sm text-gray-500">
                        Exigir contraseñas con mayúsculas, minúsculas, números y símbolos
                      </p>
                    </div>
                    <Switch
                      id="requierePasswordCompleja"
                      checked={securityConfig.requierePasswordCompleja}
                      onCheckedChange={(checked) => setSecurityConfig({...securityConfig, requierePasswordCompleja: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autenticacionDosFactor">Autenticación de Dos Factores</Label>
                      <p className="text-sm text-gray-500">
                        Habilitar 2FA para cuentas administrativas
                      </p>
                    </div>
                    <Switch
                      id="autenticacionDosFactor"
                      checked={securityConfig.autenticacionDosFactor}
                      onCheckedChange={(checked) => setSecurityConfig({...securityConfig, autenticacionDosFactor: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="backupAutomatico">Respaldo Automático</Label>
                      <p className="text-sm text-gray-500">
                        Crear copias de seguridad automáticas de la base de datos
                      </p>
                    </div>
                    <Switch
                      id="backupAutomatico"
                      checked={securityConfig.backupAutomatico}
                      onCheckedChange={(checked) => setSecurityConfig({...securityConfig, backupAutomatico: checked})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frecuenciaBackup">Frecuencia de Respaldo</Label>
                  <Select value={securityConfig.frecuenciaBackup} onValueChange={(value) => setSecurityConfig({...securityConfig, frecuenciaBackup: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cada6horas">Cada 6 horas</SelectItem>
                      <SelectItem value="diario">Diario</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="mensual">Mensual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restablecer
                  </Button>
                  <Button onClick={handleSaveSecurity}>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Configuracion;
