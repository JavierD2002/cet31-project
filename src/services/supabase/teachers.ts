
import { supabase, isSupabaseConfigured } from './client';

// Mock functions for when Supabase isn't configured
const mockGetTeachers = async () => {
  console.warn('Supabase not configured: getTeachers called with mock implementation')
  return [
    { id: 1, usuario_id: 101, nombre: "González, Juan", dni: "25789123", especialidad: "Matemática" },
    { id: 2, usuario_id: 102, nombre: "Rodríguez, Ana", dni: "26123789", especialidad: "Lengua" },
    { id: 3, usuario_id: 103, nombre: "Pérez, Carlos", dni: "25987321", especialidad: "Historia" },
    { id: 4, usuario_id: 104, nombre: "López, María", dni: "26789123", especialidad: "Geografía" },
    { id: 5, usuario_id: 105, nombre: "Martínez, José", dni: "25321789", especialidad: "Física" }
  ]
}

const mockGetTeacherProfile = async () => {
  console.warn('Supabase not configured: getTeacherProfile called with mock implementation')
  return {
    id: 1,
    usuario: {
      id: 101,
      dni: "25789123",
      nombre: "Juan",
      apellido: "González",
      email: "juan.gonzalez@docente.edu"
    },
    especialidad: "Matemática",
    cursos: ["1° Año A", "2° Año B", "3° Año A"],
    asignaturas: [
      { id: 1, nombre: "Matemática I", curso: "1° Año A" },
      { id: 2, nombre: "Matemática II", curso: "2° Año B" },
      { id: 3, nombre: "Matemática III", curso: "3° Año A" }
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
        especialidad: data.especialidad
      }
    }
  : mockGetTeacherProfile
