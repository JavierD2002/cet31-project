
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Search, Eye, User, FileText, Edit, Trash2 } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StudentForm from '@/components/students/StudentForm';
import { getStudents, createStudent, updateStudent, deleteStudent } from '@/services/supabase';
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
  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const { toast } = useToast();
  const { hasRole } = useAuth();
  const canCreateStudent = hasRole(['administrador', 'directivo']);
  const canEditStudent = hasRole(['administrador', 'directivo']);
  const canDeleteStudent = hasRole(['administrador']);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
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

  const handleCreateStudent = async (data: any) => {
    try {
      await createStudent(data);
      toast({
        title: "Éxito",
        description: "Estudiante creado exitosamente",
      });
      fetchStudents();
    } catch (error) {
      console.error("Error al crear estudiante:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el estudiante",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStudent = async (data: any) => {
    try {
      if (!editingStudent) return;
      await updateStudent(editingStudent.id, data);
      toast({
        title: "Éxito",
        description: "Estudiante actualizado exitosamente",
      });
      fetchStudents();
      setEditingStudent(null);
    } catch (error) {
      console.error("Error al actualizar estudiante:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estudiante",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStudent = async () => {
    try {
      if (!studentToDelete) return;
      await deleteStudent(studentToDelete.id);
      toast({
        title: "Éxito",
        description: "Estudiante eliminado exitosamente",
      });
      fetchStudents();
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    } catch (error) {
      console.error("Error al eliminar estudiante:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el estudiante",
        variant: "destructive",
      });
    }
  };

  const openCreateForm = () => {
    setEditingStudent(null);
    setFormOpen(true);
  };

  const openEditForm = (student: Student) => {
    setEditingStudent(student);
    setFormOpen(true);
  };

  const openDeleteDialog = (student: Student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

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
                <Button onClick={openCreateForm}>
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
                            {canEditStudent && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => openEditForm(student)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                            )}
                            {canDeleteStudent && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => openDeleteDialog(student)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Eliminar
                              </Button>
                            )}
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

      <StudentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={editingStudent ? handleUpdateStudent : handleCreateStudent}
        initialData={editingStudent}
        title={editingStudent ? "Editar Estudiante" : "Nuevo Estudiante"}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente al estudiante
              {studentToDelete && ` ${studentToDelete.nombre}`} y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStudent} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default Estudiantes;
