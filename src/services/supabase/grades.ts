
import { supabase } from './client';

export type GradePeriod = 'primer_trimestre' | 'segundo_trimestre' | 'tercer_trimestre';

export type Grade = {
  id: number;
  estudiante_id: number;
  asignatura_id: number;
  periodo: GradePeriod;
  nota: number;
  fecha_registro: string;
  observaciones: string | null;
  created_at: string;
};

export type GradeWithDetails = Grade & {
  estudiante_nombre: string;
  asignatura_nombre: string;
};

export type StudentGrades = {
  estudiante_id: number;
  estudiante_nombre: string;
  curso: string;
  asignatura_id: number;
  asignatura_nombre: string;
  primer_trimestre: number | null;
  segundo_trimestre: number | null;
  tercer_trimestre: number | null;
  promedio: number | null;
};

// Obtener calificaciones por curso y asignatura
export const getGradesByCourseAndSubject = async (curso: string, asignaturaId: number): Promise<StudentGrades[]> => {
  const { data, error } = await supabase
    .from('estudiantes')
    .select(`
      id,
      usuario_id,
      curso,
      usuarios!inner(
        id,
        nombre,
        apellido
      ),
      calificaciones!left(
        id,
        periodo,
        nota,
        asignatura_id
      )
    `)
    .eq('curso', curso)
    .eq('calificaciones.asignatura_id', asignaturaId);

  if (error) {
    console.error('Error fetching grades:', error);
    throw error;
  }

  // Obtener información de la asignatura
  const { data: asignatura, error: asignaturaError } = await supabase
    .from('asignaturas')
    .select('nombre')
    .eq('id', asignaturaId)
    .single();

  if (asignaturaError) {
    console.error('Error fetching subject:', asignaturaError);
    throw asignaturaError;
  }

  // Procesar los datos para el formato requerido
  return data.map((estudiante: any) => {
    const calificaciones = estudiante.calificaciones || [];
    const primer_trimestre = calificaciones.find((c: any) => c.periodo === 'primer_trimestre')?.nota || null;
    const segundo_trimestre = calificaciones.find((c: any) => c.periodo === 'segundo_trimestre')?.nota || null;
    const tercer_trimestre = calificaciones.find((c: any) => c.periodo === 'tercer_trimestre')?.nota || null;
    
    // Calcular promedio
    const notas = [primer_trimestre, segundo_trimestre, tercer_trimestre].filter(n => n !== null) as number[];
    const promedio = notas.length > 0 ? notas.reduce((a, b) => a + b, 0) / notas.length : null;

    return {
      estudiante_id: estudiante.id,
      estudiante_nombre: `${estudiante.usuarios.apellido}, ${estudiante.usuarios.nombre}`,
      curso: estudiante.curso,
      asignatura_id: asignaturaId,
      asignatura_nombre: asignatura.nombre,
      primer_trimestre,
      segundo_trimestre,
      tercer_trimestre,
      promedio: promedio ? Math.round(promedio * 10) / 10 : null
    };
  });
};

// Guardar o actualizar calificación
export const saveGrade = async (
  estudianteId: number,
  asignaturaId: number,
  periodo: GradePeriod,
  nota: number,
  observaciones?: string
) => {
  // Primero verificar si ya existe una calificación
  const { data: existing, error: searchError } = await supabase
    .from('calificaciones')
    .select('id')
    .eq('estudiante_id', estudianteId)
    .eq('asignatura_id', asignaturaId)
    .eq('periodo', periodo)
    .single();

  if (searchError && searchError.code !== 'PGRST116') {
    console.error('Error searching existing grade:', searchError);
    throw searchError;
  }

  const gradeData = {
    estudiante_id: estudianteId,
    asignatura_id: asignaturaId,
    periodo,
    nota,
    fecha_registro: new Date().toISOString().split('T')[0],
    observaciones: observaciones || null
  };

  if (existing) {
    // Actualizar calificación existente
    const { data, error } = await supabase
      .from('calificaciones')
      .update(gradeData)
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating grade:', error);
      throw error;
    }
    
    return data;
  } else {
    // Crear nueva calificación
    const { data, error } = await supabase
      .from('calificaciones')
      .insert(gradeData)
      .select()
      .single();

    if (error) {
      console.error('Error creating grade:', error);
      throw error;
    }
    
    return data;
  }
};

// Obtener calificaciones de un estudiante
export const getStudentGrades = async (estudianteId: number) => {
  const { data, error } = await supabase
    .from('calificaciones')
    .select(`
      *,
      asignaturas(
        nombre
      )
    `)
    .eq('estudiante_id', estudianteId)
    .order('asignatura_id', { ascending: true })
    .order('periodo', { ascending: true });

  if (error) {
    console.error('Error fetching student grades:', error);
    throw error;
  }

  return data;
};

// Obtener boletín de un estudiante
export const getStudentReport = async (estudianteId: number) => {
  const { data, error } = await supabase
    .from('estudiantes')
    .select(`
      *,
      usuarios(
        nombre,
        apellido,
        dni
      ),
      calificaciones(
        periodo,
        nota,
        asignaturas(
          nombre
        )
      )
    `)
    .eq('id', estudianteId)
    .single();

  if (error) {
    console.error('Error fetching student report:', error);
    throw error;
  }

  // Procesar datos para el boletín
  const materias: any = {};
  
  data.calificaciones.forEach((cal: any) => {
    const materia = cal.asignaturas.nombre;
    if (!materias[materia]) {
      materias[materia] = {
        asignatura: materia,
        primer_trimestre: null,
        segundo_trimestre: null,
        tercer_trimestre: null
      };
    }
    
    if (cal.periodo === 'primer_trimestre') materias[materia].primer_trimestre = cal.nota;
    if (cal.periodo === 'segundo_trimestre') materias[materia].segundo_trimestre = cal.nota;
    if (cal.periodo === 'tercer_trimestre') materias[materia].tercer_trimestre = cal.nota;
  });

  return {
    estudiante: {
      id: data.id,
      nombre: data.usuarios.nombre,
      apellido: data.usuarios.apellido,
      dni: data.usuarios.dni,
      curso: data.curso
    },
    calificaciones: Object.values(materias)
  };
};
