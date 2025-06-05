
import { supabase, isSupabaseConfigured } from './client';

// Mock functions for when Supabase isn't configured
const mockGetStudents = async () => {
  console.warn('Supabase not configured: getStudents called with mock implementation')
  return [
    { id: 1, usuario_id: 201, dni: "45123789", nombre: "Pérez, Ana", curso: "1° Año A" },
    { id: 2, usuario_id: 202, dni: "46789123", nombre: "García, Luis", curso: "1° Año B" },
    { id: 3, usuario_id: 203, dni: "45987321", nombre: "Martínez, Sofia", curso: "2° Año A" },
    { id: 4, usuario_id: 204, dni: "46123789", nombre: "López, Carlos", curso: "2° Año B" },
    { id: 5, usuario_id: 205, dni: "45321789", nombre: "Rodríguez, María", curso: "3° Año A" },
    { id: 6, usuario_id: 206, dni: "46987321", nombre: "González, Pedro", curso: "3° Año B" }
  ]
}

const mockGetStudentProfile = async () => {
  console.warn('Supabase not configured: getStudentProfile called with mock implementation')
  return {
    id: 1,
    usuario: {
      id: 201,
      dni: "45123789",
      nombre: "Ana",
      apellido: "Pérez",
      email: "ana.perez@estudiante.edu"
    },
    curso: "1° Año A"
  }
}

const mockGetStudentAbsences = async () => {
  console.warn('Supabase not configured: getStudentAbsences called with mock implementation')
  return []
}

const mockCreateStudent = async (data: any) => {
  console.warn('Supabase not configured: createStudent called with mock implementation', data)
  return { id: Math.floor(Math.random() * 1000), ...data, created_at: new Date().toISOString() }
}

const mockUpdateStudent = async (id: number, data: any) => {
  console.warn('Supabase not configured: updateStudent called with mock implementation', id, data)
  return { id, ...data, updated_at: new Date().toISOString() }
}

const mockDeleteStudent = async (id: number) => {
  console.warn('Supabase not configured: deleteStudent called with mock implementation', id)
  return { id }
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
          estudiantes!inner (
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
  ? async (studentId: number) => {
      const { data, error } = await supabase
        .from('asistencias_detalle')
        .select('*')
        .eq('estudiante_id', studentId)
        .eq('estado', 'ausente')

      if (error) throw error
      return data || []
    }
  : mockGetStudentAbsences

export const createStudent = isSupabaseConfigured
  ? async (data: {
      dni: string;
      nombre: string;
      apellido: string;
      email: string;
      curso: string;
    }) => {
      // First create user
      const { data: usuario, error: userError } = await supabase
        .from('usuarios')
        .insert({
          dni: data.dni,
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          rol: 'estudiante'
        })
        .select()
        .single()

      if (userError) throw userError

      // Then create student
      const { data: estudiante, error: studentError } = await supabase
        .from('estudiantes')
        .insert({
          usuario_id: usuario.id,
          curso: data.curso
        })
        .select()
        .single()

      if (studentError) throw studentError

      return estudiante
    }
  : mockCreateStudent

export const updateStudent = isSupabaseConfigured
  ? async (id: number, data: {
      dni?: string;
      nombre?: string;
      apellido?: string;
      email?: string;
      curso?: string;
    }) => {
      // Get student with user info
      const { data: student, error: getError } = await supabase
        .from('estudiantes')
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
          .eq('id', student.usuario_id)

        if (userError) throw userError
      }

      // Update student data if provided
      if (data.curso) {
        const { data: updatedStudent, error: studentError } = await supabase
          .from('estudiantes')
          .update({ curso: data.curso })
          .eq('id', id)
          .select()
          .single()

        if (studentError) throw studentError
        return updatedStudent
      }

      return { id }
    }
  : mockUpdateStudent

export const deleteStudent = isSupabaseConfigured
  ? async (id: number) => {
      // Get student with user info
      const { data: student, error: getError } = await supabase
        .from('estudiantes')
        .select('usuario_id')
        .eq('id', id)
        .single()

      if (getError) throw getError

      // Delete student first (due to foreign key)
      const { error: studentError } = await supabase
        .from('estudiantes')
        .delete()
        .eq('id', id)

      if (studentError) throw studentError

      // Delete user
      const { error: userError } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', student.usuario_id)

      if (userError) throw userError

      return { id }
    }
  : mockDeleteStudent
