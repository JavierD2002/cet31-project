
import { supabase, isSupabaseConfigured } from './client';

// Mock functions for when Supabase isn't configured
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

const mockGetStudentAttendanceStats = async () => {
  console.warn('Supabase not configured: getStudentAttendanceStats called with mock implementation')
  return { presente: 0, ausente: 0, tardanza: 0, retirado: 0 }
}

const mockGetAttendanceReport = async () => {
  console.warn('Supabase not configured: getAttendanceReport called with mock implementation')
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
  ? async (filters?: {
      curso?: string
      profesor_id?: number
      asignatura_id?: number
      fecha_desde?: string
      fecha_hasta?: string
    }) => {
      let query = supabase
        .from('asistencias')
        .select(`
          *,
          asistencias_detalle (*),
          usuarios!asistencias_profesor_id_fkey (nombre, apellido),
          asignaturas (nombre)
        `)
        .order('fecha', { ascending: false })

      if (filters?.curso) {
        query = query.eq('curso', filters.curso)
      }
      if (filters?.profesor_id) {
        query = query.eq('profesor_id', filters.profesor_id)
      }
      if (filters?.asignatura_id) {
        query = query.eq('asignatura_id', filters.asignatura_id)
      }
      if (filters?.fecha_desde) {
        query = query.gte('fecha', filters.fecha_desde)
      }
      if (filters?.fecha_hasta) {
        query = query.lte('fecha', filters.fecha_hasta)
      }

      const { data, error } = await query

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
          asistencias_detalle (*,
            usuarios!asistencias_detalle_estudiante_id_fkey (nombre, apellido)
          ),
          usuarios!asistencias_profesor_id_fkey (nombre, apellido),
          asignaturas (nombre)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    }
  : mockGetAttendanceDetails

export const getStudentAttendanceStats = isSupabaseConfigured
  ? async (estudiante_id: number, periodo?: { desde: string, hasta: string }) => {
      let query = supabase
        .from('asistencias_detalle')
        .select('estado, asistencias!inner(fecha)')
        .eq('estudiante_id', estudiante_id)

      if (periodo) {
        query = query.gte('asistencias.fecha', periodo.desde)
                    .lte('asistencias.fecha', periodo.hasta)
      }

      const { data, error } = await query

      if (error) throw error

      const stats = data.reduce(
        (acc, curr) => {
          acc[curr.estado]++
          return acc
        },
        { presente: 0, ausente: 0, tardanza: 0, retirado: 0 }
      )

      return stats
    }
  : mockGetStudentAttendanceStats

export const getAttendanceReport = isSupabaseConfigured
  ? async (filters: {
      curso?: string
      asignatura_id?: number
      fecha_desde: string
      fecha_hasta: string
    }) => {
      const { data, error } = await supabase
        .from('asistencias_detalle')
        .select(`
          *,
          usuarios!asistencias_detalle_estudiante_id_fkey (nombre, apellido),
          asistencias!inner (fecha, curso, asignatura_id,
            asignaturas (nombre)
          )
        `)
        .gte('asistencias.fecha', filters.fecha_desde)
        .lte('asistencias.fecha', filters.fecha_hasta)
        .eq(filters.curso ? 'asistencias.curso' : '', filters.curso || '')
        .eq(filters.asignatura_id ? 'asistencias.asignatura_id' : '', filters.asignatura_id || '')
        .order('asistencias.fecha', { ascending: false })

      if (error) throw error
      return data
    }
  : mockGetAttendanceReport

export const getAbsentStudentsNotifications = isSupabaseConfigured
  ? async (fecha: string) => {
      const { data, error } = await supabase
        .from('asistencias_detalle')
        .select(`
          *,
          usuarios!asistencias_detalle_estudiante_id_fkey (nombre, apellido, email),
          asistencias!inner (fecha, curso, asignatura_id,
            asignaturas (nombre)
          )
        `)
        .eq('estado', 'ausente')
        .eq('asistencias.fecha', fecha)

      if (error) throw error
      return data
    }
  : async () => {
      console.warn('Supabase not configured: getAbsentStudentsNotifications called with mock implementation')
      return []
    }
