
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// Default to empty strings if environment variables are not available
// This will prevent runtime errors, but Supabase functions won't work until proper values are provided
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl !== 'https://placeholder-url.supabase.co' && supabaseKey !== 'placeholder-key'

// Mock functions to use when Supabase isn't configured
const mockSaveAttendance = async (...args: any[]) => {
  console.warn('Supabase not configured: saveAttendance called with mock implementation', args)
  return { id: Math.floor(Math.random() * 1000), created_at: new Date().toISOString() }
}

const mockGetAttendanceHistory = async () => {
  console.warn('Supabase not configured: getAttendanceHistory called with mock implementation')
  return []
}

const mockGetAttendanceDetails = async () => {
  console.warn('Supabase not configured: getAttendanceDetails called with mock implementation')
  return { asistencias_detalle: [] }
}

const mockGetStudentAbsences = async () => {
  console.warn('Supabase not configured: getStudentAbsences called with mock implementation')
  return []
}

const mockGetTeachers = async () => {
  console.warn('Supabase not configured: getTeachers called with mock implementation')
  return [
    { id: 1, usuario_id: 101, nombre: "Ana García", dni: "25789456", especialidad: "Matemática" },
    { id: 2, usuario_id: 102, nombre: "Luis Rodríguez", dni: "30458123", especialidad: "Historia" }
  ]
}

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

// Función para roles mock - para autenticación
export const getMockUsers = async () => {
  return [
    { 
      id: 1, 
      dni: "11111111", 
      nombre: "Admin", 
      apellido: "Sistema", 
      email: "admin@escuela.edu", 
      rol: "administrador" 
    },
    { 
      id: 2, 
      dni: "22222222", 
      nombre: "Director", 
      apellido: "Escuela", 
      email: "director@escuela.edu", 
      rol: "directivo" 
    },
    { 
      id: 101, 
      dni: "25789456", 
      nombre: "Ana", 
      apellido: "García", 
      email: "ana.garcia@escuela.edu", 
      rol: "docente" 
    },
    { 
      id: 201, 
      dni: "45789123", 
      nombre: "María", 
      apellido: "Acosta", 
      email: "maria.acosta@estudiante.edu", 
      rol: "estudiante" 
    }
  ]
}

// Export either real or mock functions depending on configuration
export const saveAttendance = isSupabaseConfigured 
  ? async (
      fecha: string,
      profesor_id: number,
      asignatura_id: number,
      curso: string,
      detalles: {
        estudiante_id: number
        estado: 'presente' | 'ausente' | 'tardanza' | 'retirado'
        observacion?: string
      }[]
    ) => {
      const { data: asistencia, error: asistenciaError } = await supabase
        .from('asistencias')
        .insert({
          fecha,
          profesor_id,
          asignatura_id,
          curso,
        })
        .select()
        .single()

      if (asistenciaError) throw asistenciaError
      if (!asistencia) throw new Error('No se pudo crear la asistencia')

      const detallesConId = detalles.map(detalle => ({
        ...detalle,
        asistencia_id: asistencia.id,
        hora_registro: new Date().toISOString(),
      }))

      const { error: detallesError } = await supabase
        .from('asistencias_detalle')
        .insert(detallesConId)

      if (detallesError) throw detallesError

      return asistencia
    }
  : mockSaveAttendance

export const getAttendanceHistory = isSupabaseConfigured
  ? async () => {
      const { data, error } = await supabase
        .from('asistencias')
        .select(`
          *,
          asistencias_detalle (*)
        `)
        .order('fecha', { ascending: false })

      if (error) throw error
      return data
    }
  : mockGetAttendanceHistory

export const getAttendanceDetails = isSupabaseConfigured
  ? async (id: number) => {
      const { data, error } = await supabase
        .from('asistencias')
        .select(`
          *,
          asistencias_detalle (*)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    }
  : mockGetAttendanceDetails

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

// Nuevas funciones para docentes
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
          : { id: 0, dni: "", nombre: "", apellido: "", email: "" }
        ,
        especialidad: data.especialidad
      }
    }
  : mockGetTeacherProfile

// Nuevas funciones para estudiantes
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
        usuario: data.usuarios 
          ? {
              id: data.usuarios.id,
              dni: data.usuarios.dni || "",
              nombre: data.usuarios.nombre || "",
              apellido: data.usuarios.apellido || "",
              email: data.usuarios.email || ""
            }
          : { id: 0, dni: "", nombre: "", apellido: "", email: "" }
        ,
        curso: data.curso
      }
    }
  : mockGetStudentProfile
