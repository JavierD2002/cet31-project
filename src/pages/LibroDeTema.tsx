
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  CalendarIcon, 
  BookIcon, 
  SearchIcon, 
  PlusCircleIcon,
  FilterIcon,
  EditIcon,
  TrashIcon,
  FileTextIcon,
  Clock
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getTopics, getSubjects, getTeachers, createTopic, updateTopic, deleteTopic } from '@/services/supabase';
import TopicForm from '@/components/topics/TopicForm';

const LibroDeTema = () => {
  const [filtros, setFiltros] = useState({
    busqueda: '',
    curso: 'todos',
    asignatura_id: 'todas',
    docente_id: 'todos',
    fecha_desde: '',
    fecha_hasta: '',
    estado: 'todos'
  });
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [temaEditando, setTemaEditando] = useState<any>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const { data: temas, isLoading } = useQuery({
    queryKey: ['topics', filtros],
    queryFn: () => getTopics({
      curso: filtros.curso !== 'todos' ? filtros.curso : undefined,
      asignatura_id: filtros.asignatura_id !== 'todas' ? parseInt(filtros.asignatura_id) : undefined,
      docente_id: filtros.docente_id !== 'todos' ? parseInt(filtros.docente_id) : undefined,
      fecha_desde: filtros.fecha_desde || undefined,
      fecha_hasta: filtros.fecha_hasta || undefined
    })
  });

  const { data: asignaturas } = useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjects
  });

  const { data: docentes } = useQuery({
    queryKey: ['teachers'],
    queryFn: getTeachers
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast({
        title: "Éxito",
        description: "Tema registrado correctamente",
      });
      setModalAbierto(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo registrar el tema",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateTopic(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast({
        title: "Éxito",
        description: "Tema actualizado correctamente",
      });
      setModalAbierto(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el tema",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast({
        title: "Éxito",
        description: "Tema eliminado correctamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el tema",
        variant: "destructive",
      });
    }
  });

  // Filtrar temas según la búsqueda
  const temasFiltrados = temas?.filter(tema => {
    const coincideBusqueda = tema.tema.toLowerCase().includes(filtros.busqueda.toLowerCase()) || 
                           tema.contenido.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
                           tema.actividad.toLowerCase().includes(filtros.busqueda.toLowerCase());
    
    const coincideEstado = filtros.estado !== 'todos' ? tema.estado === filtros.estado : true;
    
    return coincideBusqueda && coincideEstado;
  }) || [];
  
  // Lista de cursos únicos para el filtro
  const cursos = [...new Set(asignaturas?.map(asignatura => asignatura.curso) || [])];

  const handleSubmit = (data: any) => {
    if (temaEditando) {
      updateMutation.mutate({ id: temaEditando.id, data });
    } else {
      createMutation.mutate(data);
    }
    setTemaEditando(null);
  };

  const handleEdit = (tema: any) => {
    setTemaEditando(tema);
    setModalAbierto(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este tema?')) {
      deleteMutation.mutate(id);
    }
  };

  const limpiarFiltros = () => {
    setFiltros({
      busqueda: '',
      curso: 'todos',
      asignatura_id: 'todas',
      docente_id: 'todos',
      fecha_desde: '',
      fecha_hasta: '',
      estado: 'todos'
    });
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'completado':
        return <Badge variant="default" className="bg-green-500">Completado</Badge>;
      case 'planificado':
        return <Badge variant="secondary">Planificado</Badge>;
      case 'en_progreso':
        return <Badge variant="default" className="bg-blue-500">En Progreso</Badge>;
      case 'cancelado':
        return <Badge variant="destructive">Cancelado</Badge>;
      case 'reprogramado':
        return <Badge variant="outline">Reprogramado</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-purple-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <BookIcon className="mr-2" />
            Libro de Tema
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Sistema de Gestión Escolar</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center">
            <CalendarIcon className="mr-2 text-purple-600" />
            <h2 className="text-xl font-semibold">Registro de temas dictados</h2>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <FileTextIcon className="mr-2 h-4 w-4" />
              Planificación
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => {
                setTemaEditando(null);
                setModalAbierto(true);
              }}
            >
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              Nuevo registro
            </Button>
          </div>
        </div>
        
        {/* Filtros y búsqueda */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Buscar y filtrar</CardTitle>
            <CardDescription>Encuentra registros específicos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Búsqueda</label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Buscar por tema, contenido..." 
                    className="pl-9"
                    value={filtros.busqueda}
                    onChange={(e) => setFiltros(prev => ({ ...prev, busqueda: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Curso</label>
                <Select value={filtros.curso} onValueChange={(value) => setFiltros(prev => ({ ...prev, curso: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los cursos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los cursos</SelectItem>
                    {cursos.map(curso => (
                      <SelectItem key={curso} value={curso}>{curso}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Asignatura</label>
                <Select value={filtros.asignatura_id} onValueChange={(value) => setFiltros(prev => ({ ...prev, asignatura_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las asignaturas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las asignaturas</SelectItem>
                    {asignaturas?.map(asignatura => (
                      <SelectItem key={asignatura.id} value={asignatura.id.toString()}>
                        {asignatura.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Estado</label>
                <Select value={filtros.estado} onValueChange={(value) => setFiltros(prev => ({ ...prev, estado: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="planificado">Planificado</SelectItem>
                    <SelectItem value="en_progreso">En Progreso</SelectItem>
                    <SelectItem value="completado">Completado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                    <SelectItem value="reprogramado">Reprogramado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Fecha Desde</label>
                <Input 
                  type="date" 
                  value={filtros.fecha_desde}
                  onChange={(e) => setFiltros(prev => ({ ...prev, fecha_desde: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Fecha Hasta</label>
                <Input 
                  type="date" 
                  value={filtros.fecha_hasta}
                  onChange={(e) => setFiltros(prev => ({ ...prev, fecha_hasta: e.target.value }))}
                />
              </div>

              <div className="flex items-end">
                <Button variant="outline" onClick={limpiarFiltros}>
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Registros</p>
                  <p className="text-2xl font-bold">{temasFiltrados.length}</p>
                </div>
                <BookIcon className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completados</p>
                  <p className="text-2xl font-bold text-green-600">
                    {temasFiltrados.filter(t => t.estado === 'completado').length}
                  </p>
                </div>
                <CalendarIcon className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Planificados</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {temasFiltrados.filter(t => t.estado === 'planificado').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Este Mes</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {temasFiltrados.filter(t => {
                      const fecha = new Date(t.fecha);
                      const hoy = new Date();
                      return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();
                    }).length}
                  </p>
                </div>
                <FileTextIcon className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabla de temas dictados */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BookIcon className="mr-2 h-5 w-5 text-purple-600" />
              Temas dictados
            </CardTitle>
            <CardDescription>
              Registros encontrados: {temasFiltrados.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center py-4">Cargando registros...</p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Asignatura</TableHead>
                      <TableHead>Tema</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Docente</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {temasFiltrados.length > 0 ? (
                      temasFiltrados.map((tema) => (
                        <TableRow key={tema.id} className="hover:bg-purple-50">
                          <TableCell>{new Date(tema.fecha).toLocaleDateString()}</TableCell>
                          <TableCell>{tema.curso}</TableCell>
                          <TableCell>{tema.asignatura_nombre || 'Sin asignatura'}</TableCell>
                          <TableCell className="max-w-xs truncate" title={tema.tema}>
                            {tema.tema}
                          </TableCell>
                          <TableCell>{getEstadoBadge(tema.estado)}</TableCell>
                          <TableCell>{tema.docente_nombre || 'Sin asignar'}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEdit(tema)}
                              >
                                <EditIcon className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDelete(tema.id)}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                          No se encontraron registros que coincidan con la búsqueda
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto text-center text-sm">
          <p>&copy; 2025 Sistema de Gestión Escolar - Escuela Técnica de Río Negro</p>
        </div>
      </footer>

      {/* Modal de formulario */}
      <TopicForm
        open={modalAbierto}
        onOpenChange={setModalAbierto}
        onSubmit={handleSubmit}
        subjects={asignaturas || []}
        teachers={docentes || []}
        initialData={temaEditando}
        title={temaEditando ? "Editar Tema" : "Nuevo Tema"}
      />
    </div>
  );
};

export default LibroDeTema;
