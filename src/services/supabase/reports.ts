
import { supabase, isSupabaseConfigured } from './client';

// Mock data para cuando Supabase no está configurado
const mockReports = [
  {
    id: 1,
    estudiante_id: 1,
    estudiante_nombre: "Acosta, María",
    curso: "1° Año A",
    tipo_informe: "desempeño_academico",
    periodo: "Primer Trimestre",
    fecha_creacion: "2025-03-15",
    autor_id: 1,
    autor_nombre: "Prof. García, Susana",
    titulo: "Informe de Desempeño Académico",
    contenido: "La estudiante María Acosta ha demostrado un excelente desempeño académico durante el primer trimestre...",
    observaciones: "Se recomienda continuar con el nivel de dedicación mostrado.",
    estado: "finalizado",
    plantilla_id: 1
  },
  {
    id: 2,
    estudiante_id: 2,
    estudiante_nombre: "Benítez, Carlos",
    curso: "1° Año A",
    tipo_informe: "comportamiento",
    periodo: "Primer Trimestre",
    fecha_creacion: "2025-03-20",
    autor_id: 2,
    autor_nombre: "Prof. Rodríguez, Manuel",
    titulo: "Informe de Comportamiento",
    contenido: "El estudiante Carlos Benítez ha mostrado algunas dificultades en el comportamiento...",
    observaciones: "Se sugiere mayor seguimiento y apoyo familiar.",
    estado: "revision",
    plantilla_id: 2
  }
];

const mockTemplates = [
  {
    id: 1,
    nombre: "Desempeño Académico",
    descripcion: "Plantilla para informes de rendimiento académico",
    tipo: "desempeño_academico",
    contenido: `
# Informe de Desempeño Académico

## Datos del Estudiante
- **Nombre:** {estudiante_nombre}
- **Curso:** {curso}
- **Período:** {periodo}

## Rendimiento por Asignatura
{calificaciones_detalle}

## Fortalezas Identificadas
{fortalezas}

## Áreas de Mejora
{areas_mejora}

## Recomendaciones
{recomendaciones}

## Observaciones Adicionales
{observaciones}
    `,
    campos_requeridos: ["fortalezas", "areas_mejora", "recomendaciones"],
    activa: true
  },
  {
    id: 2,
    nombre: "Comportamiento",
    descripcion: "Plantilla para informes de comportamiento y disciplina",
    tipo: "comportamiento",
    contenido: `
# Informe de Comportamiento

## Datos del Estudiante
- **Nombre:** {estudiante_nombre}
- **Curso:** {curso}
- **Período:** {periodo}

## Comportamiento en Clase
{comportamiento_clase}

## Relación con Compañeros
{relacion_companeros}

## Cumplimiento de Normas
{cumplimiento_normas}

## Incidentes Registrados
{incidentes}

## Plan de Acción
{plan_accion}

## Observaciones
{observaciones}
    `,
    campos_requeridos: ["comportamiento_clase", "relacion_companeros", "plan_accion"],
    activa: true
  }
];

// Funciones mock
const mockGetReports = async (filters?: any) => {
  console.warn('Supabase not configured: getReports called with mock implementation');
  return mockReports.filter(report => {
    if (filters?.estudiante_id && report.estudiante_id !== filters.estudiante_id) return false;
    if (filters?.tipo && report.tipo_informe !== filters.tipo) return false;
    if (filters?.periodo && report.periodo !== filters.periodo) return false;
    return true;
  });
};

const mockGetReportTemplates = async () => {
  console.warn('Supabase not configured: getReportTemplates called with mock implementation');
  return mockTemplates;
};

const mockCreateReport = async (report: any) => {
  console.warn('Supabase not configured: createReport called with mock implementation');
  const newReport = {
    ...report,
    id: Math.max(...mockReports.map(r => r.id)) + 1,
    fecha_creacion: new Date().toISOString().split('T')[0],
    estado: 'borrador'
  };
  mockReports.push(newReport);
  return newReport;
};

const mockUpdateReport = async (id: number, updates: any) => {
  console.warn('Supabase not configured: updateReport called with mock implementation');
  const index = mockReports.findIndex(r => r.id === id);
  if (index !== -1) {
    mockReports[index] = { ...mockReports[index], ...updates };
    return mockReports[index];
  }
  throw new Error('Informe no encontrado');
};

const mockDeleteReport = async (id: number) => {
  console.warn('Supabase not configured: deleteReport called with mock implementation');
  const index = mockReports.findIndex(r => r.id === id);
  if (index !== -1) {
    mockReports.splice(index, 1);
    return { success: true };
  }
  throw new Error('Informe no encontrado');
};

// Exportar funciones reales o mock según configuración
export const getReports = isSupabaseConfigured
  ? async (filters?: {
      estudiante_id?: number;
      tipo?: string;
      periodo?: string;
      autor_id?: number;
      fecha_desde?: string;
      fecha_hasta?: string;
    }) => {
      let query = supabase
        .from('informes_pedagogicos')
        .select(`
          *,
          estudiantes (
            usuarios (nombre, apellido),
            curso
          ),
          usuarios!informes_pedagogicos_autor_id_fkey (
            nombre,
            apellido
          )
        `)
        .order('fecha_creacion', { ascending: false });

      if (filters?.estudiante_id) {
        query = query.eq('estudiante_id', filters.estudiante_id);
      }
      if (filters?.tipo) {
        query = query.eq('tipo_informe', filters.tipo);
      }
      if (filters?.periodo) {
        query = query.eq('periodo', filters.periodo);
      }
      if (filters?.autor_id) {
        query = query.eq('autor_id', filters.autor_id);
      }
      if (filters?.fecha_desde) {
        query = query.gte('fecha_creacion', filters.fecha_desde);
      }
      if (filters?.fecha_hasta) {
        query = query.lte('fecha_creacion', filters.fecha_hasta);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(informe => ({
        ...informe,
        estudiante_nombre: informe.estudiantes?.usuarios ?
          `${informe.estudiantes.usuarios.apellido}, ${informe.estudiantes.usuarios.nombre}` :
          "Sin datos",
        curso: informe.estudiantes?.curso || "Sin curso",
        autor_nombre: informe.usuarios ?
          `${informe.usuarios.apellido}, ${informe.usuarios.nombre}` :
          "Sin autor"
      })) || [];
    }
  : mockGetReports;

export const getReportTemplates = isSupabaseConfigured
  ? async () => {
      const { data, error } = await supabase
        .from('plantillas_informes')
        .select('*')
        .eq('activa', true)
        .order('nombre');

      if (error) throw error;
      return data || [];
    }
  : mockGetReportTemplates;

export const createReport = isSupabaseConfigured
  ? async (report: {
      estudiante_id: number;
      tipo_informe: string;
      periodo: string;
      autor_id: number;
      titulo: string;
      contenido: string;
      observaciones?: string;
      plantilla_id?: number;
    }) => {
      const { data, error } = await supabase
        .from('informes_pedagogicos')
        .insert([{
          ...report,
          fecha_creacion: new Date().toISOString().split('T')[0],
          estado: 'borrador'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  : mockCreateReport;

export const updateReport = isSupabaseConfigured
  ? async (id: number, updates: any) => {
      const { data, error } = await supabase
        .from('informes_pedagogicos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  : mockUpdateReport;

export const deleteReport = isSupabaseConfigured
  ? async (id: number) => {
      const { error } = await supabase
        .from('informes_pedagogicos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    }
  : mockDeleteReport;

export const getReportById = isSupabaseConfigured
  ? async (id: number) => {
      const { data, error } = await supabase
        .from('informes_pedagogicos')
        .select(`
          *,
          estudiantes (
            usuarios (nombre, apellido, dni),
            curso
          ),
          usuarios!informes_pedagogicos_autor_id_fkey (
            nombre,
            apellido
          ),
          plantillas_informes (
            nombre,
            contenido
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }
  : async (id: number) => {
      console.warn('Supabase not configured: getReportById called with mock implementation');
      return mockReports.find(r => r.id === id);
    };
