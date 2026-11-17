import { describe, expect, test } from 'bun:test';
import { canConsultReport, reportForPath } from './reportPermissions';
describe('report consultation permissions', () => {
  test('administrators retain access to manage report permissions', () => {
    expect(canConsultReport('informes', 'administrador', [{ report_type: 'informes', role: 'administrador', allowed: false }])).toBe(true);
  });
  test('a denied teacher report cannot be consulted', () => {
    expect(canConsultReport('informes', 'docente', [{ report_type: 'informes', role: 'docente', allowed: false }])).toBe(false);
  });
  test('enabling a report never grants unrelated modules to a role', () => {
    expect(canConsultReport('usuarios', 'estudiante', [{ report_type: 'usuarios', role: 'estudiante', allowed: true }])).toBe(false);
  });
  test('bulletins have their own permission independent of grade lists', () => {
    const permissions = [{ report_type: 'boletines', role: 'docente' as const, allowed: false }];
    expect(canConsultReport('calificaciones', 'docente', permissions)).toBe(true);
    expect(canConsultReport('boletines', 'docente', permissions)).toBe(false);
    expect(reportForPath('/calificaciones/boletines')).toBe('boletines');
  });
});