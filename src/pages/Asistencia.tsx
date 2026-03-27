
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AttendanceHeader from '@/components/attendance/AttendanceHeader';
import AttendanceContent from '@/components/attendance/AttendanceContent';
import { useAttendance } from '@/hooks/useAttendance';
import { supabase } from '@/integrations/supabase/client';
import { Teacher, Subject, Student } from '@/types/attendance';

const Asistencia = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch docentes with their usuario data
        const { data: docentesData } = await supabase
          .from('docentes')
          .select('id, usuario_id, usuarios!docentes_usuario_id_fkey(id, nombre, apellido)');

        // Fetch asignaturas with docente_id
        const { data: asignaturasData } = await supabase
          .from('asignaturas')
          .select('id, nombre, curso, docente_id');

        // Fetch estudiantes with usuario data
        const { data: estudiantesData } = await supabase
          .from('estudiantes')
          .select('id, curso, usuario_id, usuarios!estudiantes_usuario_id_fkey(nombre, apellido)');

        // Map docentes: use usuario_id as the teacher id (since asistencias.profesor_id references usuarios.id)
        const teachersList: Teacher[] = (docentesData || []).map((d: any) => ({
          id: d.usuario_id,
          nombre: `Prof. ${d.usuarios?.apellido || ''}, ${d.usuarios?.nombre || ''}`,
        }));

        // Map asignaturas: group courses by subject+docente, using usuario_id for profesorId
        // First, build a map from docente.id -> usuario_id
        const docenteToUsuario: Record<number, number> = {};
        (docentesData || []).forEach((d: any) => {
          docenteToUsuario[d.id] = d.usuario_id;
        });

        // Group asignaturas by nombre+docente_id to collect all cursos
        const subjectMap = new Map<string, Subject>();
        (asignaturasData || []).forEach((a: any) => {
          const usuarioId = a.docente_id ? docenteToUsuario[a.docente_id] : null;
          const key = `${a.nombre}-${usuarioId}`;
          if (subjectMap.has(key)) {
            subjectMap.get(key)!.cursos.push(a.curso);
          } else {
            subjectMap.set(key, {
              id: a.id,
              nombre: a.nombre,
              profesorId: usuarioId || 0,
              cursos: [a.curso],
            });
          }
        });
        const subjectsList = Array.from(subjectMap.values());

        // Map estudiantes
        const studentsList: Student[] = (estudiantesData || []).map((e: any) => ({
          id: e.usuario_id,
          nombre: `${e.usuarios?.apellido || ''}, ${e.usuarios?.nombre || ''}`,
          curso: e.curso,
        }));

        setTeachers(teachersList);
        setSubjects(subjectsList);
        setStudents(studentsList);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
  } = useAttendance(teachers, subjects, students);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <p>Cargando datos...</p>
        </main>
        <Footer />
      </div>
    );
  }

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
          teachers={teachers}
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
