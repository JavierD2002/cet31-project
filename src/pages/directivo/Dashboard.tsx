
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
  GraduationCap, 
  BookOpen, 
  Calendar, 
  TrendingUp,
  AlertTriangle,
  FileText,
  BarChart3,
  Target,
  Clock
} from 'lucide-react';
import { getStudents, getTeachers, getAttendanceHistory } from '@/services/supabase';

const DirectivoDashboard = () => {
  const { user } = useAuth();

  // Cargar datos generales
  const { data: students } = useQuery({
    queryKey: ['allStudents'],
    queryFn: getStudents
  });

  const { data: teachers } = useQuery({
    queryKey: ['allTeachers'],
    queryFn: getTeachers
  });

  const { data: attendanceData } = useQuery({
    queryKey: ['generalAttendance'],
    queryFn: getAttendanceHistory
  });

  // Estadísticas calculadas
  const totalEstudiantes = students?.length || 0;
  const totalDocentes = teachers?.length || 0;
  const promedioAsistenciaGeneral = 87.5; // Simulado
  const estudiantesConBajaAsistencia = Math.floor(totalEstudiantes * 0.12); // 12% simulado
  const alertasAcademicas = 15; // Simulado
  const informesPendientes = 8; // Simulado

  const alertasCriticas = [
    { tipo: 'Asistencia', descripcion: `${estudiantesConBajaAsistencia} estudiantes con asistencia menor al 75%`, prioridad: 'alta' },
    { tipo: 'Académico', descripcion: `${alertasAcademicas} estudiantes con bajo rendimiento`, prioridad: 'media' },
    { tipo: 'Administrativo', descripcion: `${informesPendientes} informes pedagógicos pendientes`, prioridad: 'baja' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Panel Directivo - {user?.nombre}</h1>
          <p className="text-gray-600">Supervisión y gestión integral de la institución educativa</p>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Estudiantes</p>
                  <p className="text-3xl font-bold text-blue-600">{totalEstudiantes}</p>
                </div>
                <GraduationCap className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Docentes</p>
                  <p className="text-3xl font-bold text-green-600">{totalDocentes}</p>
                </div>
                <Users className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Asistencia General</p>
                  <p className="text-3xl font-bold text-purple-600">{promedioAsistenciaGeneral}%</p>
                </div>
                <Calendar className="h-10 w-10 text-purple-600" />
              </div>
              <div className="mt-4">
                <Progress value={promedioAsistenciaGeneral} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Alertas Activas</p>
                  <p className="text-3xl font-bold text-red-600">{alertasCriticas.length}</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertas críticas */}
        <div className="mb-8">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Alertas que Requieren Atención
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alertasCriticas.map((alerta, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant={alerta.prioridad === 'alta' ? 'destructive' : alerta.prioridad === 'media' ? 'default' : 'secondary'}>
                        {alerta.tipo}
                      </Badge>
                      <span className="text-sm">{alerta.descripcion}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Herramientas de gestión */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-700 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Gestión de Personal
              </CardTitle>
              <CardDescription>
                Administrar docentes y personal de la institución
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Docentes Activos</span>
                  <span className="font-bold">{totalDocentes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Carga Horaria Promedio</span>
                  <span className="font-bold">32h</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/docentes">
                  Gestionar Docentes
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-700 flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Seguimiento Estudiantil
              </CardTitle>
              <CardDescription>
                Monitorear rendimiento y asistencia estudiantil
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Estudiantes Matriculados</span>
                  <span className="font-bold">{totalEstudiantes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Promedio General</span>
                  <span className="font-bold">7.8</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/estudiantes">
                  Gestionar Estudiantes
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-purple-700 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Currículo Académico
              </CardTitle>
              <CardDescription>
                Gestionar asignaturas y planificación curricular
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Asignaturas Activas</span>
                  <span className="font-bold">18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Horas Semanales</span>
                  <span className="font-bold">240h</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/asignaturas">
                  Gestionar Asignaturas
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-amber-50">
              <CardTitle className="text-amber-700 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Reportes Institucionales
              </CardTitle>
              <CardDescription>
                Generar y revisar informes institucionales
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Informes Generados</span>
                  <span className="font-bold">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pendientes</span>
                  <span className="font-bold text-amber-600">{informesPendientes}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/informes">
                  Ver Informes
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-indigo-50">
              <CardTitle className="text-indigo-700 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Control de Asistencia
              </CardTitle>
              <CardDescription>
                Supervisar asistencia general de la institución
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Asistencia Promedio</span>
                  <span className="font-bold text-green-600">{promedioAsistenciaGeneral}%</span>
                </div>
                <Progress value={promedioAsistenciaGeneral} className="h-2" />
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/asistencia/historial">
                  Ver Asistencia
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-teal-50">
              <CardTitle className="text-teal-700 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Metas Institucionales
              </CardTitle>
              <CardDescription>
                Seguimiento de objetivos y metas estratégicas
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Retención Estudiantil</span>
                    <span>95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Satisfacción Docente</span>
                    <span>88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/">
                  Ver Métricas
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Estadísticas detalladas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Tendencias Académicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-800">Rendimiento Académico</p>
                    <p className="text-sm text-green-600">Promedio general: 7.8/10</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-800">Asistencia</p>
                    <p className="text-sm text-blue-600">Promedio: {promedioAsistenciaGeneral}%</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium text-purple-800">Finalización de Cursos</p>
                    <p className="text-sm text-purple-600">Tasa: 94%</p>
                  </div>
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Actividades Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Informe mensual generado</p>
                    <p className="text-sm text-gray-600">Hace 1 hora</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Reunión de docentes programada</p>
                    <p className="text-sm text-gray-600">Hace 3 horas</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Nuevo docente registrado</p>
                    <p className="text-sm text-gray-600">Ayer</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Alerta de asistencia procesada</p>
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

export default DirectivoDashboard;
