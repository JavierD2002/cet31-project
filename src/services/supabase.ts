
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
