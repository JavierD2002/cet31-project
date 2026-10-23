
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { AttendanceStatus, Student, Subject, Teacher } from '@/types/attendance';
import { saveAttendance } from '@/services/supabase';

export const useAttendance = (
  teachers: Teacher[],
  subjects: Subject[],
  students: Student[]
) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<{[key: number]: AttendanceStatus}>({});
  const [observations, setObservations] = useState<{[key: number]: string}>({});

  const { toast } = useToast();

  const teacherSubjects = selectedTeacher 
    ? subjects.filter(asignatura => asignatura.profesorId === selectedTeacher) 
    : [];
  
  const subjectCourses = selectedSubject 
    ? subjects.find(asignatura => asignatura.id === selectedSubject)?.cursos || [] 
    : [];
  
  const filteredStudents = selectedCourse 
    ? students.filter(student => student.curso === selectedCourse) 
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

  const saveAttendanceData = async () => {
    if (!selectedTeacher || !selectedSubject || !selectedCourse) {
      toast({
        title: "Error",
        description: "Por favor, seleccione todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    try {
      const allowedStudents = new Set(filteredStudents.map(student => student.id));
      const detalles = Object.entries(attendanceData).filter(([studentId]) => allowedStudents.has(Number(studentId))).map(([studentId, data]) => ({
        estudiante_id: Number(studentId),
        estado: data.status,
        observacion: data.observacion,
      }));

      await saveAttendance(
        `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`, 
        selectedTeacher,
        selectedSubject,
        selectedCourse,
        detalles
      );

      toast({
        title: "Éxito",
        description: "La asistencia ha sido guardada correctamente",
      });

      setAttendanceData({});
      setObservations({});
    } catch (error) {
      console.error('Error al guardar la asistencia:', error);
      toast({
        title: "Error",
        description: "Hubo un error al guardar la asistencia",
        variant: "destructive",
      });
    }
  };

  return {
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
  };
};
