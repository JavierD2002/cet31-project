
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, FileText, Plus, ChevronLeft, Download, Eye, Edit, Trash2, Save } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

// Mock data para los informes pedagógicos
const mockInformes = [
  {
    id: 1,
    fecha: "2025-01-15",
    asignatura: "Matemática",
    curso: "1° Año A",
    docente_id: 1,
    docente_nombre: "Prof. García, Susana",
    estudiantes: [
      {
        id: 1,
        nombre: "Acosta, María",
        apropiacion: "Lograda",
        participacion: "Sostenida",
        comunicacion: "Sostenida",
        observaciones: "Excelente desempeño en resolución de problemas"
      },
      {
        id: 2,
        nombre: "Benítez, Carlos",
        apropiacion: "En Proceso",
        participacion: "Intermitente",
        comunicacion: "Intermitente",
        observaciones: "Necesita refuerzo en operaciones básicas"
      }
    ]
  }
];

const mockEstudiantes = [
  { id: 1, nombre: "Acosta", apellido: "María", curso: "1° Año A" },
  { id: 2, nombre: "Benítez", apellido: "Carlos", curso: "1° Año A" },
  { id: 3, nombre: "Castro", apellido: "Ana", curso: "1° Año A" },
  { id: 4, nombre: "Díaz", apellido: "Pedro", curso: "1° Año A" }
];

const mockAsignaturas = [
  { id: 1, nombre: "Matemática" },
  { id: 2, nombre: "Lengua" },
  { id: 3, nombre: "Historia" },
  { id: 4, nombre: "Geografía" }
];

const mockCursos = ["1° Año A", "1° Año B", "2° Año A", "2° Año B"];

const Informes = () => {
  const { user, hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingReport, setEditingReport] = useState<any>(null);
  
  // Estados para crear nuevo informe
  const [newReport, setNewReport] = useState({
    fecha: new Date().toISOString().split('T')[0],
    asignatura: "",
    curso: "",
    estudiantes: [] as any[]
  });
  
  const { toast } = useToast();

  // Filter informes
  const filteredInformes = mockInformes.filter(informe => 
    (selectedCourse === "" || informe.curso === selectedCourse) &&
    (selectedSubject === "" || informe.asignatura === selectedSubject) &&
    (searchTerm === "" || 
     informe.curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
     informe.asignatura.toLowerCase().includes(searchTerm.toLowerCase()) ||
     informe.docente_nombre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleStartNewReport = () => {
    if (!newReport.fecha || !newReport.asignatura || !newReport.curso) {
      toast({
        title: "Campos requeridos",
        description: "Debe completar fecha, asignatura y curso",
        variant: "destructive"
      });
      return;
    }

    // Obtener estudiantes del curso seleccionado
    const estudiantesCurso = mockEstudiantes
      .filter(est => est.curso === newReport.curso)
      .map(est => ({
        id: est.id,
        nombre: `${est.apellido}, ${est.nombre}`,
        apropiacion: "",
        participacion: "",
        comunicacion: "",
        observaciones: ""
      }));

    setNewReport(prev => ({
      ...prev,
      estudiantes: estudiantesCurso
    }));
    setIsCreating(true);
  };

  const handleSaveReport = () => {
    // Validar que todos los campos obligatorios estén completos
    const incompleteStudents = newReport.estudiantes.filter(est => 
      !est.apropiacion || !est.participacion || !est.comunicacion
    );

    if (incompleteStudents.length > 0) {
      toast({
        title: "Campos incompletos",
        description: "Debe completar todos los campos para cada estudiante",
        variant: "destructive"
      });
      return;
    }

    // Aquí se guardaría en la base de datos
    toast({
      title: "Informe guardado",
      description: "El informe pedagógico se ha guardado exitosamente"
    });

    // Reset form
    setNewReport({
      fecha: new Date().toISOString().split('T')[0],
      asignatura: "",
      curso: "",
      estudiantes: []
    });
    setIsCreating(false);
  };

  const handleStudentFieldChange = (studentId: number, field: string, value: string) => {
    setNewReport(prev => ({
      ...prev,
      estudiantes: prev.estudiantes.map(est => 
        est.id === studentId ? { ...est, [field]: value } : est
      )
    }));
  };

  const generatePDF = (informe: any) => {
    // Aquí implementarías la generación de PDF
    toast({
      title: "Generando PDF",
      description: "El reporte PDF se está generando..."
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />

          <main className="container mx-auto py-8 px-4 flex-1">
            <div className="flex items-center space-x-3 mb-6">
              <SidebarTrigger />
              <div>
                <h2 className="text-2xl font-semibold">Informes Pedagógicos</h2>
                <p className="text-gray-500">Gestión de informes pedagógicos por curso</p>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{mockInformes.length}</div>
                  <div className="text-sm text-gray-600">Informes Totales</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {mockInformes.filter(i => new Date(i.fecha).getMonth() === new Date().getMonth()).length}
                  </div>
                  <div className="text-sm text-gray-600">Este Mes</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">{mockCursos.length}</div>
                  <div className="text-sm text-gray-600">Cursos Activos</div>
                </CardContent>
              </Card>
            </div>

            {/* Crear nuevo informe - Solo para docentes */}
            {hasRole('docente') && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Crear Nuevo Informe Pedagógico</CardTitle>
                  <CardDescription>
                    Complete los datos para crear un nuevo informe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label htmlFor="fecha">Fecha</Label>
                      <Input
                        id="fecha"
                        type="date"
                        value={newReport.fecha}
                        onChange={(e) => setNewReport(prev => ({ ...prev, fecha: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="asignatura">Asignatura</Label>
                      <Select value={newReport.asignatura} onValueChange={(value) => setNewReport(prev => ({ ...prev, asignatura: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar asignatura" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockAsignaturas.map(asig => (
                            <SelectItem key={asig.id} value={asig.nombre}>{asig.nombre}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="curso">Curso</Label>
                      <Select value={newReport.curso} onValueChange={(value) => setNewReport(prev => ({ ...prev, curso: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar curso" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockCursos.map(curso => (
                            <SelectItem key={curso} value={curso}>{curso}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handleStartNewReport} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Informe
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lista de informes */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Lista de Informes</CardTitle>
                <CardDescription>
                  Visualice y gestione los informes pedagógicos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex mb-6 gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      placeholder="Buscar por curso, asignatura o docente..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Todos los cursos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos los cursos</SelectItem>
                      {mockCursos.map(curso => (
                        <SelectItem key={curso} value={curso}>{curso}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Todas las asignaturas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas las asignaturas</SelectItem>
                      {mockAsignaturas.map(asig => (
                        <SelectItem key={asig.id} value={asig.nombre}>{asig.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Curso</TableHead>
                        <TableHead>Asignatura</TableHead>
                        <TableHead>Docente</TableHead>
                        <TableHead>Estudiantes</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInformes.map((informe) => (
                        <TableRow key={informe.id}>
                          <TableCell>{new Date(informe.fecha).toLocaleDateString()}</TableCell>
                          <TableCell><Badge variant="outline">{informe.curso}</Badge></TableCell>
                          <TableCell>{informe.asignatura}</TableCell>
                          <TableCell>{informe.docente_nombre}</TableCell>
                          <TableCell>{informe.estudiantes.length} estudiantes</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingReport(informe)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {(hasRole(['directivo', 'administrador']) || user?.id === informe.docente_id) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => generatePDF(informe)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {filteredInformes.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No se encontraron informes con los criterios de búsqueda.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Modal para crear informe con estudiantes */}
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    Informe Pedagógico - {newReport.curso} - {newReport.asignatura}
                  </DialogTitle>
                  <DialogDescription>
                    Complete la evaluación para cada estudiante
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {newReport.estudiantes.map((estudiante) => (
                    <Card key={estudiante.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{estudiante.nombre}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>1. Apropiación/Construcción de Saberes/Contenidos</Label>
                            <Select 
                              value={estudiante.apropiacion} 
                              onValueChange={(value) => handleStudentFieldChange(estudiante.id, 'apropiacion', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="En Proceso">En Proceso</SelectItem>
                                <SelectItem value="Lograda">Lograda</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>2. Participación</Label>
                            <Select 
                              value={estudiante.participacion} 
                              onValueChange={(value) => handleStudentFieldChange(estudiante.id, 'participacion', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Sostenida">Sostenida</SelectItem>
                                <SelectItem value="Intermitente">Intermitente</SelectItem>
                                <SelectItem value="Nula">Nula</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>3. Comunicación/Vinculación</Label>
                            <Select 
                              value={estudiante.comunicacion} 
                              onValueChange={(value) => handleStudentFieldChange(estudiante.id, 'comunicacion', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Sostenida">Sostenida</SelectItem>
                                <SelectItem value="Intermitente">Intermitente</SelectItem>
                                <SelectItem value="Nula">Nula</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label>4. Observaciones</Label>
                          <Textarea
                            value={estudiante.observaciones}
                            onChange={(e) => handleStudentFieldChange(estudiante.id, 'observaciones', e.target.value)}
                            placeholder="Escriba observaciones detalladas sobre el estudiante..."
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveReport}>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Informe
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Modal para ver/editar informe existente */}
            <Dialog open={!!editingReport} onOpenChange={() => setEditingReport(null)}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    Ver Informe - {editingReport?.curso} - {editingReport?.asignatura}
                  </DialogTitle>
                  <DialogDescription>
                    Fecha: {editingReport && new Date(editingReport.fecha).toLocaleDateString()} | 
                    Docente: {editingReport?.docente_nombre}
                  </DialogDescription>
                </DialogHeader>

                {editingReport && (
                  <div className="space-y-6">
                    {editingReport.estudiantes.map((estudiante: any) => (
                      <Card key={estudiante.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{estudiante.nombre}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label>Apropiación/Construcción de Saberes</Label>
                              <Badge variant={estudiante.apropiacion === 'Lograda' ? 'default' : 'secondary'}>
                                {estudiante.apropiacion}
                              </Badge>
                            </div>
                            
                            <div>
                              <Label>Participación</Label>
                              <Badge variant={
                                estudiante.participacion === 'Sostenida' ? 'default' : 
                                estudiante.participacion === 'Intermitente' ? 'secondary' : 'destructive'
                              }>
                                {estudiante.participacion}
                              </Badge>
                            </div>
                            
                            <div>
                              <Label>Comunicación/Vinculación</Label>
                              <Badge variant={
                                estudiante.comunicacion === 'Sostenida' ? 'default' : 
                                estudiante.comunicacion === 'Intermitente' ? 'secondary' : 'destructive'
                              }>
                                {estudiante.comunicacion}
                              </Badge>
                            </div>
                          </div>
                          
                          <div>
                            <Label>Observaciones</Label>
                            <div className="p-3 bg-gray-50 rounded-md min-h-[60px]">
                              {estudiante.observaciones || "Sin observaciones"}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <div className="flex justify-end space-x-2 pt-4 border-t">
                      <Button variant="outline" onClick={() => setEditingReport(null)}>
                        Cerrar
                      </Button>
                      <Button onClick={() => generatePDF(editingReport)}>
                        <Download className="h-4 w-4 mr-2" />
                        Descargar PDF
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </main>

          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Informes;
