
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AttendanceHeader from '@/components/attendance/AttendanceHeader';
import AttendanceContent from '@/components/attendance/AttendanceContent';
import { useAttendance } from '@/hooks/useAttendance';

const mockTeachers = [
  { id: 1, nombre: "Prof. Martínez" },
  { id: 2, nombre: "Prof. García" },
  { id: 3, nombre: "Prof. López" }
];

const mockAsignaturas = [
  { id: 1, nombre: "Matemáticas", profesorId: 1, cursos: ["1° Año A", "2° Año A"] },
  { id: 2, nombre: "Física", profesorId: 1, cursos: ["3° Año A"] },
  { id: 3, nombre: "Química", profesorId: 2, cursos: ["2° Año A", "3° Año B"] },
  { id: 4, nombre: "Literatura", profesorId: 3, cursos: ["1° Año A", "1° Año B"] }
];

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

const Asistencia = () => {
  const {
    selectedDate,
    selectedTeacher,
    selectedSubject,
    selectedCourse,
    attendanceData,
    observations,
    teacherSubjects,
    subjectCourses,
    filteredStudents,
    formatDate,
    formatTime,
    handlePreviousDay,
    handleNextDay,
    handleAttendanceChange,
    handleObservationChange,
    setSelectedTeacher,
    setSelectedSubject,
    setSelectedCourse,
    saveAttendanceData
  } = useAttendance(mockTeachers, mockAsignaturas, mockStudents);

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
        
        <AttendanceContent 
          teachers={mockTeachers}
          teacherSubjects={teacherSubjects}
          subjectCourses={subjectCourses}
          filteredStudents={filteredStudents}
          selectedDate={selectedDate}
          selectedTeacher={selectedTeacher}
          selectedSubject={selectedSubject}
          selectedCourse={selectedCourse}
          attendanceData={attendanceData}
          observations={observations}
          formatDate={formatDate}
          formatTime={formatTime}
          onPreviousDay={handlePreviousDay}
          onNextDay={handleNextDay}
          onTeacherChange={(value) => setSelectedTeacher(Number(value))}
          onSubjectChange={(value) => {
            setSelectedSubject(Number(value));
            setSelectedCourse(null);
          }}
          onCourseChange={setSelectedCourse}
          onAttendanceChange={handleAttendanceChange}
          onObservationChange={handleObservationChange}
          onSave={saveAttendanceData}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Asistencia;
