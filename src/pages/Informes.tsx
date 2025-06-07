
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, FileText, Plus, ChevronLeft, Download, Eye, Edit, Trash2 } from 'lucide-react';
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
import { Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { 
  getReports, 
  getReportTemplates, 
  createReport, 
  updateReport, 
  deleteReport,
  getStudents 
} from '@/services/supabase';
import ReportEditor from '@/components/reports/ReportEditor';

const Informes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const { data: informes = [], isLoading } = useQuery({
    queryKey: ['reports', { periodo: selectedPeriod, tipo: selectedType, search: searchTerm }],
    queryFn: () => getReports({
      periodo: selectedPeriod || undefined,
      tipo: selectedType || undefined
    })
  });

  const { data: plantillas = [] } = useQuery({
    queryKey: ['reportTemplates'],
    queryFn: getReportTemplates
  });

  const { data: estudiantes = [] } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast({
        title: "Informe creado",
        description: "El informe se ha creado exitosamente."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear el informe.",
        variant: "destructive"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: any }) => updateReport(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast({
        title: "Informe actualizado",
        description: "El informe se ha actualizado exitosamente."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el informe.",
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast({
        title: "Informe eliminado",
        description: "El informe se ha eliminado exitosamente."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el informe.",
        variant: "destructive"
      });
    }
  });

  // Filter reports
  const filteredInformes = informes.filter(informe => 
    informe.estudiante_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    informe.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    informe.tipo_informe?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveReport = (reportData: any) => {
    if (selectedReport) {
      updateMutation.mutate({ id: selectedReport.id, updates: reportData });
    } else {
      createMutation.mutate(reportData);
    }
  };

  const handleDeleteReport = (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este informe?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'borrador':
        return <Badge variant="secondary">Borrador</Badge>;
      case 'revision':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">En Revisión</Badge>;
      case 'finalizado':
        return <Badge variant="default" className="bg-green-500">Finalizado</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const getTypeBadge = (tipo: string) => {
    const typeLabels: Record<string, string> = {
      'desempeño_academico': 'Académico',
      'comportamiento': 'Comportamiento',
      'integral': 'Integral',
      'personalizado': 'Personalizado'
    };
    
    return <Badge variant="outline">{typeLabels[tipo] || tipo}</Badge>;
  };

  const periodos = ["Primer Trimestre", "Segundo Trimestre", "Tercer Trimestre", "Anual"];
  const tipos = [
    { value: "desempeño_academico", label: "Desempeño Académico" },
    { value: "comportamiento", label: "Comportamiento" },
    { value: "integral", label: "Integral" },
    { value: "personalizado", label: "Personalizado" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sistema de Gestión Escolar</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Admin</span>
          </div>
        </div>
      </header>
      
      {/* Navigation */}
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto">
          <Link to="/" className="text-blue-600 hover:underline flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver al inicio
          </Link>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Informes Pedagógicos</h2>
          <Button 
            onClick={() => {
              setSelectedReport(null);
              setIsEditorOpen(true);
            }}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Informe
          </Button>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{informes.length}</div>
              <div className="text-sm text-gray-600">Total Informes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">
                {informes.filter(i => i.estado === 'borrador').length}
              </div>
              <div className="text-sm text-gray-600">Borradores</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {informes.filter(i => i.estado === 'revision').length}
              </div>
              <div className="text-sm text-gray-600">En Revisión</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {informes.filter(i => i.estado === 'finalizado').length}
              </div>
              <div className="text-sm text-gray-600">Finalizados</div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Gestión de Informes</CardTitle>
            <CardDescription>
              Visualice, edite y cree nuevos informes pedagógicos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex mb-6 gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Buscar por estudiante, título o tipo..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Todos los períodos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los períodos</SelectItem>
                  {periodos.map(periodo => (
                    <SelectItem key={periodo} value={periodo}>{periodo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los tipos</SelectItem>
                  {tipos.map(tipo => (
                    <SelectItem key={tipo.value} value={tipo.value}>{tipo.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">Cargando informes...</div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estudiante</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Autor</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInformes.map((informe) => (
                      <TableRow key={informe.id}>
                        <TableCell className="font-medium">{informe.estudiante_nombre}</TableCell>
                        <TableCell>{informe.titulo}</TableCell>
                        <TableCell>{getTypeBadge(informe.tipo_informe)}</TableCell>
                        <TableCell>{informe.periodo}</TableCell>
                        <TableCell>{getStatusBadge(informe.estado)}</TableCell>
                        <TableCell>{new Date(informe.fecha_creacion).toLocaleDateString()}</TableCell>
                        <TableCell>{informe.autor_nombre}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // Vista previa - implementar modal de vista
                                console.log('Ver informe:', informe.id);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedReport(informe);
                                setIsEditorOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // Exportar PDF - implementar
                                console.log('Exportar PDF:', informe.id);
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteReport(informe.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {filteredInformes.length === 0 && !isLoading && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron informes con los criterios de búsqueda.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Editor Modal */}
        <ReportEditor
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            setSelectedReport(null);
          }}
          onSave={handleSaveReport}
          report={selectedReport}
          students={estudiantes}
          templates={plantillas}
          currentUserId={1} // En producción, obtener del contexto de auth
        />
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto text-center text-sm">
          <p>&copy; 2025 Sistema de Gestión Escolar - Escuela Técnica de Río Negro</p>
        </div>
      </footer>
    </div>
  );
};

export default Informes;
