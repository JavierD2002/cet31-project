import { test, expect } from 'bun:test';
import { canPlan, validPlan } from './rules';
test('docentes can plan only assigned subjects', () => {
  expect(canPlan('docente', false, true)).toBe(true);
  expect(canPlan('docente', false, false)).toBe(false);
});
test('school managers can plan', () => {
  expect(canPlan('administrador', true, false)).toBe(true);
  expect(canPlan('directivo', true, false)).toBe(true);
});
test('students and inventory staff cannot plan', () => {
  expect(canPlan('estudiante', false, true)).toBe(false);
  expect(canPlan('panolero', false, true)).toBe(false);
});
test('generated plans need activities resources and evaluation', () => {
  expect(validPlan({ contenido: 'Objetivo', actividad: 'Práctica', recursos: 'Pizarra', evaluacion: 'Rúbrica' })).toBe(true);
  expect(validPlan({ contenido: 'Objetivo', actividad: 'Práctica', recursos: 'Pizarra' })).toBe(false);
});