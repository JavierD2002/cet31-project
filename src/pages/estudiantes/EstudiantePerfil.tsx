
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import Footer from '@/components/Footer';
import { getStudentProfile } from '@/services/supabase';

import StudentProfileHeader from './components/StudentProfileHeader';
import StudentProfileCard from './components/StudentProfileCard';
import StudentTabs from './components/StudentTabs';
import StudentGradesTab from './components/StudentGradesTab';
import StudentAttendanceTab from './components/StudentAttendanceTab';
import StudentLoading from './components/StudentLoading';
import StudentNotFound from './components/StudentNotFound';

type CalificacionesPorMateria = {
  asignatura: string;
  trimestre1: number | null;
  trimestre2: number | null;
  trimestre3: number | null;
};

type EstadisticaAsistencia = {
  presente: number;
  ausente: number;
  tardanza: number;
  retirado: number;
};

type StudentProfile = {
  id: number;
  usuario: {
    id?: number;
    dni: string;
    nombre: string;
    apellido: string;
    email: string;
  };
  curso: string;
  calificaciones?: CalificacionesPorMateria[];
  asistencia?: EstadisticaAsistencia;
};

const EstudiantePerfil = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      
      try {
        const data = await getStudentProfile(parseInt(id));
        
        // En un entorno real, aquí deberíamos cargar también las calificaciones y la asistencia
        // Para la demo, usaremos datos de ejemplo
        const mockCalificaciones = [
          { asignatura: "Matemática", trimestre1: 8, trimestre2: 9, trimestre3: null },
          { asignatura: "Lengua", trimestre1: 7, trimestre2: 8, trimestre3: null },
          { asignatura: "Historia", trimestre1: 9, trimestre2: 9, trimestre3: null },
          { asignatura: "Geografía", trimestre1: 8, trimestre2: 7, trimestre3: null },
          { asignatura: "Física", trimestre1: 7, trimestre2: 8, trimestre3: null },
        ];
        
        const mockAsistencia = {
          presente: 45,
          ausente: 3,
          tardanza: 2,
          retirado: 0
        };
        
        setProfile({
          ...data,
          calificaciones: mockCalificaciones,
          asistencia: mockAsistencia
        });
      } catch (error) {
        console.error("Error al cargar perfil de estudiante:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar el perfil del estudiante",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, toast]);

  if (loading) {
    return <StudentLoading />;
  }

  if (!profile) {
    return <StudentNotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentProfileHeader />
      
      <main className="container mx-auto py-8 px-4">
        <StudentProfileCard profile={profile} />
        
        <StudentTabs
          gradesContent={<StudentGradesTab calificaciones={profile.calificaciones} />}
          attendanceContent={<StudentAttendanceTab asistencia={profile.asistencia} />}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default EstudiantePerfil;
