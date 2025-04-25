
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { getAttendanceHistory } from '@/services/supabase';

const AttendanceHistory = () => {
  const { data: attendanceHistory, isLoading, error } = useQuery({
    queryKey: ['attendanceHistory'],
    queryFn: getAttendanceHistory,
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
          <Link 
            to="/asistencia" 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Registrar Nueva Asistencia
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registros de Asistencia</CardTitle>
            <CardDescription>
              Historial completo de asistencias registradas
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
                        <TableCell>{registro.profesor_id}</TableCell>
                        <TableCell>{registro.asignatura_id}</TableCell>
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
