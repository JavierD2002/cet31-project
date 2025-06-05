
import { supabase, isSupabaseConfigured } from './client';

// Mock data para cuando Supabase no está configurado
const mockSubjects = [
  { 
    id: 1, 
    nombre: "Matemática", 
    curso: "1° Año A", 
    docente_id: 1,
    docente_nombre: "González, Juan",
    descripcion: "Matemática básica para primer año",
    carga_horaria: 4 
  },
  { 
    id: 2, 
    nombre: "Lengua", 
    curso: "1° Año A", 
    docente_id: 2,
    docente_nombre: "Rodríguez, Ana",
    descripcion: "Lengua y literatura",
    carga_horaria: 4 
  },
  { 
    id: 3, 
    nombre: "Historia", 
    curso: "2° Año B", 
    docente_id: 3,
    docente_nombre: "Pérez, Carlos",
    descripcion: "Historia argentina y universal",
    carga_horaria: 3 
  },
  { 
    id: 4, 
    nombre: "Geografía", 
    curso: "2° Año B", 
    docente_id: 4,
    docente_nombre: "López, María",
    descripcion: "Geografía física y humana",
    carga_horaria: 3 
  },
  { 
    id: 5, 
    nombre: "Física", 
    curso: "3° Año A", 
    docente_id: 5,
    docente_nombre: "Martínez, José",
    descripcion: "Física básica",
    carga_horaria: 4 
  }
];

const mockGetSubjects = async () => {
  console.warn('Supabase not configured: getSubjects called with mock implementation');
  return mockSubjects;
};

const mockCreateSubject = async (subject: any) => {
  console.warn('Supabase not configured: createSubject called with mock implementation');
  const newSubject = { 
    ...subject, 
    id: Math.max(...mockSubjects.map(s => s.id)) + 1,
    docente_nombre: mockSubjects.find(s => s.docente_id === subject.docente_id)?.docente_nombre || "Sin asignar"
  };
  mockSubjects.push(newSubject);
  return newSubject;
};

const mockUpdateSubject = async (id: number, updates: any) => {
  console.warn('Supabase not configured: updateSubject called with mock implementation');
  const index = mockSubjects.findIndex(s => s.id === id);
  if (index !== -1) {
    mockSubjects[index] = { 
      ...mockSubjects[index], 
      ...updates,
      docente_nombre: mockSubjects.find(s => s.docente_id === updates.docente_id)?.docente_nombre || mockSubjects[index].docente_nombre
    };
    return mockSubjects[index];
  }
  throw new Error('Asignatura no encontrada');
};

const mockDeleteSubject = async (id: number) => {
  console.warn('Supabase not configured: deleteSubject called with mock implementation');
  const index = mockSubjects.findIndex(s => s.id === id);
  if (index !== -1) {
    mockSubjects.splice(index, 1);
    return { success: true };
  }
  throw new Error('Asignatura no encontrada');
};

// Exportar funciones reales o mock según configuración
export const getSubjects = isSupabaseConfigured
  ? async () => {
      const { data, error } = await supabase
        .from('asignaturas')
        .select(`
          *,
          docentes (
            id,
            usuarios (
              nombre,
              apellido
            )
          )
        `)
        .order('curso', { ascending: true })
        .order('nombre', { ascending: true });

      if (error) throw error;
      
      return data?.map(asignatura => ({
        id: asignatura.id,
        nombre: asignatura.nombre,
        curso: asignatura.curso,
        docente_id: asignatura.docente_id,
        docente_nombre: asignatura.docentes?.usuarios ? 
          `${asignatura.docentes.usuarios.apellido}, ${asignatura.docentes.usuarios.nombre}` : 
          "Sin asignar",
        descripcion: asignatura.descripcion,
        carga_horaria: asignatura.carga_horaria
      })) || [];
    }
  : mockGetSubjects;

export const createSubject = isSupabaseConfigured
  ? async (subject: { nombre: string; curso: string; docente_id?: number; descripcion?: string; carga_horaria: number }) => {
      const { data, error } = await supabase
        .from('asignaturas')
        .insert([subject])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  : mockCreateSubject;

export const updateSubject = isSupabaseConfigured
  ? async (id: number, updates: Partial<{ nombre: string; curso: string; docente_id: number; descripcion: string; carga_horaria: number }>) => {
      const { data, error } = await supabase
        .from('asignaturas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  : mockUpdateSubject;

export const deleteSubject = isSupabaseConfigured
  ? async (id: number) => {
      const { error } = await supabase
        .from('asignaturas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    }
  : mockDeleteSubject;
