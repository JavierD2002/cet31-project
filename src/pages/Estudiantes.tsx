
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Search, Eye, User, FileText } from 'lucide-react';
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
import { getStudents } from '@/services/supabase';
import { useAuth } from '@/context/AuthContext';

type Student = {
  id: number;
  usuario_id: number;
  dni: string;
  nombre: string;
  curso: string;
};

const Estudiantes = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const { hasRole } = useAuth();
  const canCreateStudent = hasRole(['administrador', 'directivo']);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudents();
        setStudents(data as Student[]);
      } catch (error) {
        console.error("Error al cargar estudiantes:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los estudiantes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [toast]);

  const filteredStudents = students.filter(
    (student) =>
      student.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.dni.includes(searchTerm) ||
      student.curso.toLowerCase().includes(searchTerm.toLowerCase())
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
                <CardTitle>Gestión de Estudiantes</CardTitle>
                <CardDescription>Administrar información de estudiantes</CardDescription>
              </div>
              {canCreateStudent && (
                <Button variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Nuevo Estudiante
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, DNI o curso..."
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
                    <TableHead>Curso</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6">
                        Cargando estudiantes...
                      </TableCell>
                    </TableRow>
                  ) : filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.dni}</TableCell>
                        <TableCell className="font-medium">{student.nombre}</TableCell>
                        <TableCell>{student.curso}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/estudiantes/${student.id}/perfil`}>
                                <Eye className="h-4 w-4 mr-1" />
                                Perfil
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/estudiantes/${student.id}/calificaciones`}>
                                <FileText className="h-4 w-4 mr-1" />
                                Calificaciones
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/estudiantes/${student.id}/asistencia`}>
                                <FileText className="h-4 w-4 mr-1" />
                                Asistencia
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6">
                        No se encontraron estudiantes
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

export default Estudiantes;
