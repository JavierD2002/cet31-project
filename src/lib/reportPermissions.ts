import type { UserRole } from '@/types/supabase';

export const reportRoles: { role: UserRole; label: string }[] = [
  { role: 'administrador', label: 'Administrador' },
  { role: 'directivo', label: 'Directivo' },
  { role: 'docente', label: 'Docente' },
  { role: 'estudiante', label: 'Estudiante' },
  { role: 'panolero', label: 'Pañolero' },
];
const managers: UserRole[] = ['administrador', 'directivo'];
const academic: UserRole[] = [...managers, 'docente'];
export const reportTypes = [
  { key: 'estudiantes', label: 'Listado de estudiantes', roles: academic },
  { key: 'docentes', label: 'Listado de docentes', roles: academic },
  { key: 'aulas', label: 'Listado de aulas', roles: managers },
  { key: 'asignaturas', label: 'Listado de asignaturas', roles: academic },
  { key: 'asistencia', label: 'Historial de asistencia', roles: [...academic, 'estudiante'] as UserRole[] },
  { key: 'reporte_asistencia', label: 'Reportes de asistencia', roles: academic },
  { key: 'calificaciones', label: 'Listado de calificaciones', roles: [...academic, 'estudiante'] as UserRole[] },
  { key: 'boletines', label: 'Boletines de calificaciones', roles: [...academic, 'estudiante'] as UserRole[] },
  { key: 'informes', label: 'Informes pedagógicos', roles: [...academic, 'estudiante'] as UserRole[] },
  { key: 'libro_temas', label: 'Libro de temas', roles: academic },
  { key: 'usuarios', label: 'Listado de usuarios', roles: ['administrador'] as UserRole[] },
  { key: 'panol', label: 'Inventario de Pañol', roles: [...managers, 'panolero'] as UserRole[] },
  { key: 'auditoria', label: 'Registro de actividad', roles: managers },
] as const;
export type ReportType = typeof reportTypes[number]['key'];
export type ReportPermission = { report_type: string; role: UserRole; allowed: boolean };
export function canConsultReport(type: ReportType, role: UserRole, permissions: ReportPermission[]) {
  const report = reportTypes.find(report => report.key === type);
  if (!report?.roles.includes(role)) return false;
  if (role === 'administrador') return true;
  return permissions.find(p => p.report_type === type && p.role === role)?.allowed ?? true;
}
export function reportForPath(path: string): ReportType | undefined {
  if (path === '/asistencia') return undefined; // Registration is not a report.
  const paths: [string, ReportType][] = [
    ['/asistencia/reportes', 'reporte_asistencia'], ['/asistencia/', 'asistencia'],
    ['/calificaciones/boletines', 'boletines'], ['/calificaciones', 'calificaciones'],
    ['/admin/usuarios', 'usuarios'], ['/estudiantes', 'estudiantes'],
    ['/docentes', 'docentes'], ['/aulas', 'aulas'], ['/asignaturas', 'asignaturas'],
    ['/informes', 'informes'], ['/libro-de-tema', 'libro_temas'], ['/panol', 'panol'], ['/auditoria', 'auditoria'],
  ];
  // Personal profiles have independent permissions for each tab.
  if (/\/(estudiantes|docentes)\/\d+\/perfil/.test(path) || /\/admin\/usuarios\/.+/.test(path)) return undefined;
  return paths.find(([prefix]) => path.startsWith(prefix))?.[1];
}