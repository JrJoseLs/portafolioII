import { Injectable, computed, inject, signal } from '@angular/core';

import { ContentOverrides } from '../data/content-overrides';
import { PROFILE, SOCIAL_LINKS } from '../data/profile';
import { I18nService } from './i18n/i18n.service';

/** Borrador local del panel de edición (solo en este navegador). */
const DRAFT_KEY = 'jl.content.draft';
/** Archivo publicado con los cambios aplicados al sitio. */
const CONTENT_FILE = 'content.json';

/**
 * Contenido editable del portafolio.
 *
 * Orden de prioridad: borrador local del panel de edición → `content.json`
 * publicado → valores por defecto de `profile.ts` y `ui-strings.ts`.
 */
@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly i18n = inject(I18nService);

  private readonly published = signal<ContentOverrides>({});
  private readonly draft = signal<ContentOverrides>(readDraft());

  /** Cambios que se están aplicando ahora mismo. */
  readonly overrides = computed<ContentOverrides>(() => ({ ...this.published(), ...this.draft() }));
  /** `true` si hay un borrador local sin publicar. */
  readonly hasDraft = computed(() => Object.keys(this.draft()).length > 0);

  readonly name = computed(() => this.overrides().name?.trim() || PROFILE.name);
  readonly email = computed(() => this.overrides().email?.trim() || PROFILE.email);
  readonly cvUrl = computed(() => this.overrides().cvUrl?.trim() || PROFILE.cvUrl);
  readonly photo = computed(() => this.overrides().photo?.trim() || PROFILE.photo);
  readonly headline = computed(() => this.pick(this.overrides().headline) || PROFILE.headline[this.i18n.lang()]);
  readonly location = computed(() => this.pick(this.overrides().location) || this.i18n.t().hero.location);

  readonly aboutParagraphs = computed<readonly string[]>(() => {
    const custom = this.overrides().about?.[this.i18n.lang()]?.filter((text) => text.trim());
    return custom?.length ? custom : this.i18n.t().about.paragraphs;
  });

  readonly socials = computed(() => {
    const urls = this.overrides().socials ?? {};
    return SOCIAL_LINKS.map((social) => ({ ...social, url: urls[social.id]?.trim() || social.url }));
  });

  /** Nombre partido para la portada: la segunda parte se pinta con degradado. */
  readonly nameParts = computed(() => {
    const [first, ...rest] = this.name().split(' ');
    return { first, rest: rest.join(' ') };
  });

  /** Carga `public/content.json`. Si no existe, se usan los valores por defecto. */
  async load(): Promise<void> {
    try {
      const response = await fetch(CONTENT_FILE, { cache: 'no-cache' });
      if (!response.ok) return;
      if (!response.headers.get('content-type')?.includes('json')) return;
      this.published.set((await response.json()) as ContentOverrides);
    } catch {
      // Sin archivo de contenido: el sitio funciona con los valores por defecto.
    }
  }

  /** Guarda el borrador en este navegador y lo aplica al instante. */
  saveDraft(overrides: ContentOverrides): void {
    this.draft.set(overrides);
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(overrides));
    } catch {
      // Sin almacenamiento: los cambios duran hasta recargar la página.
    }
  }

  /** Descarta el borrador local y vuelve al contenido publicado. */
  clearDraft(): void {
    this.draft.set({});
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // Nada que limpiar.
    }
  }

  private pick(value: { es?: string; en?: string } | undefined): string {
    return value?.[this.i18n.lang()]?.trim() ?? '';
  }
}

function readDraft(): ContentOverrides {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) ?? '{}') as ContentOverrides;
  } catch {
    return {};
  }
}
