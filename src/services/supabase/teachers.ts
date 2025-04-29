
import { supabase, isSupabaseConfigured } from './client';

// Mock functions for when Supabase isn't configured
const mockGetTeachers = async () => {
  console.warn('Supabase not configured: getTeachers called with mock implementation')
  return [
    { id: 1, usuario_id: 101, nombre: "Ana García", dni: "25789456", especialidad: "Matemática" },
    { id: 2, usuario_id: 102, nombre: "Luis Rodríguez", dni: "30458123", especialidad: "Historia" }
  ]
}

const mockGetTeacherProfile = async () => {
  console.warn('Supabase not configured: getTeacherProfile called with mock implementation')
  return {
    id: 1,
    usuario: {
      id: 101,
      dni: "25789456",
      nombre: "Ana",
      apellido: "García",
      email: "ana.garcia@escuela.edu"
    },
    especialidad: "Matemática",
    asignaturas: [
      { id: 1, nombre: "Matemática", cursos: ["1° Año A", "2° Año A"] },
      { id: 2, nombre: "Física", cursos: ["3° Año A"] }
    ]
  }
}

// Export either real or mock functions depending on configuration
export const getTeachers = isSupabaseConfigured
  ? async () => {
      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          id,
          dni,
          nombre,
          apellido,
          docentes (
            id,
            especialidad
          )
        `)
        .eq('rol', 'docente')

      if (error) throw error
      
      return data?.map(usuario => ({
        id: usuario.docentes?.[0]?.id || 0,
        usuario_id: usuario.id,
        dni: usuario.dni,
        nombre: `${usuario.apellido}, ${usuario.nombre}`,
        especialidad: usuario.docentes?.[0]?.especialidad || ""
      })) || []
    }
  : mockGetTeachers

export const getTeacherProfile = isSupabaseConfigured
  ? async (id: number) => {
      const { data, error } = await supabase
        .from('docentes')
        .select(`
          id,
          especialidad,
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
        usuario: data.usuarios
          ? {
              id: data.usuarios.id,
              dni: data.usuarios.dni || "",
              nombre: data.usuarios.nombre || "",
              apellido: data.usuarios.apellido || "",
              email: data.usuarios.email || ""
            }
          : { id: 0, dni: "", nombre: "", apellido: "", email: "" },
        especialidad: data.especialidad
      }
    }
  : mockGetTeacherProfile
