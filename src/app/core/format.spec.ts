import { formatDuration, formatMonth, monthsBetween } from './format';

const ES_WORDS = { year: 'año', years: 'años', month: 'mes', months: 'meses' };

describe('format', () => {
  it('cuenta los meses incluyendo el primero y el último', () => {
    expect(monthsBetween('2021-11', '2023-01')).toBe(15);
    expect(monthsBetween('2024-01', '2024-01')).toBe(1);
  });

  it('usa la fecha actual cuando el empleo sigue activo', () => {
    expect(monthsBetween('2024-01', null, new Date(2024, 11, 15))).toBe(12);
  });

  it('formatea duraciones en años y meses', () => {
    expect(formatDuration(15, ES_WORDS)).toBe('1 año 3 meses');
    expect(formatDuration(24, ES_WORDS)).toBe('2 años');
    expect(formatDuration(1, ES_WORDS)).toBe('1 mes');
  });

  it('formatea el mes según el idioma', () => {
    expect(formatMonth('2024-01', 'en')).toBe('Jan 2024');
    expect(formatMonth('2024-01', 'es').toLowerCase()).toContain('2024');
  });
});
