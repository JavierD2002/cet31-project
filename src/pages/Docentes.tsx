
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Search, Eye, User, FileText, Book } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getTeachers } from '@/services/supabase';
import { useAuth } from '@/context/AuthContext';

type Teacher = {
  id: number;
  usuario_id: number;
  dni: string;
  nombre: string;
  especialidad: string;
};

const Docentes = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const { hasRole } = useAuth();
  const canCreateTeacher = hasRole(['administrador', 'directivo']);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await getTeachers();
        setTeachers(data as Teacher[]);
      } catch (error) {
        console.error("Error al cargar docentes:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los docentes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [toast]);

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.dni.includes(searchTerm) ||
      teacher.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto">
          <Link to="/" className="text-blue-600 hover:underline flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver al inicio
          </Link>
        </div>
      </nav>

      <main className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Gestión de Docentes</CardTitle>
                <CardDescription>Administrar información de docentes</CardDescription>
              </div>
              {canCreateTeacher && (
                <Button variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Nuevo Docente
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, DNI o especialidad..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>DNI</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Especialidad</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6">
                        Cargando docentes...
                      </TableCell>
                    </TableRow>
                  ) : filteredTeachers.length > 0 ? (
                    filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell>{teacher.dni}</TableCell>
                        <TableCell className="font-medium">{teacher.nombre}</TableCell>
                        <TableCell>{teacher.especialidad}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/docentes/${teacher.id}/perfil`}>
                                <Eye className="h-4 w-4 mr-1" />
                                Perfil
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/docentes/${teacher.id}/asignaturas`}>
                                <Book className="h-4 w-4 mr-1" />
                                Asignaturas
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/docentes/${teacher.id}/informes`}>
                                <FileText className="h-4 w-4 mr-1" />
                                Informes
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6">
                        No se encontraron docentes
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Docentes;
