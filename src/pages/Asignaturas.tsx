
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Plus, Edit, Trash2, Search, Filter, BookOpen, User, Clock } from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useAuth } from '@/context/AuthContext';

const Asignaturas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cursoFilter, setCursoFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [deletingSubject, setDeletingSubject] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { hasRole } = useAuth();

  const canCreateSubject = hasRole(['administrador', 'directivo']);
  const canEditSubject = hasRole(['administrador', 'directivo']);
  const canDeleteSubject = hasRole(['administrador']);

  // Consultas
  const { data: subjects = [], isLoading: loadingSubjects, error: subjectsError } = useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjects,
  });

  const { data: teachers = [], isLoading: loadingTeachers } = useQuery({
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
      setShowForm(false);
    },
    onError: (error: any) => {
      console.error('Error creating subject:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la asignatura. Verifique los datos e intente nuevamente.",
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
      setShowForm(false);
      setEditingSubject(null);
    },
    onError: (error: any) => {
      console.error('Error updating subject:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la asignatura. Verifique los datos e intente nuevamente.",
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
      setDeletingSubject(null);
    },
    onError: (error: any) => {
      console.error('Error deleting subject:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la asignatura. Puede que tenga datos relacionados.",
        variant: "destructive",
      });
    },
  });

  // Obtener lista única de cursos para el filtro
  const uniqueCursos = [...new Set(subjects.map(subject => subject.curso))].sort();

  // Filtrar asignaturas
  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = 
      subject.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (subject.docente_nombre && subject.docente_nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCurso = cursoFilter === 'all' || subject.curso === cursoFilter;
    
    return matchesSearch && matchesCurso;
  });

  const handleCreate = (data: any) => {
    console.log('Creating subject with data:', data);
    createMutation.mutate(data);
  };

  const handleEdit = (data: any) => {
    if (editingSubject) {
      console.log('Updating subject:', editingSubject.id, 'with data:', data);
      updateMutation.mutate({ id: editingSubject.id, data });
    }
  };

  const handleDelete = () => {
    if (deletingSubject) {
      console.log('Deleting subject:', deletingSubject.id);
      deleteMutation.mutate(deletingSubject.id);
    }
  };

  const openEditForm = (subject: any) => {
    console.log('Editing subject:', subject);
    setEditingSubject(subject);
    setShowForm(true);
  };

  const openCreateForm = () => {
    setEditingSubject(null);
    setShowForm(true);
  };

  if (subjectsError) {
    console.error('Error loading subjects:', subjectsError);
  }

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
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Gestión de Asignaturas
                </CardTitle>
                <CardDescription>Administrar materias, docentes asignados y carga horaria</CardDescription>
              </div>
              {canCreateSubject && (
                <Button onClick={openCreateForm} disabled={createMutation.isPending}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Asignatura
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Filtros mejorados */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por nombre, curso o docente..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <Select value={cursoFilter} onValueChange={setCursoFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por curso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los cursos</SelectItem>
                      {uniqueCursos.map((curso) => (
                        <SelectItem key={curso} value={curso}>
                          {curso}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">Total Asignaturas</p>
                      <p className="text-xl font-bold">{subjects.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">Con Docente</p>
                      <p className="text-xl font-bold">
                        {subjects.filter(s => s.docente_id).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600">Horas Totales</p>
                      <p className="text-xl font-bold">
                        {subjects.reduce((acc, s) => acc + (s.carga_horaria || 0), 0)}h
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                        {searchTerm || cursoFilter !== 'all' 
                          ? 'No se encontraron asignaturas que coincidan con los filtros' 
                          : 'No hay asignaturas registradas'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubjects.map((subject) => (
                      <TableRow key={subject.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-gray-400" />
                            {subject.nombre}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{subject.curso}</Badge>
                        </TableCell>
                        <TableCell>
                          {subject.docente_nombre ? (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              {subject.docente_nombre}
                            </div>
                          ) : (
                            <Badge variant="secondary">Sin asignar</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            {subject.carga_horaria}h/semana
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={subject.descripcion || ''}>
                            {subject.descripcion || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {canEditSubject && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditForm(subject)}
                                disabled={updateMutation.isPending}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            {canDeleteSubject && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeletingSubject(subject)}
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
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
              ¿Está seguro que desea eliminar la asignatura "{deletingSubject?.nombre}" del curso "{deletingSubject?.curso}"?
              Esta acción no se puede deshacer y puede afectar registros relacionados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default Asignaturas;
