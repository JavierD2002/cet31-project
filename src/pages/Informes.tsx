
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/hooks/use-toast";
import ReportCreationForm from '@/components/reports/ReportCreationForm';
import ReportsList from '@/components/reports/ReportsList';
import ReportViewModal from '@/components/reports/ReportViewModal';
import ReportCreationModal from '@/components/reports/ReportCreationModal';
import ReportsStatistics from '@/components/reports/ReportsStatistics';

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
            <ReportsStatistics mockInformes={mockInformes} mockCursos={mockCursos} />

            {/* Crear nuevo informe - Solo para docentes */}
            {hasRole('docente') && (
              <ReportCreationForm
                newReport={newReport}
                setNewReport={setNewReport}
                onStartNewReport={handleStartNewReport}
              />
            )}

            {/* Lista de informes */}
            <ReportsList
              filteredInformes={filteredInformes}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCourse={selectedCourse}
              setSelectedCourse={setSelectedCourse}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              onViewReport={setEditingReport}
              onGeneratePDF={generatePDF}
              hasRole={hasRole}
              user={user}
            />

            {/* Modal para crear informe con estudiantes */}
            <ReportCreationModal
              isCreating={isCreating}
              onClose={() => setIsCreating(false)}
              newReport={newReport}
              onStudentFieldChange={handleStudentFieldChange}
              onSaveReport={handleSaveReport}
            />

            {/* Modal para ver/editar informe existente */}
            <ReportViewModal
              editingReport={editingReport}
              onClose={() => setEditingReport(null)}
              onGeneratePDF={generatePDF}
            />
          </main>

          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Informes;
