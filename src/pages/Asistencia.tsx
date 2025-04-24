
import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Check, X, Clock, User } from 'lucide-react';
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
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Datos de ejemplo para profesores y sus asignaturas
const mockTeachers = [
  { id: 1, nombre: "Prof. Martínez" },
  { id: 2, nombre: "Prof. García" },
  { id: 3, nombre: "Prof. López" }
];

// Datos de ejemplo para asignaturas
const mockAsignaturas = [
  { id: 1, nombre: "Matemáticas", profesorId: 1, cursos: ["1° Año A", "2° Año A"] },
  { id: 2, nombre: "Física", profesorId: 1, cursos: ["3° Año A"] },
  { id: 3, nombre: "Química", profesorId: 2, cursos: ["2° Año A", "3° Año B"] },
  { id: 4, nombre: "Literatura", profesorId: 3, cursos: ["1° Año A", "1° Año B"] }
];

// Datos de ejemplo para estudiantes
const mockStudents = [
  { id: 1, nombre: "Acosta, María", curso: "1° Año A" },
  { id: 2, nombre: "Benítez, Carlos", curso: "1° Año A" },
  { id: 3, nombre: "Córdoba, Lucía", curso: "1° Año A" },
  { id: 4, nombre: "Díaz, Mateo", curso: "1° Año A" },
  { id: 5, nombre: "Espinoza, Valentina", curso: "1° Año A" },
  { id: 6, nombre: "Fernández, Santiago", curso: "2° Año A" },
  { id: 7, nombre: "González, Camila", curso: "2° Año A" },
  { id: 8, nombre: "Hernández, Benjamín", curso: "3° Año A" },
  { id: 9, nombre: "Ibáñez, Sofía", curso: "3° Año A" },
  { id: 10, nombre: "Juárez, Nicolás", curso: "3° Año B" },
];

// Interfaz para el estado de asistencia
interface AttendanceStatus {
  status: 'presente' | 'ausente' | 'tardanza' | 'retirado';
  timestamp?: Date;
  observacion?: string;
}

const Asistencia = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<{[key: number]: AttendanceStatus}>({}); 
  const [observations, setObservations] = useState<{[key: number]: string}>({});
  
  // Obtener las asignaturas del profesor seleccionado
  const teacherSubjects = selectedTeacher 
    ? mockAsignaturas.filter(asignatura => asignatura.profesorId === selectedTeacher) 
    : [];
  
  // Obtener los cursos de la asignatura seleccionada
  const subjectCourses = selectedSubject 
    ? mockAsignaturas.find(asignatura => asignatura.id === selectedSubject)?.cursos || [] 
    : [];
  
  // Filtrar estudiantes por curso seleccionado
  const filteredStudents = selectedCourse 
    ? mockStudents.filter(student => student.curso === selectedCourse) 
    : [];
  
  // Función para formatear fecha como DD/MM/YYYY
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Función para formatear hora como HH:MM
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Función para manejar el día anterior
  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };
  
  // Función para manejar el día siguiente
  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };
  
  // Función para manejar el cambio de asistencia
  const handleAttendanceChange = (studentId: number, status: 'presente' | 'ausente' | 'tardanza' | 'retirado') => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        status,
        timestamp: status === 'retirado' ? new Date() : undefined,
        observacion: observations[studentId]
      }
    }));
  };
  
  // Función para manejar cambios en las observaciones
  const handleObservationChange = (studentId: number, value: string) => {
    setObservations(prev => ({
      ...prev,
      [studentId]: value
    }));
    
    // Si ya existe un registro de asistencia para este estudiante, actualizar la observación
    if (attendanceData[studentId]) {
      setAttendanceData(prev => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          observacion: value
        }
      }));
    }
  };
  
  // Función para guardar la asistencia
  const saveAttendance = () => {
    // En una implementación real, esto enviaría los datos a Supabase
    console.log("Guardando asistencia para:", formatDate(selectedDate));
    console.log("Profesor:", selectedTeacher);
    console.log("Asignatura:", selectedSubject);
    console.log("Curso:", selectedCourse);
    console.log("Datos de asistencia:", attendanceData);
    
    alert("Asistencia guardada correctamente. Cuando conectes Supabase, estos datos se almacenarán en la base de datos.");
    
    // Reset attendance data after saving
    setAttendanceData({});
    setObservations({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto">
          <Link to="/" className="text-blue-600 hover:underline flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver al inicio
          </Link>
        </div>
      </nav>
      
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Control de Asistencia</h2>
          <Link to="/asistencia/historial" className="text-blue-600 hover:underline text-sm">
            Ver historial de asistencia →
          </Link>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Registro de Asistencia</CardTitle>
            <CardDescription>
              Seleccione un profesor, asignatura y curso para registrar la asistencia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Selector de fecha */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha</label>
                <div className="flex items-center border rounded-md">
                  <button onClick={handlePreviousDay} className="p-2 hover:bg-gray-100 rounded-l-md">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-3 py-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    {formatDate(selectedDate)}
                  </span>
                  <button onClick={handleNextDay} className="p-2 hover:bg-gray-100 rounded-r-md">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Selector de profesor */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Profesor</label>
                <Select 
                  onValueChange={(value) => setSelectedTeacher(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar profesor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTeachers.map(teacher => (
                      <SelectItem key={teacher.id} value={teacher.id.toString()}>
                        {teacher.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Selector de asignatura */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Asignatura</label>
                <Select 
                  onValueChange={(value) => {
                    setSelectedSubject(Number(value));
                    setSelectedCourse(null); // Reset selected course when subject changes
                  }}
                  disabled={!selectedTeacher}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={!selectedTeacher ? "Primero seleccione un profesor" : "Seleccionar asignatura"} />
                  </SelectTrigger>
                  <SelectContent>
                    {teacherSubjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Selector de curso */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Curso</label>
                <Select 
                  onValueChange={(value) => setSelectedCourse(value)}
                  disabled={!selectedSubject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={!selectedSubject ? "Primero seleccione una asignatura" : "Seleccionar curso"} />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectCourses.map(course => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {selectedCourse ? (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8">#</TableHead>
                      <TableHead>Alumno</TableHead>
                      <TableHead className="w-20 text-center">Presente</TableHead>
                      <TableHead className="w-20 text-center">Ausente</TableHead>
                      <TableHead className="w-20 text-center">Tardanza</TableHead>
                      <TableHead className="w-20 text-center">Retirado</TableHead>
                      <TableHead className="w-32">Estado</TableHead>
                      <TableHead>Observaciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student, index) => (
                        <TableRow key={student.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <div className="font-medium flex items-center">
                              <User className="h-4 w-4 mr-2 text-gray-500" />
                              {student.nombre}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <button 
                              className={`rounded-full p-1 ${attendanceData[student.id]?.status === 'presente' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                              onClick={() => handleAttendanceChange(student.id, 'presente')}
                              title="Presente"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                          </TableCell>
                          <TableCell className="text-center">
                            <button 
                              className={`rounded-full p-1 ${attendanceData[student.id]?.status === 'ausente' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}
                              onClick={() => handleAttendanceChange(student.id, 'ausente')}
                              title="Ausente"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </TableCell>
                          <TableCell className="text-center">
                            <button 
                              className={`rounded-full p-1 ${attendanceData[student.id]?.status === 'tardanza' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}
                              onClick={() => handleAttendanceChange(student.id, 'tardanza')}
                              title="Tardanza"
                            >
                              <Clock className="h-5 w-5" />
                            </button>
                          </TableCell>
                          <TableCell className="text-center">
                            <button 
                              className={`rounded-full p-1 ${attendanceData[student.id]?.status === 'retirado' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}
                              onClick={() => handleAttendanceChange(student.id, 'retirado')}
                              title="Retirado"
                            >
                              <Calendar className="h-5 w-5" />
                            </button>
                          </TableCell>
                          <TableCell>
                            {attendanceData[student.id]?.status === 'retirado' && attendanceData[student.id]?.timestamp && (
                              <span className="text-xs text-blue-600">
                                Retirado a las {formatTime(attendanceData[student.id].timestamp!)}
                              </span>
                            )}
                            {attendanceData[student.id]?.status && attendanceData[student.id]?.status !== 'retirado' && (
                              <span className={`text-xs rounded-full px-2 py-0.5 ${
                                attendanceData[student.id]?.status === 'presente' ? 'bg-green-100 text-green-600' : 
                                attendanceData[student.id]?.status === 'ausente' ? 'bg-red-100 text-red-600' : 
                                'bg-yellow-100 text-yellow-600'
                              }`}>
                                {attendanceData[student.id]?.status.charAt(0).toUpperCase() + attendanceData[student.id]?.status.slice(1)}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Input 
                              placeholder="Observaciones"
                              className="text-sm"
                              value={observations[student.id] || ''}
                              onChange={(e) => handleObservationChange(student.id, e.target.value)}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No se encontraron alumnos para este curso
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-6 bg-gray-50 rounded-md border border-dashed">
                <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Seleccione un profesor, asignatura y curso para ver la lista de estudiantes</p>
              </div>
            )}
            
            {selectedCourse && filteredStudents.length > 0 && (
              <div className="mt-6 flex justify-end">
                <Button 
                  variant="default"
                  onClick={saveAttendance}
                  disabled={Object.keys(attendanceData).length === 0}
                >
                  Guardar Asistencia
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Asistencia;
