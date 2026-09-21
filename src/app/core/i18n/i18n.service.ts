import { DOCUMENT, Injectable, computed, inject, signal } from '@angular/core';

import { writeStorage } from '../browser-storage';
import { Lang, Localized } from './lang';
import { UI_STRINGS } from './ui-strings';

const STORAGE_KEY = 'jl.lang';

/**
 * Idioma activo (español / inglés). El idioma inicial lo decide el script de
 * `index.html` (preferencia guardada o idioma del navegador).
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly document = inject(DOCUMENT);
  private readonly root = this.document.documentElement;

  private readonly current = signal<Lang>(this.root.lang === 'en' ? 'en' : 'es');

  readonly lang = this.current.asReadonly();
  /** Textos de la interfaz en el idioma activo. */
  readonly t = computed(() => UI_STRINGS[this.current()]);

  constructor() {
    this.apply(this.current());
  }

  toggle(): void {
    this.set(this.current() === 'es' ? 'en' : 'es');
  }

  set(lang: Lang): void {
    this.current.set(lang);
    this.apply(lang);
    writeStorage(STORAGE_KEY, lang);
  }

  /** Devuelve la versión en el idioma activo de un texto traducido. */
  pick<T>(value: Localized<T>): T {
    return value[this.current()];
  }

  private apply(lang: Lang): void {
    const { meta } = UI_STRINGS[lang];
    this.root.lang = lang;
    this.document.title = meta.title;
    this.document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  }
}
