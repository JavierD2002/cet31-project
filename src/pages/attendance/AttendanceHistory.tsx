
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data for demonstration
const mockAttendanceHistory = [
  {
    id: 1,
    fecha: '25/04/2025',
    profesor: 'Prof. Martínez',
    asignatura: 'Matemáticas',
    curso: '1° Año A',
    presentes: 18,
    ausentes: 2,
    tardanzas: 1,
    retirados: 0
  },
  {
    id: 2,
    fecha: '24/04/2025',
    profesor: 'Prof. García',
    asignatura: 'Química',
    curso: '2° Año A',
    presentes: 20,
    ausentes: 1,
    tardanzas: 2,
    retirados: 1
  },
  {
    id: 3,
    fecha: '23/04/2025',
    profesor: 'Prof. López',
    asignatura: 'Literatura',
    curso: '1° Año B',
    presentes: 19,
    ausentes: 0,
    tardanzas: 3,
    retirados: 0
  },
];

const AttendanceHistory = () => {
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
                  {mockAttendanceHistory.map((registro) => (
                    <TableRow key={registro.id}>
                      <TableCell className="font-medium">{registro.fecha}</TableCell>
                      <TableCell>{registro.profesor}</TableCell>
                      <TableCell>{registro.asignatura}</TableCell>
                      <TableCell>{registro.curso}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="default" className="bg-green-500">{registro.presentes}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="default" className="bg-red-500">{registro.ausentes}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="default" className="bg-yellow-500">{registro.tardanzas}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="default" className="bg-blue-500">{registro.retirados}</Badge>
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

export default AttendanceHistory;
