import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AttendanceHeader from '@/components/attendance/AttendanceHeader';
import DateSelector from '@/components/attendance/DateSelector';
import AttendanceSelectors from '@/components/attendance/AttendanceSelectors';
import AttendanceTable from '@/components/attendance/AttendanceTable';
import { Teacher, Subject, Student, AttendanceStatus } from '@/types/attendance';

// Mock data
const mockTeachers: Teacher[] = [
  { id: 1, nombre: "Prof. Martínez" },
  { id: 2, nombre: "Prof. García" },
  { id: 3, nombre: "Prof. López" }
];

const mockAsignaturas: Subject[] = [
  { id: 1, nombre: "Matemáticas", profesorId: 1, cursos: ["1° Año A", "2° Año A"] },
  { id: 2, nombre: "Física", profesorId: 1, cursos: ["3° Año A"] },
  { id: 3, nombre: "Química", profesorId: 2, cursos: ["2° Año A", "3° Año B"] },
  { id: 4, nombre: "Literatura", profesorId: 3, cursos: ["1° Año A", "1° Año B"] }
];

const mockStudents: Student[] = [
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

const Asistencia = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<{[key: number]: AttendanceStatus}>({});
  const [observations, setObservations] = useState<{[key: number]: string}>({});

  const teacherSubjects = selectedTeacher 
    ? mockAsignaturas.filter(asignatura => asignatura.profesorId === selectedTeacher) 
    : [];
  
  const subjectCourses = selectedSubject 
    ? mockAsignaturas.find(asignatura => asignatura.id === selectedSubject)?.cursos || [] 
    : [];
  
  const filteredStudents = selectedCourse 
    ? mockStudents.filter(student => student.curso === selectedCourse) 
    : [];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

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

  const handleObservationChange = (studentId: number, value: string) => {
    setObservations(prev => ({
      ...prev,
      [studentId]: value
    }));
    
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

  const saveAttendance = () => {
    console.log("Guardando asistencia para:", formatDate(selectedDate));
    console.log("Profesor:", selectedTeacher);
    console.log("Asignatura:", selectedSubject);
    console.log("Curso:", selectedCourse);
    console.log("Datos de asistencia:", attendanceData);
    
    alert("Asistencia guardada correctamente. Cuando conectes Supabase, estos datos se almacenarán en la base de datos.");
    
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
        <AttendanceHeader />
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Registro de Asistencia</CardTitle>
            <CardDescription>
              Seleccione un profesor, asignatura y curso para registrar la asistencia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <DateSelector 
                selectedDate={selectedDate}
                onPreviousDay={handlePreviousDay}
                onNextDay={handleNextDay}
                formatDate={formatDate}
              />
              
              <AttendanceSelectors 
                teachers={mockTeachers}
                teacherSubjects={teacherSubjects}
                subjectCourses={subjectCourses}
                selectedTeacher={selectedTeacher}
                selectedSubject={selectedSubject}
                onTeacherChange={(value) => setSelectedTeacher(Number(value))}
                onSubjectChange={(value) => {
                  setSelectedSubject(Number(value));
                  setSelectedCourse(null);
                }}
                onCourseChange={(value) => setSelectedCourse(value)}
              />
            </div>
            
            {selectedCourse ? (
              <div className="border rounded-md overflow-hidden">
                <AttendanceTable 
                  students={filteredStudents}
                  attendanceData={attendanceData}
                  observations={observations}
                  onAttendanceChange={handleAttendanceChange}
                  onObservationChange={handleObservationChange}
                  formatTime={formatTime}
                />
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
