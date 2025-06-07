
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Users, 
  Settings, 
  Shield, 
  Database, 
  Server,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Activity,
  HardDrive,
  Wifi,
  UserCheck
} from 'lucide-react';
import { getMockUsers } from '@/services/supabase';

const AdminDashboard = () => {
  const { user } = useAuth();

  // Cargar datos del sistema
  const { data: allUsers } = useQuery({
    queryKey: ['systemUsers'],
    queryFn: getMockUsers
  });

  // Estadísticas del sistema (simuladas)
  const totalUsuarios = allUsers?.length || 0;
  const usuariosActivos = Math.floor(totalUsuarios * 0.85); // 85% activos
  const sesionesActivas = 12;
  const usoBD = 67; // Porcentaje de uso de BD
  const rendimientoSistema = 94; // Porcentaje de rendimiento
  const alertasSistema = 3;
  const backupsHoy = 4;

  const estadisticasPorRol = [
    { rol: 'Estudiantes', cantidad: allUsers?.filter(u => u.rol === 'estudiante').length || 0, color: 'bg-blue-500' },
    { rol: 'Docentes', cantidad: allUsers?.filter(u => u.rol === 'docente').length || 0, color: 'bg-green-500' },
    { rol: 'Directivos', cantidad: allUsers?.filter(u => u.rol === 'directivo').length || 0, color: 'bg-purple-500' },
    { rol: 'Administradores', cantidad: allUsers?.filter(u => u.rol === 'administrador').length || 0, color: 'bg-red-500' }
  ];

  const alertasSistemaData = [
    { tipo: 'Rendimiento', descripcion: 'Uso elevado de CPU en servidor principal', nivel: 'media' },
    { tipo: 'Seguridad', descripcion: '2 intentos de acceso fallidos desde IP desconocida', nivel: 'alta' },
    { tipo: 'Backup', descripcion: 'Backup programado completado exitosamente', nivel: 'info' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Panel de Administración - {user?.nombre}</h1>
          <p className="text-gray-600">Control total del sistema y gestión de infraestructura</p>
        </div>

        {/* Métricas del sistema */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuarios Totales</p>
                  <p className="text-3xl font-bold text-blue-600">{totalUsuarios}</p>
                </div>
                <Users className="h-10 w-10 text-blue-600" />
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Activos: {usuariosActivos}</span>
                  <span>{Math.round((usuariosActivos / totalUsuarios) * 100)}%</span>
                </div>
                <Progress value={(usuariosActivos / totalUsuarios) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sesiones Activas</p>
                  <p className="text-3xl font-bold text-green-600">{sesionesActivas}</p>
                </div>
                <Activity className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Uso de BD</p>
                  <p className="text-3xl font-bold text-purple-600">{usoBD}%</p>
                </div>
                <Database className="h-10 w-10 text-purple-600" />
              </div>
              <div className="mt-4">
                <Progress value={usoBD} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rendimiento</p>
                  <p className="text-3xl font-bold text-amber-600">{rendimientoSistema}%</p>
                </div>
                <Server className="h-10 w-10 text-amber-600" />
              </div>
              <div className="mt-4">
                <Progress value={rendimientoSistema} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertas del sistema */}
        {alertasSistema > 0 && (
          <div className="mb-8">
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-800 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Alertas del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alertasSistemaData.map((alerta, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant={
                          alerta.nivel === 'alta' ? 'destructive' : 
                          alerta.nivel === 'media' ? 'default' : 'secondary'
                        }>
                          {alerta.tipo}
                        </Badge>
                        <span className="text-sm">{alerta.descripcion}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Revisar
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Herramientas de administración */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-700 flex items-center">
                <UserCheck className="h-5 w-5 mr-2" />
                Gestión de Usuarios
              </CardTitle>
              <CardDescription>
                Administrar todos los usuarios del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2 mb-4">
                {estadisticasPorRol.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                      <span className="text-sm">{stat.rol}</span>
                    </div>
                    <span className="font-bold">{stat.cantidad}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/admin/usuarios">
                  Gestionar Usuarios
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-700 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Seguridad del Sistema
              </CardTitle>
              <CardDescription>
                Configuración de seguridad y permisos
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Autenticación 2FA</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">SSL Activo</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Backup Automático</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/configuracion">
                  Configurar Seguridad
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-purple-700 flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Base de Datos
              </CardTitle>
              <CardDescription>
                Monitoreo y administración de la base de datos
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Espacio Utilizado</span>
                    <span>{usoBD}%</span>
                  </div>
                  <Progress value={usoBD} className="h-2" />
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Backups Hoy</span>
                  <span className="font-bold text-green-600">{backupsHoy}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/configuracion">
                  Gestionar BD
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-amber-50">
              <CardTitle className="text-amber-700 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Reportes del Sistema
              </CardTitle>
              <CardDescription>
                Análisis y reportes de uso del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reportes Generados</span>
                  <span className="font-bold">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tiempo Promedio</span>
                  <span className="font-bold">2.3s</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/informes">
                  Ver Reportes
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-indigo-50">
              <CardTitle className="text-indigo-700 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Configuración General
              </CardTitle>
              <CardDescription>
                Configuración global del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Versión Sistema</span>
                  <span className="font-bold">v2.1.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Última Actualización</span>
                  <span className="font-bold">Ayer</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/configuracion">
                  Configurar Sistema
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-teal-50">
              <CardTitle className="text-teal-700 flex items-center">
                <HardDrive className="h-5 w-5 mr-2" />
                Mantenimiento
              </CardTitle>
              <CardDescription>
                Tareas de mantenimiento y optimización
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Último Backup</span>
                  <span className="font-bold text-green-600">Hace 2h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Optimización BD</span>
                  <span className="font-bold text-blue-600">Programada</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/configuracion">
                  Ver Mantenimiento
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Métricas detalladas del sistema */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wifi className="h-5 w-5 mr-2" />
                Estado del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Servidor Web</p>
                      <p className="text-sm text-green-600">Funcionando correctamente</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Online</Badge>
                </div>

                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Base de Datos</p>
                      <p className="text-sm text-green-600">Conectada y estable</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Online</Badge>
                </div>

                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-6 w-6 text-amber-600" />
                    <div>
                      <p className="font-medium text-amber-800">Sistema de Backups</p>
                      <p className="text-sm text-amber-600">Último backup hace 2 horas</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">Activo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Actividad del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Nuevo usuario registrado</p>
                    <p className="text-sm text-gray-600">Hace 15 minutos</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Backup automático completado</p>
                    <p className="text-sm text-gray-600">Hace 2 horas</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Sistema actualizado a v2.1.0</p>
                    <p className="text-sm text-gray-600">Ayer</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Mantenimiento programado</p>
                    <p className="text-sm text-gray-600">Hace 2 días</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
