
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
  BookOpen, 
  Award, 
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { getStudentAttendanceStats, getStudentGrades } from '@/services/supabase';

const EstudianteDashboard = () => {
  const { user } = useAuth();

  // Cargar estadísticas de asistencia
  const { data: attendanceStats } = useQuery({
    queryKey: ['studentAttendance', user?.id],
    queryFn: () => getStudentAttendanceStats(user?.id || 0),
    enabled: !!user?.id
  });

  // Cargar calificaciones recientes
  const { data: grades } = useQuery({
    queryKey: ['studentGrades', user?.id],
    queryFn: () => getStudentGrades(user?.id || 0),
    enabled: !!user?.id
  });

  // Calcular estadísticas
  const totalClases = attendanceStats ? 
    attendanceStats.presente + attendanceStats.ausente + attendanceStats.tardanza + attendanceStats.retirado : 
    0;

  const porcentajeAsistencia = totalClases > 0 ? 
    ((attendanceStats?.presente || 0) / totalClases * 100) : 
    0;

  const promedioGeneral = grades && grades.length > 0 ? 
    grades.reduce((sum, grade) => sum + (grade.nota || 0), 0) / grades.length : 
    0;

  // Materias con alertas (calificación baja o baja asistencia)
  const materiasConAlerta = grades?.filter(grade => (grade.nota || 0) < 6).length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">¡Hola, {user?.nombre}!</h1>
          <p className="text-gray-600">Aquí tienes un resumen de tu progreso académico</p>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Promedio General</p>
                  <p className="text-3xl font-bold text-blue-600">{promedioGeneral.toFixed(1)}</p>
                </div>
                <Award className="h-10 w-10 text-blue-600" />
              </div>
              <div className="mt-4">
                <Progress value={(promedioGeneral / 10) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Asistencia</p>
                  <p className="text-3xl font-bold text-green-600">{porcentajeAsistencia.toFixed(0)}%</p>
                </div>
                <Calendar className="h-10 w-10 text-green-600" />
              </div>
              <div className="mt-4">
                <Progress value={porcentajeAsistencia} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Materias Cursando</p>
                  <p className="text-3xl font-bold text-purple-600">{grades?.length || 0}</p>
                </div>
                <BookOpen className="h-10 w-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Alertas Académicas</p>
                  <p className="text-3xl font-bold text-red-600">{materiasConAlerta}</p>
                </div>
                <AlertCircle className="h-10 w-10 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertas importantes */}
        {(porcentajeAsistencia < 75 || materiasConAlerta > 0) && (
          <div className="mb-8">
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-800 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Atención Requerida
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {porcentajeAsistencia < 75 && (
                    <p className="text-amber-700">
                      • Tu asistencia está por debajo del 75% requerido
                    </p>
                  )}
                  {materiasConAlerta > 0 && (
                    <p className="text-amber-700">
                      • Tienes {materiasConAlerta} materia(s) con calificaciones que necesitan mejora
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Accesos rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-700 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Mi Perfil Académico
              </CardTitle>
              <CardDescription>
                Información personal y académica completa
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-600 mb-4">
                Consulta y actualiza tu información personal y académica
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to={`/estudiantes/${user?.id}/perfil`}>
                  Ver Mi Perfil
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-700 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Mis Calificaciones
              </CardTitle>
              <CardDescription>
                Historial completo de calificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-600 mb-4">
                Revisa tus notas por trimestre y materia
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to={`/estudiantes/${user?.id}/calificaciones`}>
                  Ver Calificaciones
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-amber-50">
              <CardTitle className="text-amber-700 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Mi Asistencia
              </CardTitle>
              <CardDescription>
                Registro detallado de asistencia
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-600 mb-4">
                Consulta tu historial de asistencia y faltas
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to={`/estudiantes/${user?.id}/asistencia`}>
                  Ver Asistencia
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Progreso por materia */}
        {grades && grades.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Progreso por Materia
              </CardTitle>
              <CardDescription>
                Rendimiento actual en cada asignatura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {grades.slice(0, 5).map((grade, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{grade.asignatura}</span>
                        <span className={`font-bold ${
                          (grade.nota || 0) >= 7 ? 'text-green-600' : 
                          (grade.nota || 0) >= 6 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {grade.nota || 'Sin calificar'}
                        </span>
                      </div>
                      <Progress value={((grade.nota || 0) / 10) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default EstudianteDashboard;
