
import { supabase, isSupabaseConfigured } from './client';

// Mock data para cuando Supabase no está configurado
const mockTopics = [
  { 
    id: 1, 
    fecha: '2025-06-07', 
    curso: '3° Año A', 
    asignatura_id: 1,
    asignatura_nombre: 'Matemática', 
    docente_id: 1,
    docente_nombre: 'López, María', 
    tema: 'Ecuaciones de segundo grado', 
    contenido: 'Resolución de ecuaciones cuadráticas utilizando fórmula general',
    actividad: 'Resolución de ejercicios prácticos del libro páginas 45-50',
    recursos: 'Pizarra, calculadora, libro de texto',
    tarea: 'Ejercicios 15 al 25 página 52',
    evaluacion: 'Evaluación diagnóstica oral',
    observaciones: 'Se tomó evaluación diagnóstica - buen nivel general',
    planificado: true,
    estado: 'completado'
  },
  { 
    id: 2, 
    fecha: '2025-06-08', 
    curso: '2° Año B', 
    asignatura_id: 2,
    asignatura_nombre: 'Historia', 
    docente_id: 2,
    docente_nombre: 'Rodríguez, Juan', 
    tema: 'Revolución Industrial', 
    contenido: 'Causas y consecuencias de la Revolución Industrial en Europa',
    actividad: 'Análisis de fuentes históricas y debate grupal',
    recursos: 'Proyector, documentos históricos, videos educativos',
    tarea: 'Investigar sobre inventos de la época',
    evaluacion: '',
    observaciones: 'Excelente participación de los estudiantes',
    planificado: true,
    estado: 'completado'
  }
];

const mockGetTopics = async () => {
  console.warn('Supabase not configured: getTopics called with mock implementation');
  return mockTopics;
};

const mockCreateTopic = async (topic: any) => {
  console.warn('Supabase not configured: createTopic called with mock implementation');
  const newTopic = { 
    ...topic, 
    id: Math.max(...mockTopics.map(t => t.id)) + 1,
    created_at: new Date().toISOString()
  };
  mockTopics.push(newTopic);
  return newTopic;
};

const mockUpdateTopic = async (id: number, updates: any) => {
  console.warn('Supabase not configured: updateTopic called with mock implementation');
  const index = mockTopics.findIndex(t => t.id === id);
  if (index !== -1) {
    mockTopics[index] = { ...mockTopics[index], ...updates };
    return mockTopics[index];
  }
  throw new Error('Tema no encontrado');
};

const mockDeleteTopic = async (id: number) => {
  console.warn('Supabase not configured: deleteTopic called with mock implementation');
  const index = mockTopics.findIndex(t => t.id === id);
  if (index !== -1) {
    mockTopics.splice(index, 1);
    return { success: true };
  }
  throw new Error('Tema no encontrado');
};

// Exportar funciones reales o mock según configuración
export const getTopics = isSupabaseConfigured
  ? async (filters?: { curso?: string; asignatura_id?: number; docente_id?: number; fecha_desde?: string; fecha_hasta?: string }) => {
      let query = supabase
        .from('libro_temas')
        .select(`
          *,
          asignaturas (
            nombre
          ),
          docentes (
            usuarios (
              nombre,
              apellido
            )
          )
        `)
        .order('fecha', { ascending: false });

      if (filters?.curso) {
        query = query.eq('curso', filters.curso);
      }
      if (filters?.asignatura_id) {
        query = query.eq('asignatura_id', filters.asignatura_id);
      }
      if (filters?.docente_id) {
        query = query.eq('docente_id', filters.docente_id);
      }
      if (filters?.fecha_desde) {
        query = query.gte('fecha', filters.fecha_desde);
      }
      if (filters?.fecha_hasta) {
        query = query.lte('fecha', filters.fecha_hasta);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      return data?.map(tema => ({
        ...tema,
        asignatura_nombre: tema.asignaturas?.nombre || '',
        docente_nombre: tema.docentes?.usuarios ? 
          `${tema.docentes.usuarios.apellido}, ${tema.docentes.usuarios.nombre}` : 
          "Sin asignar"
      })) || [];
    }
  : mockGetTopics;

export const createTopic = isSupabaseConfigured
  ? async (topic: {
      fecha: string;
      curso: string;
      asignatura_id: number;
      docente_id: number;
      tema: string;
      contenido: string;
      actividad: string;
      recursos?: string;
      tarea?: string;
      evaluacion?: string;
      observaciones?: string;
      planificado?: boolean;
      estado?: string;
    }) => {
      const { data, error } = await supabase
        .from('libro_temas')
        .insert([topic])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  : mockCreateTopic;

export const updateTopic = isSupabaseConfigured
  ? async (id: number, updates: any) => {
      const { data, error } = await supabase
        .from('libro_temas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  : mockUpdateTopic;

export const deleteTopic = isSupabaseConfigured
  ? async (id: number) => {
      const { error } = await supabase
        .from('libro_temas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    }
  : mockDeleteTopic;
