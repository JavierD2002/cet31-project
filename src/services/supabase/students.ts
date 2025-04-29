
import { supabase, isSupabaseConfigured } from './client';

// Mock functions for when Supabase isn't configured
const mockGetStudents = async () => {
  console.warn('Supabase not configured: getStudents called with mock implementation')
  return [
    { id: 1, usuario_id: 201, nombre: "Acosta, María", dni: "45789123", curso: "1° Año A" },
    { id: 2, usuario_id: 202, nombre: "Benítez, Carlos", dni: "46123789", curso: "1° Año A" },
    { id: 3, usuario_id: 203, nombre: "Córdoba, Lucía", dni: "45987321", curso: "1° Año A" },
    { id: 4, usuario_id: 204, nombre: "Díaz, Mateo", dni: "46789123", curso: "1° Año A" },
    { id: 5, usuario_id: 205, nombre: "Espinoza, Valentina", dni: "45321789", curso: "1° Año A" }
  ]
}

const mockGetStudentProfile = async () => {
  console.warn('Supabase not configured: getStudentProfile called with mock implementation')
  return {
    id: 1,
    usuario: {
      id: 201,
      dni: "45789123",
      nombre: "María",
      apellido: "Acosta",
      email: "maria.acosta@estudiante.edu"
    },
    curso: "1° Año A",
    calificaciones: [
      { asignatura: "Matemática", trimestre1: 8, trimestre2: 9, trimestre3: null },
      { asignatura: "Lengua", trimestre1: 7, trimestre2: 8, trimestre3: null }
    ],
    asistencia: {
      presente: 45,
      ausente: 3,
      tardanza: 2,
      retirado: 0
    }
  }
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
          usuarios (
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
      return {
        id: data.id,
        usuario: {
          id: data.usuarios?.id,
          dni: data.usuarios?.dni || "",
          nombre: data.usuarios?.nombre || "",
          apellido: data.usuarios?.apellido || "",
          email: data.usuarios?.email || ""
        },
        curso: data.curso
      }
    }
  : mockGetStudentProfile

const mockGetStudentAbsences = async () => {
  console.warn('Supabase not configured: getStudentAbsences called with mock implementation')
  return []
}

export const getStudentAbsences = isSupabaseConfigured
  ? async (estudiante_id: number) => {
      const { data, error } = await supabase
        .from('asistencias_detalle')
        .select(`
          *,
          asistencias (
            fecha,
            asignatura_id,
            curso
          )
        `)
        .eq('estudiante_id', estudiante_id)
        .eq('estado', 'ausente')
        .order('hora_registro', { ascending: false })

      if (error) throw error
      return data
    }
  : mockGetStudentAbsences
