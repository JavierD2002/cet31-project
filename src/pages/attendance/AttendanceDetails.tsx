
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAttendanceDetails, getStudentAbsences } from '@/services/supabase';
import AttendanceStatusBadge from '@/components/attendance/AttendanceStatusBadge';

const AttendanceDetails = () => {
  const { id } = useParams();

  const { data: attendance, isLoading } = useQuery({
    queryKey: ['attendance', id],
    queryFn: () => getAttendanceDetails(Number(id)),
    enabled: !!id
  });

  if (isLoading) return <div>Cargando...</div>;
  if (!attendance) return <div>No se encontró la asistencia</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto">
          <Link to="/asistencia/historial" className="text-blue-600 hover:underline flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver al historial
          </Link>
        </div>
      </nav>

      <main className="container mx-auto py-8 px-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Detalles de Asistencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Fecha</p>
                <p className="text-lg">{attendance.fecha}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Curso</p>
                <p className="text-lg">{attendance.curso}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Asignatura</p>
                <p className="text-lg">ID: {attendance.asignatura_id}</p>
              </div>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudiante ID</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Hora de Registro</TableHead>
                    <TableHead>Observaciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.asistencias_detalle.map((detalle: any) => (
                    <TableRow key={detalle.id}>
                      <TableCell>{detalle.estudiante_id}</TableCell>
                      <TableCell>
                        <AttendanceStatusBadge status={detalle.estado} />
                      </TableCell>
                      <TableCell>{new Date(detalle.hora_registro).toLocaleTimeString()}</TableCell>
                      <TableCell>{detalle.observacion || '-'}</TableCell>
                    </TableRow>
                  ))}
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

export default AttendanceDetails;
