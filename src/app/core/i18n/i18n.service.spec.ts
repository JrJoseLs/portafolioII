import { TestBed } from '@angular/core/testing';

import { I18nService } from './i18n.service';

describe('I18nService', () => {
  const root = document.documentElement;
  let initialLang: string;
  let initialTitle: string;

  beforeEach(() => {
    initialLang = root.lang;
    initialTitle = document.title;
    root.lang = 'es';
  });

  afterEach(() => {
    root.lang = initialLang;
    document.title = initialTitle;
    localStorage.removeItem('jl.lang');
  });

  it('lee el idioma inicial del atributo lang', () => {
    expect(TestBed.inject(I18nService).lang()).toBe('es');
  });

  it('cambia de idioma, actualiza el documento y lo recuerda', () => {
    const i18n = TestBed.inject(I18nService);
    i18n.toggle();

    expect(i18n.lang()).toBe('en');
    expect(i18n.t().hero.ctaProjects).toBe('View projects');
    expect(root.lang).toBe('en');
    expect(document.title).toContain('Software Engineer');
    expect(localStorage.getItem('jl.lang')).toBe('en');
  });

  it('elige el texto traducido con pick()', () => {
    const i18n = TestBed.inject(I18nService);
    expect(i18n.pick({ es: 'Hola', en: 'Hello' })).toBe('Hola');
  });
});
