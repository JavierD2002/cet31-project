
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export const saveAttendance = async (
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

export const getAttendanceHistory = async () => {
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
