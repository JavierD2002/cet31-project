
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarIcon, FilterIcon, SearchIcon, DownloadIcon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
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
import { getAttendanceHistory, getTeachers, getSubjects } from '@/services/supabase';

const AttendanceHistory = () => {
  const [filtros, setFiltros] = useState({
    curso: 'all',
    profesor_id: 'all',
    asignatura_id: 'all',
    fecha_desde: '',
    fecha_hasta: ''
  });

  const { data: historial, isLoading } = useQuery({
    queryKey: ['attendanceHistory', filtros],
    queryFn: () => getAttendanceHistory({
      curso: filtros.curso && filtros.curso !== 'all' ? filtros.curso : undefined,
      profesor_id: filtros.profesor_id && filtros.profesor_id !== 'all' ? parseInt(filtros.profesor_id) : undefined,
      asignatura_id: filtros.asignatura_id && filtros.asignatura_id !== 'all' ? parseInt(filtros.asignatura_id) : undefined,
      fecha_desde: filtros.fecha_desde || undefined,
      fecha_hasta: filtros.fecha_hasta || undefined
    })
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm">Volver al inicio</span>
            </Link>
            <div className="h-6 w-px bg-blue-400"></div>
            <h1 className="text-2xl font-bold flex items-center">
              <CalendarIcon className="mr-2" />
              Historial de Asistencia
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Sistema de Gestión Escolar</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FilterIcon className="mr-2 h-5 w-5" />
              Filtros de Búsqueda
            </CardTitle>
            <CardDescription>
              Utiliza los filtros para encontrar registros específicos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Curso</label>
                <Select value={filtros.curso} onValueChange={(value) => setFiltros(prev => ({ ...prev, curso: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los cursos" />
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
                <label className="text-sm font-medium mb-2 block">Docente</label>
                <Select value={filtros.profesor_id} onValueChange={(value) => setFiltros(prev => ({ ...prev, profesor_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los docentes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los docentes</SelectItem>
                    {docentes?.map(docente => (
                      <SelectItem key={docente.id} value={docente.id.toString()}>
                        {docente.nombre}
                      </SelectItem>
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
              <Button onClick={() => setFiltros({ curso: 'all', profesor_id: 'all', asignatura_id: 'all', fecha_desde: '', fecha_hasta: '' })}>
                Limpiar Filtros
              </Button>
              <Button variant="outline">
                <DownloadIcon className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registros de Asistencia</CardTitle>
            <CardDescription>
              Historial completo de asistencias registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Cargando historial...</p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Asignatura</TableHead>
                      <TableHead>Docente</TableHead>
                      <TableHead>Presentes</TableHead>
                      <TableHead>Ausentes</TableHead>
                      <TableHead>Tardanzas</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historial && historial.length > 0 ? (
                      historial.map((registro, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(registro.fecha).toLocaleDateString()}</TableCell>
                          <TableCell>{registro.curso}</TableCell>
                          <TableCell>{registro.asignatura}</TableCell>
                          <TableCell>{registro.docente}</TableCell>
                          <TableCell className="text-green-600 font-medium">{registro.presentes}</TableCell>
                          <TableCell className="text-red-600 font-medium">{registro.ausentes}</TableCell>
                          <TableCell className="text-yellow-600 font-medium">{registro.tardanzas}</TableCell>
                          <TableCell>{registro.total}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                          No se encontraron registros con los filtros aplicados
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
    </div>
  );
};

export default AttendanceHistory;
