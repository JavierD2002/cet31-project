export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      account_assignments: {
        Row: {
          active: boolean
          email: string
          role: Database["public"]["Enums"]["school_role"]
          usuario_id: number
        }
        Insert: {
          active?: boolean
          email: string
          role: Database["public"]["Enums"]["school_role"]
          usuario_id: number
        }
        Update: {
          active?: boolean
          email?: string
          role?: Database["public"]["Enums"]["school_role"]
          usuario_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "account_assignments_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: true
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      alertas_leidas: {
        Row: {
          alerta_id: number
          oculta: boolean
          user_id: string
        }
        Insert: {
          alerta_id: number
          oculta?: boolean
          user_id: string
        }
        Update: {
          alerta_id?: number
          oculta?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alertas_leidas_alerta_id_fkey"
            columns: ["alerta_id"]
            isOneToOne: false
            referencedRelation: "alertas_seguridad"
            referencedColumns: ["id"]
          },
        ]
      }
      alertas_seguridad: {
        Row: {
          created_at: string
          detalle: Json | null
          id: number
          mensaje: string
          tipo: string
          titulo: string
        }
        Insert: {
          created_at?: string
          detalle?: Json | null
          id?: never
          mensaje: string
          tipo: string
          titulo: string
        }
        Update: {
          created_at?: string
          detalle?: Json | null
          id?: never
          mensaje?: string
          tipo?: string
          titulo?: string
        }
        Relationships: []
      }
      asignaturas: {
        Row: {
          carga_horaria: number
          created_at: string | null
          curso: string
          descripcion: string | null
          docente_id: number | null
          id: number
          nombre: string
        }
        Insert: {
          carga_horaria?: number
          created_at?: string | null
          curso: string
          descripcion?: string | null
          docente_id?: number | null
          id?: number
          nombre: string
        }
        Update: {
          carga_horaria?: number
          created_at?: string | null
          curso?: string
          descripcion?: string | null
          docente_id?: number | null
          id?: number
          nombre?: string
        }
        Relationships: [
          {
            foreignKeyName: "asignaturas_docente_id_fkey"
            columns: ["docente_id"]
            isOneToOne: false
            referencedRelation: "docentes"
            referencedColumns: ["id"]
          },
        ]
      }
      asistencias: {
        Row: {
          asignatura_id: number
          created_at: string | null
          curso: string
          fecha: string
          id: number
          profesor_id: number
        }
        Insert: {
          asignatura_id: number
          created_at?: string | null
          curso: string
          fecha: string
          id?: number
          profesor_id: number
        }
        Update: {
          asignatura_id?: number
          created_at?: string | null
          curso?: string
          fecha?: string
          id?: number
          profesor_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "asistencias_asignatura_id_fkey"
            columns: ["asignatura_id"]
            isOneToOne: false
            referencedRelation: "asignaturas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asistencias_profesor_id_fkey"
            columns: ["profesor_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      asistencias_detalle: {
        Row: {
          asistencia_id: number
          estado: string
          estudiante_id: number
          hora_registro: string | null
          id: number
          observacion: string | null
        }
        Insert: {
          asistencia_id: number
          estado: string
          estudiante_id: number
          hora_registro?: string | null
          id?: number
          observacion?: string | null
        }
        Update: {
          asistencia_id?: number
          estado?: string
          estudiante_id?: number
          hora_registro?: string | null
          id?: number
          observacion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asistencias_detalle_asistencia_id_fkey"
            columns: ["asistencia_id"]
            isOneToOne: false
            referencedRelation: "asistencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asistencias_detalle_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      aulas: {
        Row: {
          activa: boolean
          capacidad: number
          created_at: string | null
          id: number
          nombre: string
          recursos: string | null
          ubicacion: string
        }
        Insert: {
          activa?: boolean
          capacidad?: number
          created_at?: string | null
          id?: number
          nombre: string
          recursos?: string | null
          ubicacion?: string
        }
        Update: {
          activa?: boolean
          capacidad?: number
          created_at?: string | null
          id?: number
          nombre?: string
          recursos?: string | null
          ubicacion?: string
        }
        Relationships: []
      }
      calificaciones: {
        Row: {
          asignatura_id: number
          created_at: string | null
          estudiante_id: number
          fecha_registro: string
          id: number
          nota: number
          observaciones: string | null
          periodo: string
        }
        Insert: {
          asignatura_id: number
          created_at?: string | null
          estudiante_id: number
          fecha_registro?: string
          id?: number
          nota: number
          observaciones?: string | null
          periodo: string
        }
        Update: {
          asignatura_id?: number
          created_at?: string | null
          estudiante_id?: number
          fecha_registro?: string
          id?: number
          nota?: number
          observaciones?: string | null
          periodo?: string
        }
        Relationships: [
          {
            foreignKeyName: "calificaciones_asignatura_id_fkey"
            columns: ["asignatura_id"]
            isOneToOne: false
            referencedRelation: "asignaturas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calificaciones_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "estudiantes"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracion_escuela: {
        Row: {
          email_contacto: string
          id: number
          nombre_escuela: string
          texto_copyright: string
          updated_at: string | null
        }
        Insert: {
          email_contacto?: string
          id?: number
          nombre_escuela?: string
          texto_copyright?: string
          updated_at?: string | null
        }
        Update: {
          email_contacto?: string
          id?: number
          nombre_escuela?: string
          texto_copyright?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      docentes: {
        Row: {
          created_at: string | null
          especialidad: string
          id: number
          usuario_id: number
        }
        Insert: {
          created_at?: string | null
          especialidad?: string
          id?: number
          usuario_id: number
        }
        Update: {
          created_at?: string | null
          especialidad?: string
          id?: number
          usuario_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "docentes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      estudiantes: {
        Row: {
          created_at: string | null
          curso: string
          id: number
          usuario_id: number
        }
        Insert: {
          created_at?: string | null
          curso?: string
          id?: number
          usuario_id: number
        }
        Update: {
          created_at?: string | null
          curso?: string
          id?: number
          usuario_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "estudiantes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      informes_pedagogicos: {
        Row: {
          asignatura_id: number | null
          autor_id: number
          contenido: string
          created_at: string | null
          estado: string
          estudiante_id: number
          fecha_creacion: string
          id: number
          observaciones: string | null
          periodo: string
          plantilla_id: number | null
          tipo_informe: string
          titulo: string
        }
        Insert: {
          asignatura_id?: number | null
          autor_id: number
          contenido?: string
          created_at?: string | null
          estado?: string
          estudiante_id: number
          fecha_creacion?: string
          id?: number
          observaciones?: string | null
          periodo: string
          plantilla_id?: number | null
          tipo_informe: string
          titulo: string
        }
        Update: {
          asignatura_id?: number | null
          autor_id?: number
          contenido?: string
          created_at?: string | null
          estado?: string
          estudiante_id?: number
          fecha_creacion?: string
          id?: number
          observaciones?: string | null
          periodo?: string
          plantilla_id?: number | null
          tipo_informe?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "informes_pedagogicos_asignatura_id_fkey"
            columns: ["asignatura_id"]
            isOneToOne: false
            referencedRelation: "asignaturas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "informes_pedagogicos_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "informes_pedagogicos_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "estudiantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "informes_pedagogicos_plantilla_id_fkey"
            columns: ["plantilla_id"]
            isOneToOne: false
            referencedRelation: "plantillas_informes"
            referencedColumns: ["id"]
          },
        ]
      }
      intentos_fallidos: {
        Row: {
          created_at: string
          email: string
          id: number
        }
        Insert: {
          created_at?: string
          email: string
          id?: never
        }
        Update: {
          created_at?: string
          email?: string
          id?: never
        }
        Relationships: []
      }
      libro_temas: {
        Row: {
          actividad: string
          asignatura_id: number
          contenido: string
          created_at: string | null
          curso: string
          docente_id: number
          estado: string
          evaluacion: string | null
          fecha: string
          id: number
          observaciones: string | null
          planificado: boolean | null
          recursos: string | null
          tarea: string | null
          tema: string
        }
        Insert: {
          actividad?: string
          asignatura_id: number
          contenido?: string
          created_at?: string | null
          curso: string
          docente_id: number
          estado?: string
          evaluacion?: string | null
          fecha: string
          id?: number
          observaciones?: string | null
          planificado?: boolean | null
          recursos?: string | null
          tarea?: string | null
          tema: string
        }
        Update: {
          actividad?: string
          asignatura_id?: number
          contenido?: string
          created_at?: string | null
          curso?: string
          docente_id?: number
          estado?: string
          evaluacion?: string | null
          fecha?: string
          id?: number
          observaciones?: string | null
          planificado?: boolean | null
          recursos?: string | null
          tarea?: string | null
          tema?: string
        }
        Relationships: [
          {
            foreignKeyName: "libro_temas_asignatura_id_fkey"
            columns: ["asignatura_id"]
            isOneToOne: false
            referencedRelation: "asignaturas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "libro_temas_docente_id_fkey"
            columns: ["docente_id"]
            isOneToOne: false
            referencedRelation: "docentes"
            referencedColumns: ["id"]
          },
        ]
      }
      panol_items: {
        Row: {
          cantidad: number
          created_at: string | null
          detalle: string | null
          espacio_taller: string
          estado: string
          id: number
          item: string
          nombre: string
          unidad_medida: string
          updated_at: string | null
        }
        Insert: {
          cantidad?: number
          created_at?: string | null
          detalle?: string | null
          espacio_taller?: string
          estado?: string
          id?: number
          item: string
          nombre: string
          unidad_medida?: string
          updated_at?: string | null
        }
        Update: {
          cantidad?: number
          created_at?: string | null
          detalle?: string | null
          espacio_taller?: string
          estado?: string
          id?: number
          item?: string
          nombre?: string
          unidad_medida?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      plantillas_informes: {
        Row: {
          activa: boolean
          campos_requeridos: Json | null
          contenido: string
          created_at: string | null
          descripcion: string | null
          id: number
          nombre: string
          tipo: string
        }
        Insert: {
          activa?: boolean
          campos_requeridos?: Json | null
          contenido?: string
          created_at?: string | null
          descripcion?: string | null
          id?: number
          nombre: string
          tipo: string
        }
        Update: {
          activa?: boolean
          campos_requeridos?: Json | null
          contenido?: string
          created_at?: string | null
          descripcion?: string | null
          id?: number
          nombre?: string
          tipo?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          apellido: string
          id: string
          nombre: string
          preferencias: Json
          usuario_id: number | null
        }
        Insert: {
          apellido?: string
          id: string
          nombre?: string
          preferencias?: Json
          usuario_id?: number | null
        }
        Update: {
          apellido?: string
          id?: string
          nombre?: string
          preferencias?: Json
          usuario_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: true
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      registro_actividad: {
        Row: {
          accion: string
          auth_user_id: string | null
          created_at: string
          detalle: Json | null
          email: string | null
          id: number
          modulo: string
          registro_id: string | null
          rol: string | null
          usuario_nombre: string | null
        }
        Insert: {
          accion: string
          auth_user_id?: string | null
          created_at?: string
          detalle?: Json | null
          email?: string | null
          id?: number
          modulo: string
          registro_id?: string | null
          rol?: string | null
          usuario_nombre?: string | null
        }
        Update: {
          accion?: string
          auth_user_id?: string | null
          created_at?: string
          detalle?: Json | null
          email?: string | null
          id?: number
          modulo?: string
          registro_id?: string | null
          rol?: string | null
          usuario_nombre?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["school_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["school_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["school_role"]
          user_id?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          apellido: string
          created_at: string | null
          dni: string
          email: string
          especialidad: string
          id: number
          nombre: string
          rol: string
          updated_at: string | null
        }
        Insert: {
          apellido: string
          created_at?: string | null
          dni: string
          email: string
          especialidad?: string
          id?: number
          nombre: string
          rol?: string
          updated_at?: string | null
        }
        Update: {
          apellido?: string
          created_at?: string | null
          dni?: string
          email?: string
          especialidad?: string
          id?: number
          nombre?: string
          rol?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      actor_info: { Args: { p_uid: string }; Returns: Record<string, unknown> }
      admin_delete_school_user: { Args: { p_id: number }; Returns: undefined }
      admin_save_school_user: {
        Args: {
          p_active?: boolean
          p_apellido: string
          p_curso: string
          p_dni: string
          p_email: string
          p_especialidad: string
          p_id: number
          p_nombre: string
          p_role: Database["public"]["Enums"]["school_role"]
        }
        Returns: number
      }
      attendance_responsibility: {
        Args: { attendance_id: number; student_user_id: number }
        Returns: boolean
      }
      grade_responsibility: {
        Args: { student_id: number; subject_id: number }
        Returns: boolean
      }
      has_school_role: {
        Args: { wanted: Database["public"]["Enums"]["school_role"] }
        Returns: boolean
      }
      own_student: { Args: { student_id: number }; Returns: boolean }
      report_failed_login: { Args: { p_email: string }; Returns: undefined }
      save_school_attendance: {
        Args: {
          p_asignatura: number
          p_curso: string
          p_detalles: Json
          p_fecha: string
          p_profesor: number
        }
        Returns: number
      }
      school_manager: { Args: never; Returns: boolean }
      school_user_id: { Args: never; Returns: number }
      student_attendance: { Args: { attendance_id: number }; Returns: boolean }
      sync_school_account: { Args: { account_id: string }; Returns: undefined }
      teaches_course: { Args: { wanted: string }; Returns: boolean }
      teaches_subject: {
        Args: { course_name: string; subject_id: number }
        Returns: boolean
      }
      visible_school_user: { Args: { wanted: number }; Returns: boolean }
    }
    Enums: {
      school_role:
        | "administrador"
        | "directivo"
        | "docente"
        | "estudiante"
        | "panolero"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      school_role: [
        "administrador",
        "directivo",
        "docente",
        "estudiante",
        "panolero",
      ],
    },
  },
} as const
