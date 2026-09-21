import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { MotionService } from './motion.service';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  const root = document.documentElement;
  let initialTheme: string | undefined;

  beforeEach(() => {
    initialTheme = root.dataset['theme'];
    root.dataset['theme'] = 'dark';
    // Con movimiento reducido el cambio es inmediato (sin View Transition).
    TestBed.configureTestingModule({
      providers: [{ provide: MotionService, useValue: { reduced: signal(true), finePointer: signal(false) } }],
    });
  });

  afterEach(() => {
    root.dataset['theme'] = initialTheme;
    localStorage.removeItem('jl.theme');
  });

  it('lee el tema inicial del atributo data-theme', () => {
    expect(TestBed.inject(ThemeService).isDark()).toBeTrue();
  });

  it('alterna entre oscuro y claro y lo recuerda', () => {
    const theme = TestBed.inject(ThemeService);
    theme.toggle();

    expect(theme.theme()).toBe('light');
    expect(root.dataset['theme']).toBe('light');
    expect(localStorage.getItem('jl.theme')).toBe('light');
  });
});
