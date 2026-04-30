import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import ExportButtons from '@/components/ExportButtons';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/hooks/use-toast";
import ReportCreationForm from '@/components/reports/ReportCreationForm';
import ReportsList from '@/components/reports/ReportsList';
import ReportViewModal from '@/components/reports/ReportViewModal';
import ReportCreationModal from '@/components/reports/ReportCreationModal';
import ReportsStatistics from '@/components/reports/ReportsStatistics';
import { supabase } from '@/integrations/supabase/client';
import { exportToPDF } from '@/utils/exportUtils';

type InformeRow = {
  id: number;
  fecha: string;
  asignatura: string;
  curso: string;
  docente_id: number | null;
  docente_nombre: string;
  estudiantes: any[];
};

const Informes = () => {
  const { user, hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("todos");
  const [selectedSubject, setSelectedSubject] = useState("todas");
  const [isCreating, setIsCreating] = useState(false);
  const [editingReport, setEditingReport] = useState<any>(null);

  const [informes, setInformes] = useState<InformeRow[]>([]);
  const [cursos, setCursos] = useState<string[]>([]);
  const [asignaturas, setAsignaturas] = useState<{ id: number; nombre: string }[]>([]);
  const [estudiantesDB, setEstudiantesDB] = useState<{ id: number; nombre: string; apellido: string; curso: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [newReport, setNewReport] = useState({
    fecha: new Date().toISOString().split('T')[0],
    asignatura: "",
    curso: "",
    estudiantes: [] as any[]
  });

  const { toast } = useToast();

  const loadAll = async () => {
    try {
      setLoading(true);
      // Asignaturas
      const { data: asigData } = await supabase
        .from('asignaturas')
        .select('id, nombre, curso');
      const asigUnique = Array.from(
        new Map((asigData || []).map(a => [a.nombre, { id: a.id, nombre: a.nombre }])).values()
      );
      setAsignaturas(asigUnique);

      // Cursos
      const cursosUnique = Array.from(new Set((asigData || []).map(a => a.curso))).sort();
      setCursos(cursosUnique);

      // Estudiantes
      const { data: estData } = await supabase
        .from('estudiantes')
        .select('id, curso, usuarios!estudiantes_usuario_id_fkey(nombre, apellido)');
      const estList = (estData || []).map((e: any) => ({
        id: e.id,
        nombre: e.usuarios?.nombre || '',
        apellido: e.usuarios?.apellido || '',
        curso: e.curso,
      }));
      setEstudiantesDB(estList);

      // Informes pedagógicos
      const { data: infData } = await supabase
        .from('informes_pedagogicos')
        .select('id, fecha_creacion, titulo, contenido, observaciones, estudiante_id, autor_id, periodo, tipo_informe, estado')
        .order('fecha_creacion', { ascending: false });

      // Autores (docentes)
      const autorIds = Array.from(new Set((infData || []).map((i: any) => i.autor_id).filter(Boolean)));
      const estudianteIds = Array.from(new Set((infData || []).map((i: any) => i.estudiante_id).filter(Boolean)));

      const { data: autoresData } = autorIds.length
        ? await supabase.from('usuarios').select('id, nombre, apellido').in('id', autorIds as number[])
        : { data: [] as any[] };
      const { data: estInfData } = estudianteIds.length
        ? await supabase
            .from('estudiantes')
            .select('id, curso, usuarios!estudiantes_usuario_id_fkey(nombre, apellido)')
            .in('id', estudianteIds as number[])
        : { data: [] as any[] };

      const autorMap = new Map<number, string>();
      (autoresData || []).forEach((a: any) => autorMap.set(a.id, `Prof. ${a.apellido}, ${a.nombre}`));
      const estMap = new Map<number, { nombre: string; curso: string }>();
      (estInfData || []).forEach((e: any) =>
        estMap.set(e.id, {
          nombre: `${e.usuarios?.apellido || ''}, ${e.usuarios?.nombre || ''}`,
          curso: e.curso,
        })
      );

      const informesList: InformeRow[] = (infData || []).map((i: any) => {
        const est = estMap.get(i.estudiante_id);
        return {
          id: i.id,
          fecha: i.fecha_creacion,
          asignatura: i.tipo_informe || '-',
          curso: est?.curso || '-',
          docente_id: i.autor_id,
          docente_nombre: autorMap.get(i.autor_id) || 'Sin autor',
          estudiantes: [
            {
              id: i.estudiante_id,
              nombre: est?.nombre || 'Estudiante',
              apropiacion: '',
              participacion: '',
              comunicacion: '',
              observaciones: i.observaciones || i.contenido || '',
            },
          ],
        };
      });
      setInformes(informesList);
    } catch (error) {
      console.error('Error cargando datos de informes:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los informes desde la base de datos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const filteredInformes = informes.filter(informe =>
    (selectedCourse === "todos" || informe.curso === selectedCourse) &&
    (selectedSubject === "todas" || informe.asignatura === selectedSubject) &&
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

    const estudiantesCurso = estudiantesDB
      .filter(est => est.curso === newReport.curso)
      .map(est => ({
        id: est.id,
        nombre: `${est.apellido}, ${est.nombre}`,
        apropiacion: "",
        participacion: "",
        comunicacion: "",
        observaciones: ""
      }));

    if (estudiantesCurso.length === 0) {
      toast({
        title: "Sin estudiantes",
        description: `No hay estudiantes registrados en el curso ${newReport.curso}`,
        variant: "destructive"
      });
      return;
    }

    setNewReport(prev => ({ ...prev, estudiantes: estudiantesCurso }));
    setIsCreating(true);
  };

  const handleSaveReport = async () => {
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

    try {
      // Crear un registro en informes_pedagogicos por cada estudiante evaluado
      const rows = newReport.estudiantes.map((est: any) => ({
        estudiante_id: est.id,
        autor_id: user?.id || null,
        tipo_informe: newReport.asignatura,
        periodo: 'General',
        titulo: `Informe pedagógico - ${newReport.asignatura} - ${newReport.curso}`,
        contenido:
          `Apropiación: ${est.apropiacion}\n` +
          `Participación: ${est.participacion}\n` +
          `Comunicación: ${est.comunicacion}`,
        observaciones: est.observaciones || '',
        fecha_creacion: newReport.fecha,
        estado: 'finalizado',
      }));

      const { error } = await supabase.from('informes_pedagogicos').insert(rows);
      if (error) throw error;

      toast({
        title: "Informe guardado",
        description: `Se guardaron ${rows.length} registros pedagógicos`,
      });

      setNewReport({
        fecha: new Date().toISOString().split('T')[0],
        asignatura: "",
        curso: "",
        estudiantes: []
      });
      setIsCreating(false);
      await loadAll();
    } catch (error) {
      console.error('Error guardando informe:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el informe',
        variant: 'destructive',
      });
    }
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
    exportToPDF({
      title: `Informe Pedagógico - ${informe.asignatura} - ${informe.curso}`,
      filename: `informe_${informe.id}`,
      columns: [
        { header: 'Estudiante', accessor: 'nombre' },
        { header: 'Apropiación', accessor: 'apropiacion' },
        { header: 'Participación', accessor: 'participacion' },
        { header: 'Comunicación', accessor: 'comunicacion' },
        { header: 'Observaciones', accessor: 'observaciones' },
      ],
      data: informe.estudiantes || [],
    });
    toast({ title: 'PDF generado', description: 'El informe se ha descargado.' });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />

          <main className="container mx-auto py-8 px-4 flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <SidebarTrigger />
                <div>
                  <h2 className="text-2xl font-semibold">Informes Pedagógicos</h2>
                  <p className="text-gray-500">Gestión de informes pedagógicos por curso</p>
                </div>
              </div>
              <div className="flex gap-2">
                <ExportButtons
                  title="Listado de Informes Pedagógicos"
                  filename="informes"
                  columns={[
                    { header: 'Fecha', accessor: (row: any) => new Date(row.fecha).toLocaleDateString() },
                    { header: 'Curso', accessor: 'curso' },
                    { header: 'Asignatura', accessor: 'asignatura' },
                    { header: 'Docente', accessor: 'docente_nombre' },
                    { header: 'Estudiantes', accessor: (row: any) => `${row.estudiantes.length} estudiantes` },
                  ]}
                  data={filteredInformes}
                />
                <Button asChild variant="outline">
                  <Link to="/" className="flex items-center space-x-2">
                    <Home className="h-4 w-4" />
                    <span>Volver al Inicio</span>
                  </Link>
                </Button>
              </div>
            </div>

            <ReportsStatistics mockInformes={informes} mockCursos={cursos} />

            {hasRole('docente') && (
              <ReportCreationForm
                newReport={newReport}
                setNewReport={setNewReport}
                onStartNewReport={handleStartNewReport}
                asignaturas={asignaturas}
                cursos={cursos}
              />
            )}

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
              cursos={cursos}
              asignaturas={asignaturas}
              loading={loading}
            />

            <ReportCreationModal
              isCreating={isCreating}
              onClose={() => setIsCreating(false)}
              newReport={newReport}
              onStudentFieldChange={handleStudentFieldChange}
              onSaveReport={handleSaveReport}
            />

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
