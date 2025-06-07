
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
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  FileText, 
  Calendar, 
  User, 
  Book, 
  Users,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  BookOpen
} from 'lucide-react';
import { getAttendanceHistory, getTopics } from '@/services/supabase';

const DocenteDashboard = () => {
  const { user } = useAuth();

  // Cargar datos del docente
  const { data: attendanceData } = useQuery({
    queryKey: ['teacherAttendance', user?.id],
    queryFn: () => getAttendanceHistory(),
    enabled: !!user?.id
  });

  const { data: topics } = useQuery({
    queryKey: ['teacherTopics', user?.id],
    queryFn: () => getTopics(),
    enabled: !!user?.id
  });

  // Estadísticas simuladas para demo
  const cursosAsignados = 3;
  const estudiantesTotales = 87;
  const clasesImpartidas = topics?.length || 0;
  const clasesPlaneadas = topics?.filter(t => t.estado === 'planificado').length || 0;
  const informesPendientes = 2;

  // Calcular estadísticas de asistencia promedio
  const promedioAsistencia = 92; // Simulado

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Panel de Docente - {user?.nombre}</h1>
          <p className="text-gray-600">Gestiona tus cursos, estudiantes y actividades académicas</p>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cursos Asignados</p>
                  <p className="text-3xl font-bold text-blue-600">{cursosAsignados}</p>
                </div>
                <BookOpen className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Estudiantes Totales</p>
                  <p className="text-3xl font-bold text-green-600">{estudiantesTotales}</p>
                </div>
                <Users className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Clases Impartidas</p>
                  <p className="text-3xl font-bold text-purple-600">{clasesImpartidas}</p>
                </div>
                <Book className="h-10 w-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Informes Pendientes</p>
                  <p className="text-3xl font-bold text-amber-600">{informesPendientes}</p>
                </div>
                <FileText className="h-10 w-10 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertas y recordatorios */}
        {informesPendientes > 0 && (
          <div className="mb-8">
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-800 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Recordatorios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-amber-700">
                    • Tienes {informesPendientes} informes pedagógicos pendientes de entrega
                  </p>
                  {clasesPlaneadas > 0 && (
                    <p className="text-amber-700">
                      • {clasesPlaneadas} clases planificadas pendientes de dictar
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-700 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Control de Asistencia
              </CardTitle>
              <CardDescription>
                Registra la asistencia diaria de tus estudiantes
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">Promedio de Asistencia</span>
                <span className="font-bold text-green-600">{promedioAsistencia}%</span>
              </div>
              <Progress value={promedioAsistencia} className="h-2 mb-4" />
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/asistencia">
                  Gestionar Asistencia
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-700 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Calificaciones
              </CardTitle>
              <CardDescription>
                Carga y gestiona las calificaciones de tus estudiantes
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-600 mb-4">
                Registra notas por trimestre y genera reportes de rendimiento
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/calificaciones">
                  Gestionar Calificaciones
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-purple-700 flex items-center">
                <Book className="h-5 w-5 mr-2" />
                Libro de Tema
              </CardTitle>
              <CardDescription>
                Planifica y registra el contenido de tus clases
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600">Clases Registradas</span>
                <span className="font-bold text-purple-600">{clasesImpartidas}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/libro-de-tema">
                  Gestionar Libro de Tema
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-indigo-50">
              <CardTitle className="text-indigo-700 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Informes Pedagógicos
              </CardTitle>
              <CardDescription>
                Crea y gestiona informes de seguimiento pedagógico
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600">Pendientes</span>
                <span className="font-bold text-indigo-600">{informesPendientes}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/informes">
                  Gestionar Informes
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-teal-50">
              <CardTitle className="text-teal-700 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Mi Perfil
              </CardTitle>
              <CardDescription>
                Consulta y actualiza tu información profesional
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-600 mb-4">
                Información personal y asignaturas a cargo
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to={`/docentes/${user?.id}/perfil`}>
                  Ver Mi Perfil
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-orange-50">
              <CardTitle className="text-orange-700 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Reportes y Estadísticas
              </CardTitle>
              <CardDescription>
                Analiza el rendimiento de tus cursos
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-600 mb-4">
                Genera reportes de asistencia y rendimiento académico
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/asistencia/historial">
                  Ver Reportes
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Resumen de actividades recientes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Actividades Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Asistencia registrada - 3° A</p>
                    <p className="text-sm text-gray-600">Hace 2 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Calificaciones cargadas - Matemática</p>
                    <p className="text-sm text-gray-600">Ayer</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Clase registrada - Álgebra</p>
                    <p className="text-sm text-gray-600">Hace 2 días</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Mis Cursos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">3° A - Matemática</p>
                    <p className="text-sm text-gray-600">29 estudiantes</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">94% asistencia</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">2° B - Álgebra</p>
                    <p className="text-sm text-gray-600">31 estudiantes</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">89% asistencia</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">1° C - Matemática Básica</p>
                    <p className="text-sm text-gray-600">27 estudiantes</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">91% asistencia</p>
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

export default DocenteDashboard;
