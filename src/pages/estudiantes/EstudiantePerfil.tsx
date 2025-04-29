
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, User, Book, Calendar } from 'lucide-react';
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
import { useToast } from "@/components/ui/use-toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getStudentProfile } from '@/services/supabase';

type CalificacionesPorMateria = {
  asignatura: string;
  trimestre1: number | null;
  trimestre2: number | null;
  trimestre3: number | null;
};

type EstadisticaAsistencia = {
  presente: number;
  ausente: number;
  tardanza: number;
  retirado: number;
};

type StudentProfile = {
  id: number;
  usuario: {
    id?: number;
    dni: string;
    nombre: string;
    apellido: string;
    email: string;
  };
  curso: string;
  calificaciones?: CalificacionesPorMateria[];
  asistencia?: EstadisticaAsistencia;
};

const EstudiantePerfil = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      
      try {
        const data = await getStudentProfile(parseInt(id));
        
        // En un entorno real, aquí deberíamos cargar también las calificaciones y la asistencia
        // Para la demo, usaremos datos de ejemplo
        const mockCalificaciones = [
          { asignatura: "Matemática", trimestre1: 8, trimestre2: 9, trimestre3: null },
          { asignatura: "Lengua", trimestre1: 7, trimestre2: 8, trimestre3: null },
          { asignatura: "Historia", trimestre1: 9, trimestre2: 9, trimestre3: null },
          { asignatura: "Geografía", trimestre1: 8, trimestre2: 7, trimestre3: null },
          { asignatura: "Física", trimestre1: 7, trimestre2: 8, trimestre3: null },
        ];
        
        const mockAsistencia = {
          presente: 45,
          ausente: 3,
          tardanza: 2,
          retirado: 0
        };
        
        setProfile({
          ...data,
          calificaciones: mockCalificaciones,
          asistencia: mockAsistencia
        });
      } catch (error) {
        console.error("Error al cargar perfil de estudiante:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar el perfil del estudiante",
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
            <p>Cargando perfil del estudiante...</p>
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
            <p>No se encontró el estudiante</p>
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
          <Link to="/estudiantes" className="text-blue-600 hover:underline flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver a Estudiantes
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
                <CardDescription>DNI: {profile.usuario.dni} | Curso: {profile.curso}</CardDescription>
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

        <Tabs defaultValue="calificaciones" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="calificaciones" className="flex items-center">
              <Book className="h-4 w-4 mr-2" />
              Calificaciones
            </TabsTrigger>
            <TabsTrigger value="asistencia" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Asistencia
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calificaciones">
            <Card>
              <CardHeader>
                <CardTitle>Calificaciones</CardTitle>
                <CardDescription>Ciclo lectivo 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-500">Asignatura</th>
                        <th className="px-4 py-2 text-center font-medium text-gray-500">1° Trimestre</th>
                        <th className="px-4 py-2 text-center font-medium text-gray-500">2° Trimestre</th>
                        <th className="px-4 py-2 text-center font-medium text-gray-500">3° Trimestre</th>
                        <th className="px-4 py-2 text-center font-medium text-gray-500">Promedio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {profile.calificaciones?.map((calificacion, index) => {
                        const notas = [calificacion.trimestre1, calificacion.trimestre2, calificacion.trimestre3].filter(nota => nota !== null) as number[];
                        const promedio = notas.length > 0 ? (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1) : "-";
                        
                        return (
                          <tr key={index}>
                            <td className="px-4 py-3 font-medium">{calificacion.asignatura}</td>
                            <td className="px-4 py-3 text-center">{calificacion.trimestre1 ?? "-"}</td>
                            <td className="px-4 py-3 text-center">{calificacion.trimestre2 ?? "-"}</td>
                            <td className="px-4 py-3 text-center">{calificacion.trimestre3 ?? "-"}</td>
                            <td className="px-4 py-3 text-center font-medium">{promedio}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="asistencia">
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Asistencia</CardTitle>
                <CardDescription>Ciclo lectivo 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-md border border-green-200">
                    <p className="text-sm font-medium text-green-700">Presente</p>
                    <p className="text-3xl font-bold text-green-600">{profile.asistencia?.presente}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-md border border-red-200">
                    <p className="text-sm font-medium text-red-700">Ausente</p>
                    <p className="text-3xl font-bold text-red-600">{profile.asistencia?.ausente}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                    <p className="text-sm font-medium text-yellow-700">Tardanza</p>
                    <p className="text-3xl font-bold text-yellow-600">{profile.asistencia?.tardanza}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                    <p className="text-sm font-medium text-blue-700">Retirado</p>
                    <p className="text-3xl font-bold text-blue-600">{profile.asistencia?.retirado}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md border">
                  <p className="font-medium mb-2">Total de días: {profile.asistencia ? Object.values(profile.asistencia).reduce((a, b) => a + b, 0) : 0}</p>
                  <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div className="flex h-full">
                      <div 
                        className="bg-green-500 h-full" 
                        style={{ width: `${profile.asistencia ? (profile.asistencia.presente / Object.values(profile.asistencia).reduce((a, b) => a + b, 0)) * 100 : 0}%` }}
                      ></div>
                      <div 
                        className="bg-red-500 h-full" 
                        style={{ width: `${profile.asistencia ? (profile.asistencia.ausente / Object.values(profile.asistencia).reduce((a, b) => a + b, 0)) * 100 : 0}%` }}
                      ></div>
                      <div 
                        className="bg-yellow-500 h-full" 
                        style={{ width: `${profile.asistencia ? (profile.asistencia.tardanza / Object.values(profile.asistencia).reduce((a, b) => a + b, 0)) * 100 : 0}%` }}
                      ></div>
                      <div 
                        className="bg-blue-500 h-full" 
                        style={{ width: `${profile.asistencia ? (profile.asistencia.retirado / Object.values(profile.asistencia).reduce((a, b) => a + b, 0)) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Presente: {profile.asistencia ? Math.round((profile.asistencia.presente / Object.values(profile.asistencia).reduce((a, b) => a + b, 0)) * 100) : 0}%</span>
                    <span>Ausente: {profile.asistencia ? Math.round((profile.asistencia.ausente / Object.values(profile.asistencia).reduce((a, b) => a + b, 0)) * 100) : 0}%</span>
                    <span>Tardanza: {profile.asistencia ? Math.round((profile.asistencia.tardanza / Object.values(profile.asistencia).reduce((a, b) => a + b, 0)) * 100) : 0}%</span>
                    <span>Retirado: {profile.asistencia ? Math.round((profile.asistencia.retirado / Object.values(profile.asistencia).reduce((a, b) => a + b, 0)) * 100) : 0}%</span>
                  </div>
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

export default EstudiantePerfil;
