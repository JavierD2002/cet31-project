
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3Icon, FileTextIcon, DownloadIcon } from 'lucide-react';
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
import { getAttendanceReport, getSubjects } from '@/services/supabase';

const AttendanceReports = () => {
  const [filtros, setFiltros] = useState({
    curso: '',
    asignatura_id: '',
    fecha_desde: new Date().toISOString().split('T')[0],
    fecha_hasta: new Date().toISOString().split('T')[0]
  });

  const { data: reporte, isLoading } = useQuery({
    queryKey: ['attendanceReport', filtros],
    queryFn: () => getAttendanceReport({
      curso: filtros.curso || undefined,
      asignatura_id: filtros.asignatura_id ? parseInt(filtros.asignatura_id) : undefined,
      fecha_desde: filtros.fecha_desde,
      fecha_hasta: filtros.fecha_hasta
    })
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <BarChart3Icon className="mr-2" />
            Informes de Asistencia
          </h1>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileTextIcon className="mr-2 h-5 w-5" />
              Generar Informe
            </CardTitle>
            <CardDescription>
              Configura los parámetros para generar un informe de asistencia
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
                    <SelectItem value="">Todos los cursos</SelectItem>
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
                    <SelectItem value="">Todas las asignaturas</SelectItem>
                    {asignaturas?.map(asignatura => (
                      <SelectItem key={asignatura.id} value={asignatura.id.toString()}>
                        {asignatura.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
            </div>

            <div className="mt-4 flex gap-2">
              <Button>
                <FileTextIcon className="mr-2 h-4 w-4" />
                Generar Informe
              </Button>
              <Button variant="outline">
                <DownloadIcon className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {reporte && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total de Estudiantes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">{reporte.total_estudiantes}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Promedio de Asistencia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{reporte.promedio_asistencia}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Días Analizados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">{reporte.dias_analizados}</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Vista Previa del Informe</CardTitle>
            <CardDescription>
              Datos del período seleccionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Generando informe...</p>
            ) : reporte ? (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Resumen Ejecutivo</h3>
                  <p className="text-sm text-gray-600">
                    Período: {new Date(filtros.fecha_desde).toLocaleDateString()} - {new Date(filtros.fecha_hasta).toLocaleDateString()}
                  </p>
                  {filtros.curso && <p className="text-sm text-gray-600">Curso: {filtros.curso}</p>}
                  <p className="text-sm text-gray-600 mt-2">
                    Durante este período se registraron {reporte.total_estudiantes} estudiantes con un promedio de asistencia del {reporte.promedio_asistencia}% 
                    a lo largo de {reporte.dias_analizados} días de clase.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Configura los filtros y haz clic en "Generar Informe" para ver los resultados
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AttendanceReports;
