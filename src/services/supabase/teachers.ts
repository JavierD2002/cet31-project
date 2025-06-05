
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

const mockCreateTeacher = async (data: any) => {
  console.warn('Supabase not configured: createTeacher called with mock implementation', data)
  return { id: Math.floor(Math.random() * 1000), ...data, created_at: new Date().toISOString() }
}

const mockUpdateTeacher = async (id: number, data: any) => {
  console.warn('Supabase not configured: updateTeacher called with mock implementation', id, data)
  return { id, ...data, updated_at: new Date().toISOString() }
}

const mockDeleteTeacher = async (id: number) => {
  console.warn('Supabase not configured: deleteTeacher called with mock implementation', id)
  return { id }
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
          docentes!inner (
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

export const createTeacher = isSupabaseConfigured
  ? async (data: {
      dni: string;
      nombre: string;
      apellido: string;
      email: string;
      especialidad: string;
    }) => {
      // First create user
      const { data: usuario, error: userError } = await supabase
        .from('usuarios')
        .insert({
          dni: data.dni,
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          rol: 'docente'
        })
        .select()
        .single()

      if (userError) throw userError

      // Then create teacher
      const { data: docente, error: teacherError } = await supabase
        .from('docentes')
        .insert({
          usuario_id: usuario.id,
          especialidad: data.especialidad
        })
        .select()
        .single()

      if (teacherError) throw teacherError

      return docente
    }
  : mockCreateTeacher

export const updateTeacher = isSupabaseConfigured
  ? async (id: number, data: {
      dni?: string;
      nombre?: string;
      apellido?: string;
      email?: string;
      especialidad?: string;
    }) => {
      // Get teacher with user info
      const { data: teacher, error: getError } = await supabase
        .from('docentes')
        .select('usuario_id')
        .eq('id', id)
        .single()

      if (getError) throw getError

      // Update user data if provided
      if (data.dni || data.nombre || data.apellido || data.email) {
        const userData: any = {}
        if (data.dni) userData.dni = data.dni
        if (data.nombre) userData.nombre = data.nombre
        if (data.apellido) userData.apellido = data.apellido
        if (data.email) userData.email = data.email

        const { error: userError } = await supabase
          .from('usuarios')
          .update(userData)
          .eq('id', teacher.usuario_id)

        if (userError) throw userError
      }

      // Update teacher data if provided
      if (data.especialidad) {
        const { data: updatedTeacher, error: teacherError } = await supabase
          .from('docentes')
          .update({ especialidad: data.especialidad })
          .eq('id', id)
          .select()
          .single()

        if (teacherError) throw teacherError
        return updatedTeacher
      }

      return { id }
    }
  : mockUpdateTeacher

export const deleteTeacher = isSupabaseConfigured
  ? async (id: number) => {
      // Get teacher with user info
      const { data: teacher, error: getError } = await supabase
        .from('docentes')
        .select('usuario_id')
        .eq('id', id)
        .single()

      if (getError) throw getError

      // Delete teacher first (due to foreign key)
      const { error: teacherError } = await supabase
        .from('docentes')
        .delete()
        .eq('id', id)

      if (teacherError) throw teacherError

      // Delete user
      const { error: userError } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', teacher.usuario_id)

      if (userError) throw userError

      return { id }
    }
  : mockDeleteTeacher
