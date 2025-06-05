
import { supabase, isSupabaseConfigured } from './client';

// Mock data para cuando Supabase no está configurado
const mockClassrooms = [
  { 
    id: 1, 
    nombre: "Aula 101", 
    capacidad: 30, 
    ubicacion: "Planta Baja - Ala Norte",
    recursos: "Proyector, Pizarra Digital, WiFi",
    activa: true
  },
  { 
    id: 2, 
    nombre: "Aula 102", 
    capacidad: 25, 
    ubicacion: "Planta Baja - Ala Norte",
    recursos: "Pizarra, WiFi",
    activa: true
  },
  { 
    id: 3, 
    nombre: "Laboratorio de Ciencias", 
    capacidad: 20, 
    ubicacion: "Primer Piso - Ala Sur",
    recursos: "Microscopios, Material de laboratorio, Extractor de aire",
    activa: true
  },
  { 
    id: 4, 
    nombre: "Aula de Informática", 
    capacidad: 28, 
    ubicacion: "Primer Piso - Ala Norte",
    recursos: "30 Computadoras, Proyector, WiFi, Aire acondicionado",
    activa: true
  },
  { 
    id: 5, 
    nombre: "Salón de Música", 
    capacidad: 35, 
    ubicacion: "Segundo Piso - Ala Este",
    recursos: "Piano, Instrumentos musicales, Sistema de sonido",
    activa: false
  }
];

const mockGetClassrooms = async () => {
  console.warn('Supabase not configured: getClassrooms called with mock implementation');
  return mockClassrooms;
};

const mockCreateClassroom = async (classroom: any) => {
  console.warn('Supabase not configured: createClassroom called with mock implementation');
  const newClassroom = { 
    ...classroom, 
    id: Math.max(...mockClassrooms.map(c => c.id)) + 1,
    activa: classroom.activa ?? true
  };
  mockClassrooms.push(newClassroom);
  return newClassroom;
};

const mockUpdateClassroom = async (id: number, updates: any) => {
  console.warn('Supabase not configured: updateClassroom called with mock implementation');
  const index = mockClassrooms.findIndex(c => c.id === id);
  if (index !== -1) {
    mockClassrooms[index] = { ...mockClassrooms[index], ...updates };
    return mockClassrooms[index];
  }
  throw new Error('Aula no encontrada');
};

const mockDeleteClassroom = async (id: number) => {
  console.warn('Supabase not configured: deleteClassroom called with mock implementation');
  const index = mockClassrooms.findIndex(c => c.id === id);
  if (index !== -1) {
    mockClassrooms.splice(index, 1);
    return { success: true };
  }
  throw new Error('Aula no encontrada');
};

// Exportar funciones reales o mock según configuración
export const getClassrooms = isSupabaseConfigured
  ? async () => {
      const { data, error } = await supabase
        .from('aulas')
        .select('*')
        .order('nombre', { ascending: true });

      if (error) throw error;
      return data || [];
    }
  : mockGetClassrooms;

export const createClassroom = isSupabaseConfigured
  ? async (classroom: { nombre: string; capacidad: number; ubicacion: string; recursos?: string; activa?: boolean }) => {
      const { data, error } = await supabase
        .from('aulas')
        .insert([{ ...classroom, activa: classroom.activa ?? true }])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  : mockCreateClassroom;

export const updateClassroom = isSupabaseConfigured
  ? async (id: number, updates: Partial<{ nombre: string; capacidad: number; ubicacion: string; recursos: string; activa: boolean }>) => {
      const { data, error } = await supabase
        .from('aulas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  : mockUpdateClassroom;

export const deleteClassroom = isSupabaseConfigured
  ? async (id: number) => {
      const { error } = await supabase
        .from('aulas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    }
  : mockDeleteClassroom;
