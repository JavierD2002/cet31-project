
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarIcon, FilterIcon, DownloadIcon, FileTextIcon } from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAttendanceReport, getTeachers, getSubjects } from '@/services/supabase';

const AttendanceReports = () => {
  const [filtros, setFiltros] = useState({
    curso: 'all',
    asignatura_id: 'all',
    fecha_desde: '',
    fecha_hasta: ''
  });

  const { data: reporteData, isLoading } = useQuery({
    queryKey: ['attendanceReport', filtros],
    queryFn: () => getAttendanceReport({
      curso: filtros.curso && filtros.curso !== 'all' ? filtros.curso : undefined,
      asignatura_id: filtros.asignatura_id && filtros.asignatura_id !== 'all' ? parseInt(filtros.asignatura_id) : undefined,
      fecha_desde: filtros.fecha_desde,
      fecha_hasta: filtros.fecha_hasta
    }),
    enabled: !!(filtros.fecha_desde && filtros.fecha_hasta)
  });

  const { data: docentes } = useQuery({
    queryKey: ['teachers'],
    queryFn: getTeachers
  });

  const { data: asignaturas } = useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjects
  });

  const cursos = [
    "1° Año A", "1° Año B", "1° Año C",
    "2° Año A", "2° Año B", "2° Año C", 
    "3° Año A", "3° Año B", "3° Año C",
    "4° Año A", "4° Año B",
    "5° Año A", "5° Año B"
  ];

  // Procesar datos para estadísticas
  const estadisticas = React.useMemo(() => {
    if (!reporteData || !Array.isArray(reporteData)) {
      return {
        total_estudiantes: 0,
        promedio_asistencia: 0,
        dias_analizados: 0
      };
    }

    const estudiantesUnicos = new Set(reporteData.map(r => r.estudiante_id));
    const fechasUnicas = new Set(reporteData.map(r => r.asistencias?.fecha));
    const presentes = reporteData.filter(r => r.estado === 'presente').length;
    
    return {
      total_estudiantes: estudiantesUnicos.size,
      promedio_asistencia: reporteData.length > 0 ? (presentes / reporteData.length) * 100 : 0,
      dias_analizados: fechasUnicas.size
    };
  }, [reporteData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <FileTextIcon className="mr-2" />
            Reportes de Asistencia
          </h1>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FilterIcon className="mr-2 h-5 w-5" />
              Configurar Reporte
            </CardTitle>
            <CardDescription>
              Selecciona los criterios para generar el reporte de asistencia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Curso</label>
                <Select value={filtros.curso} onValueChange={(value) => setFiltros(prev => ({ ...prev, curso: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los cursos</SelectItem>
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
                    <SelectValue placeholder="Seleccionar asignatura" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las asignaturas</SelectItem>
                    {asignaturas?.map(asignatura => (
                      <SelectItem key={asignatura.id} value={asignatura.id.toString()}>
                        {asignatura.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Fecha Desde *</label>
                <Input 
                  type="date" 
                  value={filtros.fecha_desde}
                  onChange={(e) => setFiltros(prev => ({ ...prev, fecha_desde: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Fecha Hasta *</label>
                <Input 
                  type="date" 
                  value={filtros.fecha_hasta}
                  onChange={(e) => setFiltros(prev => ({ ...prev, fecha_hasta: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button 
                onClick={() => setFiltros({ curso: 'all', asignatura_id: 'all', fecha_desde: '', fecha_hasta: '' })}
                variant="outline"
              >
                Limpiar
              </Button>
              <Button disabled={!filtros.fecha_desde || !filtros.fecha_hasta}>
                <DownloadIcon className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        {filtros.fecha_desde && filtros.fecha_hasta && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{estadisticas.total_estudiantes}</div>
                <div className="text-sm text-gray-600">Total Estudiantes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{estadisticas.promedio_asistencia.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Promedio Asistencia</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">{estadisticas.dias_analizados}</div>
                <div className="text-sm text-gray-600">Días Analizados</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Datos del Reporte</CardTitle>
            <CardDescription>
              {filtros.fecha_desde && filtros.fecha_hasta 
                ? `Reporte generado para el período del ${filtros.fecha_desde} al ${filtros.fecha_hasta}. Total: ${estadisticas.total_estudiantes} estudiantes, Promedio: ${estadisticas.promedio_asistencia.toFixed(1)}%, Días: ${estadisticas.dias_analizados}`
                : "Selecciona un rango de fechas para generar el reporte"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Generando reporte...</p>
            ) : filtros.fecha_desde && filtros.fecha_hasta ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estudiante</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Asignatura</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Observación</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reporteData && reporteData.length > 0 ? (
                      reporteData.map((registro, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {registro.usuarios ? 
                              `${registro.usuarios.apellido}, ${registro.usuarios.nombre}` : 
                              'Sin datos'
                            }
                          </TableCell>
                          <TableCell>{registro.asistencias?.curso || 'N/A'}</TableCell>
                          <TableCell>{registro.asistencias?.asignaturas?.nombre || 'N/A'}</TableCell>
                          <TableCell>
                            {registro.asistencias?.fecha ? 
                              new Date(registro.asistencias.fecha).toLocaleDateString() : 
                              'N/A'
                            }
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              registro.estado === 'presente' ? 'bg-green-100 text-green-800' :
                              registro.estado === 'ausente' ? 'bg-red-100 text-red-800' :
                              registro.estado === 'tardanza' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {registro.estado}
                            </span>
                          </TableCell>
                          <TableCell>{registro.observacion || '-'}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                          No se encontraron datos para el período seleccionado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Selecciona las fechas de inicio y fin para generar el reporte
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AttendanceReports;
