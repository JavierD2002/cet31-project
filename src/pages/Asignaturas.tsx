
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Plus, Edit, Trash2, Search } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SubjectForm from '@/components/subjects/SubjectForm';
import { getSubjects, createSubject, updateSubject, deleteSubject, getTeachers } from '@/services/supabase';

const Asignaturas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [deletingSubject, setDeletingSubject] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Consultas
  const { data: subjects = [], isLoading: loadingSubjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjects,
  });

  const { data: teachers = [] } = useQuery({
    queryKey: ['teachers'],
    queryFn: getTeachers,
  });

  // Mutaciones
  const createMutation = useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast({
        title: "Asignatura creada",
        description: "La asignatura se ha creado exitosamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear la asignatura.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateSubject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast({
        title: "Asignatura actualizada",
        description: "La asignatura se ha actualizado exitosamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la asignatura.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast({
        title: "Asignatura eliminada",
        description: "La asignatura se ha eliminado exitosamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la asignatura.",
        variant: "destructive",
      });
    },
  });

  // Filtrar asignaturas
  const filteredSubjects = subjects.filter(subject =>
    subject.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subject.docente_nombre && subject.docente_nombre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreate = (data: any) => {
    createMutation.mutate(data);
  };

  const handleEdit = (data: any) => {
    if (editingSubject) {
      updateMutation.mutate({ id: editingSubject.id, data });
      setEditingSubject(null);
    }
  };

  const handleDelete = () => {
    if (deletingSubject) {
      deleteMutation.mutate(deletingSubject.id);
      setDeletingSubject(null);
    }
  };

  const openEditForm = (subject: any) => {
    setEditingSubject(subject);
    setShowForm(true);
  };

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
                <CardTitle>Gestión de Asignaturas</CardTitle>
                <CardDescription>Administrar materias y asignaturas del establecimiento</CardDescription>
              </div>
              <Button onClick={() => { setEditingSubject(null); setShowForm(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Asignatura
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filtros */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, curso o docente..."
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
                    <TableHead>Asignatura</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Docente</TableHead>
                    <TableHead>Carga Horaria</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingSubjects ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Cargando asignaturas...
                      </TableCell>
                    </TableRow>
                  ) : filteredSubjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        {searchTerm ? 'No se encontraron asignaturas que coincidan con la búsqueda' : 'No hay asignaturas registradas'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubjects.map((subject) => (
                      <TableRow key={subject.id}>
                        <TableCell className="font-medium">{subject.nombre}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{subject.curso}</Badge>
                        </TableCell>
                        <TableCell>{subject.docente_nombre || 'Sin asignar'}</TableCell>
                        <TableCell>{subject.carga_horaria}h/semana</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={subject.descripcion || ''}>
                            {subject.descripcion || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditForm(subject)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeletingSubject(subject)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Formulario de creación/edición */}
      <SubjectForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={editingSubject ? handleEdit : handleCreate}
        teachers={teachers}
        initialData={editingSubject}
        title={editingSubject ? 'Editar Asignatura' : 'Nueva Asignatura'}
      />

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog open={!!deletingSubject} onOpenChange={() => setDeletingSubject(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro que desea eliminar la asignatura "{deletingSubject?.nombre}"?
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default Asignaturas;
