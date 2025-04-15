
import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';

// Mock data for students
const mockStudents = [
  { id: 1, nombre: "Acosta, María", curso: "1° Año A" },
  { id: 2, nombre: "Benítez, Carlos", curso: "1° Año A" },
  { id: 3, nombre: "Córdoba, Lucía", curso: "1° Año A" },
  { id: 4, nombre: "Díaz, Mateo", curso: "1° Año A" },
  { id: 5, nombre: "Espinoza, Valentina", curso: "1° Año A" },
  { id: 6, nombre: "Fernández, Santiago", curso: "1° Año A" },
  { id: 7, nombre: "González, Camila", curso: "1° Año A" },
  { id: 8, nombre: "Hernández, Benjamín", curso: "1° Año A" },
  { id: 9, nombre: "Ibáñez, Sofía", curso: "1° Año A" },
  { id: 10, nombre: "Juárez, Nicolás", curso: "1° Año A" },
];

const Asistencia = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCourse, setSelectedCourse] = useState("1° Año A");
  const [attendanceData, setAttendanceData] = useState<{[key: number]: string}>({}); 
  
  // Function to format date as DD/MM/YYYY
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Function to handle previous day
  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };
  
  // Function to handle next day
  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };
  
  // Function to handle attendance change
  const handleAttendanceChange = (studentId: number, status: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };
  
  // Function to save attendance
  const saveAttendance = () => {
    // In a real application, this would save to MySQL database
    console.log("Saving attendance for", formatDate(selectedDate), ":", attendanceData);
    alert("Asistencia guardada correctamente");
    // Reset attendance data after saving
    setAttendanceData({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - simplificado, similar al de Index */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sistema de Gestión Escolar</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Admin</span>
          </div>
        </div>
      </header>
      
      {/* Navigation - Simplificado, usando solo un enlace de regreso */}
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto">
          <Link to="/" className="text-blue-600 hover:underline flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver al inicio
          </Link>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Control de Asistencia</h2>
          <Link to="/asistencia/historial" className="text-blue-600 hover:underline text-sm">
            Ver historial de asistencia →
          </Link>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Registro de Asistencia Diaria</CardTitle>
            <CardDescription>
              Seleccione la fecha y curso para registrar la asistencia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div className="flex items-center border rounded-md">
                  <button onClick={handlePreviousDay} className="p-2 hover:bg-gray-100 rounded-l-md">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2">{formatDate(selectedDate)}</span>
                  <button onClick={handleNextDay} className="p-2 hover:bg-gray-100 rounded-r-md">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="1° Año A">1° Año A</option>
                  <option value="1° Año B">1° Año B</option>
                  <option value="2° Año A">2° Año A</option>
                  <option value="2° Año B">2° Año B</option>
                  <option value="3° Año A">3° Año A</option>
                  <option value="3° Año B">3° Año B</option>
                </select>
              </div>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Alumno</TableHead>
                    <TableHead className="w-32 text-center">Presente</TableHead>
                    <TableHead className="w-32 text-center">Ausente</TableHead>
                    <TableHead className="w-32 text-center">Tardanza</TableHead>
                    <TableHead className="w-48">Observaciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockStudents.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="font-medium">{student.nombre}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <button 
                          className={`rounded-full p-1 ${attendanceData[student.id] === 'presente' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                          onClick={() => handleAttendanceChange(student.id, 'presente')}
                        >
                          <Check className="h-5 w-5" />
                        </button>
                      </TableCell>
                      <TableCell className="text-center">
                        <button 
                          className={`rounded-full p-1 ${attendanceData[student.id] === 'ausente' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}
                          onClick={() => handleAttendanceChange(student.id, 'ausente')}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </TableCell>
                      <TableCell className="text-center">
                        <button 
                          className={`rounded-full p-1 ${attendanceData[student.id] === 'tardanza' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}
                          onClick={() => handleAttendanceChange(student.id, 'tardanza')}
                        >
                          <Calendar className="h-5 w-5" />
                        </button>
                      </TableCell>
                      <TableCell>
                        <Input 
                          placeholder="Observaciones"
                          className="text-sm"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                onClick={saveAttendance}
              >
                Guardar Asistencia
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      {/* Footer - mismo que en Index */}
      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto text-center text-sm">
          <p>&copy; 2025 Sistema de Gestión Escolar - Escuela Técnica de Río Negro</p>
        </div>
      </footer>
    </div>
  );
};

export default Asistencia;
