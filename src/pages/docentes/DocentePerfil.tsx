
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Mail, Phone, BookOpen, GraduationCap, School, Calendar, File, Edit, FileText } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getTeacherProfile } from '@/services/supabase/teachers';

interface TeacherAsignatura {
  id: number;
  nombre: string;
  curso: string;
}

interface TeacherCourseStudents {
  curso: string;
  estudiantes: { id: number; nombre: string }[];
}

const DocentePerfil = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [teacherData, setTeacherData] = useState<any>(null);
  const { toast } = useToast();
  
  const [asignaturas, setAsignaturas] = useState<TeacherAsignatura[]>([
    { id: 1, nombre: "Matemática I", curso: "1° Año A" },
    { id: 2, nombre: "Matemática II", curso: "2° Año B" },
    { id: 3, nombre: "Matemática III", curso: "3° Año A" }
  ]);
  
  const [cursos, setCursos] = useState<string[]>(["1° Año A", "2° Año B", "3° Año A"]);
  
  const [courseStudents, setCourseStudents] = useState<TeacherCourseStudents[]>([
    {
      curso: "1° Año A",
      estudiantes: [
        { id: 1, nombre: "García, Ana" },
        { id: 2, nombre: "Martínez, Juan" },
        { id: 3, nombre: "Rodríguez, Lucía" }
      ]
    },
    {
      curso: "2° Año B",
      estudiantes: [
        { id: 4, nombre: "López, Pedro" },
        { id: 5, nombre: "Fernández, Sofía" }
      ]
    },
    {
      curso: "3° Año A",
      estudiantes: [
        { id: 6, nombre: "González, Mateo" },
        { id: 7, nombre: "Pérez, Valentina" }
      ]
    }
  ]);
  
  const [informes, setInformes] = useState([
    { id: 1, titulo: "Evaluación del primer trimestre", fecha: "15/04/2025", tipo: "Desempeño académico", curso: "1° Año A", estudiante: "García, Ana" },
    { id: 2, titulo: "Evaluación del primer trimestre", fecha: "15/04/2025", tipo: "Desempeño académico", curso: "1° Año A", estudiante: "Martínez, Juan" },
    { id: 3, titulo: "Informe de rendimiento", fecha: "20/04/2025", tipo: "Comportamiento", curso: "2° Año B", estudiante: "López, Pedro" }
  ]);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        if (!id) return;
        
        const data = await getTeacherProfile(Number(id));
        setTeacherData(data);
      } catch (error) {
        console.error("Error al cargar los datos del docente:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del docente",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [id, toast]);

  // Iniciales para el avatar
  const getInitials = () => {
    if (!teacherData) return "??";
    return `${teacherData.usuario.nombre.charAt(0)}${teacherData.usuario.apellido.charAt(0)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto py-12 px-4">
          <div className="flex justify-center items-center mb-8">
            <Skeleton className="h-12 w-40" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-12 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <Skeleton className="h-48 w-full mb-4 rounded-xl" />
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-8 w-full mb-2" />
                  <Skeleton className="h-8 w-full" />
                </div>
                <div className="md:w-2/3">
                  <Skeleton className="h-10 w-full mb-4" />
                  <Skeleton className="h-32 w-full mb-4" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (!teacherData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Docente no encontrado</h1>
          <p className="mb-6">No se encontró información del docente solicitado.</p>
          <Link to="/docentes">
            <Button>Volver al Listado</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto">
          <Link to="/docentes" className="text-blue-600 hover:underline flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver al listado de docentes
          </Link>
        </div>
      </nav>

      <div className="container mx-auto py-8 px-4">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-2xl">Perfil del Docente</CardTitle>
                <CardDescription>Información completa del docente</CardDescription>
              </div>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Información básica del docente */}
              <div className="md:w-1/3">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarFallback className="text-3xl bg-blue-600 text-white">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">
                    {teacherData.usuario.nombre} {teacherData.usuario.apellido}
                  </h2>
                  <Badge className="mt-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                    Docente
                  </Badge>
                </div>
                
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">DNI</p>
                    <p className="font-medium">{teacherData.usuario.dni}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <p className="font-medium">{teacherData.usuario.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Especialidad</p>
                    <div className="flex items-center">
                      <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                      <p className="font-medium">{teacherData.especialidad}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Cursos a cargo</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {cursos.map((curso, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-100">
                          {curso}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Pestañas con información detallada */}
              <div className="md:w-2/3">
                <Tabs defaultValue="asignaturas">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="asignaturas">Asignaturas</TabsTrigger>
                    <TabsTrigger value="estudiantes">Estudiantes</TabsTrigger>
                    <TabsTrigger value="informes">Informes</TabsTrigger>
                  </TabsList>
                  
                  {/* Pestaña de Asignaturas */}
                  <TabsContent value="asignaturas">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                          Asignaturas a cargo
                        </CardTitle>
                        <CardDescription>
                          Asignaturas que imparte el docente en diferentes cursos
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {asignaturas.map((asignatura) => (
                            <div key={asignatura.id} className="border rounded-md p-4 flex justify-between hover:bg-gray-50">
                              <div>
                                <p className="font-medium">{asignatura.nombre}</p>
                                <p className="text-sm text-gray-500">{asignatura.curso}</p>
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Asistencia
                                </Button>
                                <Button variant="outline" size="sm">
                                  <File className="h-4 w-4 mr-1" />
                                  Calificaciones
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Pestaña de Estudiantes */}
                  <TabsContent value="estudiantes">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <School className="h-5 w-5 mr-2 text-blue-600" />
                          Estudiantes por curso
                        </CardTitle>
                        <CardDescription>
                          Listado de estudiantes por cada curso a cargo del docente
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {courseStudents.map((item, index) => (
                            <div key={index}>
                              <h3 className="font-medium mb-2 bg-gray-100 px-3 py-1 rounded">
                                {item.curso}
                              </h3>
                              <div className="space-y-2">
                                {item.estudiantes.map((estudiante) => (
                                  <div key={estudiante.id} className="border rounded-md p-3 flex justify-between hover:bg-gray-50">
                                    <span>{estudiante.nombre}</span>
                                    <Link to={`/estudiantes/${estudiante.id}/perfil`}>
                                      <Button variant="ghost" size="sm">
                                        Ver perfil
                                      </Button>
                                    </Link>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Pestaña de Informes */}
                  <TabsContent value="informes">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-lg flex items-center">
                              <FileText className="h-5 w-5 mr-2 text-blue-600" />
                              Informes pedagógicos
                            </CardTitle>
                            <CardDescription>
                              Informes realizados por el docente
                            </CardDescription>
                          </div>
                          <Button size="sm">Nuevo informe</Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {informes.map((informe) => (
                            <div key={informe.id} className="border rounded-md p-3 hover:bg-gray-50">
                              <div className="flex justify-between">
                                <div>
                                  <p className="font-medium">{informe.titulo}</p>
                                  <p className="text-sm text-gray-500">
                                    {informe.estudiante} - {informe.curso}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <Badge variant="outline" className="mb-1">
                                    {informe.tipo}
                                  </Badge>
                                  <p className="text-xs text-gray-500">{informe.fecha}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default DocentePerfil;
