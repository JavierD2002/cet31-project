
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, User, Book, CalendarDays, FileText } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getTeacherProfile } from '@/services/supabase';

type Asignatura = {
  id: number;
  nombre: string;
  cursos: string[];
};

type TeacherProfile = {
  id: number;
  usuario: {
    id?: number;
    dni: string;
    nombre: string;
    apellido: string;
    email: string;
  };
  especialidad: string;
  asignaturas?: Asignatura[];
};

const DocentePerfil = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      
      try {
        const data = await getTeacherProfile(parseInt(id));
        
        // En un entorno real, aquí deberíamos cargar también las asignaturas asignadas
        // Para la demo, usaremos datos de ejemplo
        const mockAsignaturas = [
          { id: 1, nombre: "Matemática", cursos: ["1° Año A", "2° Año A"] },
          { id: 2, nombre: "Física", cursos: ["3° Año A"] },
        ];
        
        setProfile({
          ...data,
          asignaturas: mockAsignaturas
        });
      } catch (error) {
        console.error("Error al cargar perfil de docente:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar el perfil del docente",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <p>Cargando perfil del docente...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <p>No se encontró el docente</p>
          </div>
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
            Volver a Docentes
          </Link>
        </div>
      </nav>

      <main className="container mx-auto py-8 px-4">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>{profile.usuario.apellido}, {profile.usuario.nombre}</CardTitle>
                <CardDescription>DNI: {profile.usuario.dni} | Especialidad: {profile.especialidad}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-medium">Email:</p>
                <p className="text-gray-600">{profile.usuario.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="asignaturas" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="asignaturas" className="flex items-center">
              <Book className="h-4 w-4 mr-2" />
              Asignaturas
            </TabsTrigger>
            <TabsTrigger value="asistencia" className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-2" />
              Registro de Asistencia
            </TabsTrigger>
            <TabsTrigger value="informes" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Informes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="asignaturas">
            <Card>
              <CardHeader>
                <CardTitle>Asignaturas Asignadas</CardTitle>
                <CardDescription>Ciclo lectivo 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.asignaturas?.map((asignatura) => (
                    <div key={asignatura.id} className="border rounded-md p-4">
                      <h3 className="text-lg font-medium mb-2">{asignatura.nombre}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {asignatura.cursos.map((curso, index) => (
                          <div key={index} className="bg-blue-50 py-1 px-3 rounded-md flex justify-between items-center">
                            <span>{curso}</span>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/asistencia?subject=${asignatura.id}&curso=${curso}`}>
                                  <CalendarDays className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/calificaciones?subject=${asignatura.id}&curso=${curso}`}>
                                  <Book className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="asistencia">
            <Card>
              <CardHeader>
                <CardTitle>Registro de Asistencia</CardTitle>
                <CardDescription>Últimos registros de asistencia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-500">Fecha</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-500">Asignatura</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-500">Curso</th>
                        <th className="px-4 py-2 text-right font-medium text-gray-500">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3">29/04/2025</td>
                        <td className="px-4 py-3">Matemática</td>
                        <td className="px-4 py-3">1° Año A</td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to="/asistencia/detalle/1">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">28/04/2025</td>
                        <td className="px-4 py-3">Física</td>
                        <td className="px-4 py-3">3° Año A</td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to="/asistencia/detalle/2">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">27/04/2025</td>
                        <td className="px-4 py-3">Matemática</td>
                        <td className="px-4 py-3">2° Año A</td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to="/asistencia/detalle/3">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button asChild>
                    <Link to="/asistencia/historial">
                      Ver todos los registros
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="informes">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Informes Pedagógicos</CardTitle>
                    <CardDescription>Informes creados por este docente</CardDescription>
                  </div>
                  <Button asChild>
                    <Link to="/informes/nuevo">
                      <FileText className="h-4 w-4 mr-2" />
                      Nuevo Informe
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-500">Alumno</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-500">Fecha</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-500">Tipo</th>
                        <th className="px-4 py-2 text-right font-medium text-gray-500">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3">Acosta, María</td>
                        <td className="px-4 py-3">15/03/2025</td>
                        <td className="px-4 py-3">Desempeño académico</td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Córdoba, Lucía</td>
                        <td className="px-4 py-3">22/03/2025</td>
                        <td className="px-4 py-3">Desempeño académico</td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" asChild>
                    <Link to="/informes">
                      Ver todos los informes
                    </Link>
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

export default DocentePerfil;
