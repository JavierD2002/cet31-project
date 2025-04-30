
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  BookOpen, 
  FileText,
  Calendar
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getTeacherProfile } from '@/services/supabase';

// Tipo para el perfil de docente extendido
type TeacherProfile = {
  id: number;
  usuario: {
    id: number;
    dni: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
  };
  especialidad: string;
  cursos: string[];
  asignaturas: {
    id: number;
    nombre: string;
    curso: string;
  }[];
  informes?: {
    id: number;
    titulo: string;
    fecha: string;
    tipo: string;
  }[];
};

const DocentePerfil = () => {
  const { id } = useParams<{ id: string }>();
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        // Cargamos los datos base del docente
        const profileData = await getTeacherProfile(Number(id));
        
        // Extendemos con datos ficticios para esta demostración
        // En un sistema real, estos datos vendrían de diferentes endpoints
        const extendedData: TeacherProfile = {
          ...profileData,
          cursos: ["1° Año A", "2° Año B", "3° Año A"],
          asignaturas: [
            { id: 1, nombre: "Matemática I", curso: "1° Año A" },
            { id: 2, nombre: "Matemática II", curso: "2° Año B" },
            { id: 3, nombre: "Matemática III", curso: "3° Año A" }
          ],
          informes: [
            { id: 1, titulo: "Informe trimestral 1° Año A", fecha: "2025-04-10", tipo: "Trimestral" },
            { id: 2, titulo: "Seguimiento adaptaciones curriculares", fecha: "2025-03-15", tipo: "Especial" }
          ]
        };
        
        setTeacher(extendedData);
      } catch (error) {
        console.error("Error al cargar el perfil del docente:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar la información del docente",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTeacherData();
    }
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
            <span className="ml-3 text-lg font-medium">Cargando perfil...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="flex flex-col items-center justify-center py-12">
                <User className="h-16 w-16 text-gray-300" />
                <h2 className="mt-4 text-2xl font-bold">Docente no encontrado</h2>
                <p className="mt-2 text-gray-500">El perfil que buscas no existe o ha sido eliminado.</p>
                <Button asChild className="mt-6">
                  <Link to="/docentes">Volver a la lista de docentes</Link>
                </Button>
              </div>
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
      
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto">
          <Link to="/docentes" className="text-blue-600 hover:underline flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver a la lista de docentes
          </Link>
        </div>
      </nav>
      
      <main className="container mx-auto py-8 px-4">
        {/* Perfil superior */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                  {teacher.usuario.nombre[0]}{teacher.usuario.apellido[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold">{teacher.usuario.apellido}, {teacher.usuario.nombre}</h2>
                <p className="text-gray-500">Docente - {teacher.especialidad}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-blue-600 mr-2" />
                    <span>DNI: {teacher.usuario.dni}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-blue-600 mr-2" />
                    <span>{teacher.usuario.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-blue-600 mr-2" />
                    <span>{teacher.usuario.telefono || 'No registrado'}</span>
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 text-blue-600 mr-2" />
                    <span>{teacher.especialidad}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button variant="outline">Editar perfil</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs de información */}
        <Tabs defaultValue="asignaturas">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="asignaturas" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Asignaturas</span>
            </TabsTrigger>
            <TabsTrigger value="informes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Informes</span>
            </TabsTrigger>
            <TabsTrigger value="horarios" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Horarios</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Contenido: Asignaturas */}
          <TabsContent value="asignaturas">
            <Card>
              <CardHeader>
                <CardTitle>Asignaturas a cargo</CardTitle>
                <CardDescription>Materias dictadas por el docente en el ciclo lectivo actual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teacher.asignaturas.map((asignatura) => (
                    <Card key={asignatura.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{asignatura.nombre}</h3>
                            <p className="text-sm text-gray-500">{asignatura.curso}</p>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/asignaturas/${asignatura.id}`}>
                              Ver detalles
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Contenido: Informes */}
          <TabsContent value="informes">
            <Card>
              <CardHeader>
                <CardTitle>Informes pedagógicos</CardTitle>
                <CardDescription>Informes elaborados por el docente</CardDescription>
              </CardHeader>
              <CardContent>
                {teacher.informes && teacher.informes.length > 0 ? (
                  <div className="space-y-4">
                    {teacher.informes.map((informe) => (
                      <div key={informe.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{informe.titulo}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(informe.fecha).toLocaleDateString('es-AR')} - {informe.tipo}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">Ver informe</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-4 text-lg font-medium">No hay informes registrados</h3>
                    <p className="mt-2">El docente no ha registrado informes pedagógicos aún.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Contenido: Horarios */}
          <TabsContent value="horarios">
            <Card>
              <CardHeader>
                <CardTitle>Horarios de clase</CardTitle>
                <CardDescription>Horarios asignados al docente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border p-2 text-left">Hora</th>
                        <th className="border p-2 text-center">Lunes</th>
                        <th className="border p-2 text-center">Martes</th>
                        <th className="border p-2 text-center">Miércoles</th>
                        <th className="border p-2 text-center">Jueves</th>
                        <th className="border p-2 text-center">Viernes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-2 font-medium">7:30 - 8:10</td>
                        <td className="border p-2">Matemática I<br /><span className="text-xs text-gray-500">1° Año A</span></td>
                        <td className="border p-2">-</td>
                        <td className="border p-2">Matemática II<br /><span className="text-xs text-gray-500">2° Año B</span></td>
                        <td className="border p-2">-</td>
                        <td className="border p-2">Matemática III<br /><span className="text-xs text-gray-500">3° Año A</span></td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-medium">8:10 - 8:50</td>
                        <td className="border p-2">Matemática I<br /><span className="text-xs text-gray-500">1° Año A</span></td>
                        <td className="border p-2">-</td>
                        <td className="border p-2">Matemática II<br /><span className="text-xs text-gray-500">2° Año B</span></td>
                        <td className="border p-2">-</td>
                        <td className="border p-2">Matemática III<br /><span className="text-xs text-gray-500">3° Año A</span></td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-medium">8:50 - 9:30</td>
                        <td className="border p-2">-</td>
                        <td className="border p-2">Matemática III<br /><span className="text-xs text-gray-500">3° Año A</span></td>
                        <td className="border p-2">-</td>
                        <td className="border p-2">Matemática I<br /><span className="text-xs text-gray-500">1° Año A</span></td>
                        <td className="border p-2">-</td>
                      </tr>
                    </tbody>
                  </table>
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

export default DocentePerfil;
