
import { supabase, isSupabaseConfigured } from './client';

// Mock functions for when Supabase isn't configured
const mockGetStudents = async () => {
  console.warn('Supabase not configured: getStudents called with mock implementation')
  return [
    { id: 1, usuario_id: 101, nombre: "García, Ana", dni: "45123456", curso: "1° Año A" },
    { id: 2, usuario_id: 102, nombre: "Martínez, Juan", dni: "45234567", curso: "1° Año A" },
    { id: 3, usuario_id: 103, nombre: "López, Pedro", dni: "45345678", curso: "2° Año B" },
    { id: 4, usuario_id: 104, nombre: "Rodríguez, Lucía", dni: "45456789", curso: "2° Año B" },
    { id: 5, usuario_id: 105, nombre: "Fernández, Sofía", dni: "45567890", curso: "3° Año A" }
  ]
}

const mockGetStudentProfile = async () => {
  console.warn('Supabase not configured: getStudentProfile called with mock implementation')
  return {
    id: 1,
    usuario: {
      id: 101,
      dni: "45123456",
      nombre: "Ana",
      apellido: "García",
      email: "ana.garcia@estudiante.edu"
    },
    curso: "1° Año A",
    asignaturas: [
      { id: 1, nombre: "Matemática", docente: "González, Juan" },
      { id: 2, nombre: "Lengua", docente: "Rodríguez, Ana" },
      { id: 3, nombre: "Historia", docente: "Pérez, Carlos" }
    ]
  }
}

const mockGetStudentAbsences = async () => {
  console.warn('Supabase not configured: getStudentAbsences called with mock implementation')
  return [
    { id: 1, fecha: "2025-03-15", estado: "ausente", justificada: false },
    { id: 2, fecha: "2025-04-02", estado: "tardanza", justificada: true },
    { id: 3, fecha: "2025-04-10", estado: "ausente", justificada: true }
  ]
}

// Export either real or mock functions depending on configuration
export const getStudents = isSupabaseConfigured
  ? async () => {
      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          id,
          dni,
          nombre,
          apellido,
          estudiantes (
            id,
            curso
          )
        `)
        .eq('rol', 'estudiante')

      if (error) throw error
      
      return data?.map(usuario => ({
        id: usuario.estudiantes?.[0]?.id || 0,
        usuario_id: usuario.id,
        dni: usuario.dni,
        nombre: `${usuario.apellido}, ${usuario.nombre}`,
        curso: usuario.estudiantes?.[0]?.curso || ""
      })) || []
    }
  : mockGetStudents

export const getStudentProfile = isSupabaseConfigured
  ? async (id: number) => {
      const { data, error } = await supabase
        .from('estudiantes')
        .select(`
          id,
          curso,
          usuarios!inner (
            id,
            dni,
            nombre,
            apellido,
            email
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      
      // Fix: Access data.usuarios as a single object, not an array
      const usuario = data.usuarios as any;
      return {
        id: data.id,
        usuario: {
          id: usuario?.id || 0,
          dni: usuario?.dni || "",
          nombre: usuario?.nombre || "",
          apellido: usuario?.apellido || "",
          email: usuario?.email || ""
        },
        curso: data.curso
      }
    }
  : mockGetStudentProfile

export const getStudentAbsences = isSupabaseConfigured
  ? async (id: number) => {
      const { data, error } = await supabase
        .from('asistencias')
        .select('*')
        .eq('estudiante_id', id)

      if (error) throw error
      return data || []
    }
  : mockGetStudentAbsences
