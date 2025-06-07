
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Filter, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { getAttendanceHistory, getSubjects, getTeachers } from '@/services/supabase';

const AttendanceHistory = () => {
  const [filters, setFilters] = useState({
    curso: '',
    profesor_id: '',
    asignatura_id: '',
    fecha_desde: '',
    fecha_hasta: ''
  });

  const { data: attendanceHistory, isLoading, error } = useQuery({
    queryKey: ['attendanceHistory', filters],
    queryFn: () => getAttendanceHistory(filters),
  });

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjects,
  });

  const { data: teachers } = useQuery({
    queryKey: ['teachers'],
    queryFn: getTeachers,
  });

  const calculateStats = (details: any[]) => {
    return details.reduce(
      (acc, curr) => {
        acc[curr.estado]++;
        return acc;
      },
      { presente: 0, ausente: 0, tardanza: 0, retirado: 0 }
    );
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      curso: '',
      profesor_id: '',
      asignatura_id: '',
      fecha_desde: '',
      fecha_hasta: ''
    });
  };

  const cursos = ['1° Año A', '1° Año B', '2° Año A', '2° Año B', '3° Año A', '3° Año B'];

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar el historial</div>;

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
          <h2 className="text-2xl font-semibold">Historial de Asistencia</h2>
          <div className="flex gap-2">
            <Link 
              to="/asistencia/informes" 
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
            >
              <FileText className="h-4 w-4 mr-2" />
              Ver Informes
            </Link>
            <Link 
              to="/asistencia" 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Registrar Nueva
            </Link>
          </div>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtros
            </CardTitle>
            <CardDescription>
              Filtre los registros de asistencia por diferentes criterios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Curso</label>
                <Select value={filters.curso} onValueChange={(value) => handleFilterChange('curso', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
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
                <label className="text-sm font-medium">Profesor</label>
                <Select value={filters.profesor_id} onValueChange={(value) => handleFilterChange('profesor_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los profesores</SelectItem>
                    {teachers?.map(teacher => (
                      <SelectItem key={teacher.id} value={teacher.id.toString()}>
                        {teacher.nombre} {teacher.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Asignatura</label>
                <Select value={filters.asignatura_id} onValueChange={(value) => handleFilterChange('asignatura_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
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
                <label className="text-sm font-medium">Desde</label>
                <Input
                  type="date"
                  value={filters.fecha_desde}
                  onChange={(e) => handleFilterChange('fecha_desde', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Hasta</label>
                <Input
                  type="date"
                  value={filters.fecha_hasta}
                  onChange={(e) => handleFilterChange('fecha_hasta', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium opacity-0">Acciones</label>
                <Button onClick={clearFilters} variant="outline" className="w-full">
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registros de Asistencia</CardTitle>
            <CardDescription>
              {attendanceHistory?.length || 0} registros encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Fecha</TableHead>
                    <TableHead>Profesor</TableHead>
                    <TableHead>Asignatura</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead className="text-center">Presentes</TableHead>
                    <TableHead className="text-center">Ausentes</TableHead>
                    <TableHead className="text-center">Tardanzas</TableHead>
                    <TableHead className="text-center">Retirados</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceHistory?.map((registro) => {
                    const stats = calculateStats(registro.asistencias_detalle);
                    return (
                      <TableRow key={registro.id}>
                        <TableCell className="font-medium">{registro.fecha}</TableCell>
                        <TableCell>
                          {registro.usuarios?.nombre} {registro.usuarios?.apellido}
                        </TableCell>
                        <TableCell>{registro.asignaturas?.nombre}</TableCell>
                        <TableCell>{registro.curso}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="default" className="bg-green-500">{stats.presente}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="default" className="bg-red-500">{stats.ausente}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="default" className="bg-yellow-500">{stats.tardanza}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="default" className="bg-blue-500">{stats.retirado}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link 
                            to={`/asistencia/detalle/${registro.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            Ver detalle
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default AttendanceHistory;
