export const planningRoles = ['docente', 'directivo', 'administrador'];
export function canPlan(role: string, manager: boolean, teachesSubject: boolean) {
  return planningRoles.includes(role) && (manager || teachesSubject);
}
export const planFields = ['contenido', 'actividad', 'recursos', 'evaluacion'] as const;
export function validPlan(value: unknown): value is Record<typeof planFields[number], string> {
  return typeof value === 'object' && value !== null && planFields.every(
    field => field in value && typeof (value as Record<string, unknown>)[field] === 'string' && String((value as Record<string, unknown>)[field]).trim().length > 0,
  );
}