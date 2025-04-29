
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'estudiante' | 'docente' | 'directivo' | 'administrador';

export interface Database {
  public: {
    Tables: {
      asistencias: {
        Row: {
          id: number
          fecha: string
          profesor_id: number
          asignatura_id: number
          curso: string
          created_at: string
        }
        Insert: {
          id?: number
          fecha: string
          profesor_id: number
          asignatura_id: number
          curso: string
          created_at?: string
        }
        Update: {
          id?: number
          fecha?: string
          profesor_id?: number
          asignatura_id?: number
          curso?: string
          created_at?: string
        }
      }
      asistencias_detalle: {
        Row: {
          id: number
          asistencia_id: number
          estudiante_id: number
          estado: 'presente' | 'ausente' | 'tardanza' | 'retirado'
          hora_registro: string
          observacion: string | null
          created_at: string
        }
        Insert: {
          id?: number
          asistencia_id: number
          estudiante_id: number
          estado: 'presente' | 'ausente' | 'tardanza' | 'retirado'
          hora_registro: string
          observacion?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          asistencia_id?: number
          estudiante_id?: number
          estado?: 'presente' | 'ausente' | 'tardanza' | 'retirado'
          hora_registro?: string
          observacion?: string | null
          created_at?: string
        }
      }
      usuarios: {
        Row: {
          id: number
          dni: string
          nombre: string
          apellido: string
          email: string
          rol: UserRole
          created_at: string
        }
        Insert: {
          id?: number
          dni: string
          nombre: string
          apellido: string
          email: string
          rol: UserRole
          created_at?: string
        }
        Update: {
          id?: number
          dni?: string
          nombre?: string
          apellido?: string
          email?: string
          rol?: UserRole
          created_at?: string
        }
      }
      estudiantes: {
        Row: {
          id: number
          usuario_id: number
          curso: string
          created_at: string
        }
        Insert: {
          id?: number
          usuario_id: number
          curso: string
          created_at?: string
        }
        Update: {
          id?: number
          usuario_id?: number
          curso?: string
          created_at?: string
        }
      }
      docentes: {
        Row: {
          id: number
          usuario_id: number
          especialidad: string
          created_at: string
        }
        Insert: {
          id?: number
          usuario_id: number
          especialidad: string
          created_at?: string
        }
        Update: {
          id?: number
          usuario_id?: number
          especialidad?: string
          created_at?: string
        }
      }
    }
  }
}

