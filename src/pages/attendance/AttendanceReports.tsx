
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Download, Filter, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AttendanceStatusBadge from '@/components/attendance/AttendanceStatusBadge';
import { getAttendanceReport, getSubjects } from '@/services/supabase';

const AttendanceReports = () => {
  const [filters, setFilters] = useState({
    curso: '',
    asignatura_id: '',
    fecha_desde: '',
    fecha_hasta: ''
  });

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjects,
  });

  const { data: reportData, isLoading, refetch } = useQuery({
    queryKey: ['attendanceReport', filters],
    queryFn: () => getAttendanceReport(filters),
    enabled: !!(filters.fecha_desde && filters.fecha_hasta)
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generateReport = () => {
    if (filters.fecha_desde && filters.fecha_hasta) {
      refetch();
    }
  };

  const exportToPDF = () => {
    // Implementación futura para exportar a PDF
    console.log('Exportar a PDF:', reportData);
  };

  const cursos = ['1° Año A', '1° Año B', '2° Año A', '2° Año B', '3° Año A', '3° Año B'];

  const calculateStats = () => {
    if (!reportData) return { presente: 0, ausente: 0, tardanza: 0, retirado: 0 };
    
    return reportData.reduce(
      (acc, record) => {
        acc[record.estado]++;
        return acc;
      },
      { presente: 0, ausente: 0, tardanza: 0, retirado: 0 }
    );
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto">
          <Link to="/asistencia" className="text-blue-600 hover:underline flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver a Asistencia
          </Link>
        </div>
      </nav>

      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Informes de Asistencia</h2>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtros de Búsqueda
            </CardTitle>
            <CardDescription>
              Seleccione los criterios para generar el informe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha Desde</label>
                <Input
                  type="date"
                  value={filters.fecha_desde}
                  onChange={(e) => handleFilterChange('fecha_desde', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha Hasta</label>
                <Input
                  type="date"
                  value={filters.fecha_hasta}
                  onChange={(e) => handleFilterChange('fecha_hasta', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Curso</label>
                <Select onValueChange={(value) => handleFilterChange('curso', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los cursos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los cursos</SelectItem>
                    {cursos.map(curso => (
                      <SelectItem key={curso} value={curso}>{curso}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Asignatura</label>
                <Select onValueChange={(value) => handleFilterChange('asignatura_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las asignaturas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las asignaturas</SelectItem>
                    {subjects?.map(subject => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium opacity-0">Acciones</label>
                <Button onClick={generateReport} className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Generar Informe
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        {reportData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Presentes</p>
                    <p className="text-2xl font-bold text-green-600">{stats.presente}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Ausentes</p>
                    <p className="text-2xl font-bold text-red-600">{stats.ausente}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Tardanzas</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.tardanza}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Retirados</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.retirado}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Resultados */}
        {reportData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Resultados del Informe
                <Button onClick={exportToPDF} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
              </CardTitle>
              <CardDescription>
                {reportData.length} registros encontrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estudiante</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Asignatura</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Hora</TableHead>
                      <TableHead>Observaciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.map((record: any) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.asistencias.fecha}</TableCell>
                        <TableCell>
                          {record.usuarios?.nombre} {record.usuarios?.apellido}
                        </TableCell>
                        <TableCell>{record.asistencias.curso}</TableCell>
                        <TableCell>{record.asistencias.asignaturas?.nombre}</TableCell>
                        <TableCell>
                          <AttendanceStatusBadge status={record.estado} />
                        </TableCell>
                        <TableCell>
                          {new Date(record.hora_registro).toLocaleTimeString()}
                        </TableCell>
                        <TableCell>{record.observacion || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <p>Generando informe...</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default AttendanceReports;
