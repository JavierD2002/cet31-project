
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Search, Eye, User, FileText, Book, Edit, Trash2 } from 'lucide-react';
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
import TeacherForm from '@/components/teachers/TeacherForm';
import { getTeachers, createTeacher, updateTeacher, deleteTeacher } from '@/services/supabase';
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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const { toast } = useToast();
  const { hasRole } = useAuth();
  const canCreateTeacher = hasRole(['administrador', 'directivo']);
  const canEditTeacher = hasRole(['administrador', 'directivo']);
  const canDeleteTeacher = hasRole(['administrador']);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
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

  const handleCreateTeacher = () => {
    setEditingTeacher(null);
    setIsFormOpen(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingTeacher) {
        await updateTeacher(editingTeacher.id, data);
        toast({
          title: "Éxito",
          description: "Docente actualizado correctamente",
        });
      } else {
        await createTeacher(data);
        toast({
          title: "Éxito",
          description: "Docente creado correctamente",
        });
      }
      await fetchTeachers();
    } catch (error) {
      console.error("Error al guardar docente:", error);
      toast({
        title: "Error",
        description: editingTeacher 
          ? "No se pudo actualizar el docente" 
          : "No se pudo crear el docente",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!teacherToDelete) return;

    try {
      await deleteTeacher(teacherToDelete.id);
      toast({
        title: "Éxito",
        description: "Docente eliminado correctamente",
      });
      await fetchTeachers();
    } catch (error) {
      console.error("Error al eliminar docente:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el docente",
        variant: "destructive",
      });
    } finally {
      setTeacherToDelete(null);
    }
  };

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
                <Button onClick={handleCreateTeacher}>
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
                            {canEditTeacher && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditTeacher(teacher)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                            )}
                            {canDeleteTeacher && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setTeacherToDelete(teacher)}
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

      <TeacherForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        initialData={editingTeacher}
        title={editingTeacher ? "Editar Docente" : "Nuevo Docente"}
      />

      <AlertDialog open={!!teacherToDelete} onOpenChange={() => setTeacherToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente al docente
              {teacherToDelete && ` ${teacherToDelete.nombre}`} del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default Docentes;
