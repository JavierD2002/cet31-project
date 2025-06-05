
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
import ClassroomForm from '@/components/classrooms/ClassroomForm';
import { getClassrooms, createClassroom, updateClassroom, deleteClassroom } from '@/services/supabase';

const Aulas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<any>(null);
  const [deletingClassroom, setDeletingClassroom] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Consultas
  const { data: classrooms = [], isLoading: loadingClassrooms } = useQuery({
    queryKey: ['classrooms'],
    queryFn: getClassrooms,
  });

  // Mutaciones
  const createMutation = useMutation({
    mutationFn: createClassroom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
      toast({
        title: "Aula creada",
        description: "El aula se ha creado exitosamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear el aula.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateClassroom(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
      toast({
        title: "Aula actualizada",
        description: "El aula se ha actualizado exitosamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el aula.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteClassroom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
      toast({
        title: "Aula eliminada",
        description: "El aula se ha eliminado exitosamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el aula.",
        variant: "destructive",
      });
    },
  });

  // Filtrar aulas
  const filteredClassrooms = classrooms.filter(classroom =>
    classroom.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classroom.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (classroom.recursos && classroom.recursos.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreate = (data: any) => {
    createMutation.mutate(data);
  };

  const handleEdit = (data: any) => {
    if (editingClassroom) {
      updateMutation.mutate({ id: editingClassroom.id, data });
      setEditingClassroom(null);
    }
  };

  const handleDelete = () => {
    if (deletingClassroom) {
      deleteMutation.mutate(deletingClassroom.id);
      setDeletingClassroom(null);
    }
  };

  const openEditForm = (classroom: any) => {
    setEditingClassroom(classroom);
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
                <CardTitle>Gestión de Aulas</CardTitle>
                <CardDescription>Administrar aulas y espacios educativos</CardDescription>
              </div>
              <Button onClick={() => { setEditingClassroom(null); setShowForm(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Aula
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filtros */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, ubicación o recursos..."
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
                    <TableHead>Aula</TableHead>
                    <TableHead>Capacidad</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Recursos</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingClassrooms ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Cargando aulas...
                      </TableCell>
                    </TableRow>
                  ) : filteredClassrooms.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        {searchTerm ? 'No se encontraron aulas que coincidan con la búsqueda' : 'No hay aulas registradas'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClassrooms.map((classroom) => (
                      <TableRow key={classroom.id}>
                        <TableCell className="font-medium">{classroom.nombre}</TableCell>
                        <TableCell>{classroom.capacidad} estudiantes</TableCell>
                        <TableCell>{classroom.ubicacion}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={classroom.recursos || ''}>
                            {classroom.recursos || 'Sin recursos especificados'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={classroom.activa ? "default" : "secondary"}>
                            {classroom.activa ? 'Activa' : 'Inactiva'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditForm(classroom)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeletingClassroom(classroom)}
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
      <ClassroomForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={editingClassroom ? handleEdit : handleCreate}
        initialData={editingClassroom}
        title={editingClassroom ? 'Editar Aula' : 'Nueva Aula'}
      />

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog open={!!deletingClassroom} onOpenChange={() => setDeletingClassroom(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro que desea eliminar el aula "{deletingClassroom?.nombre}"?
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

export default Aulas;
