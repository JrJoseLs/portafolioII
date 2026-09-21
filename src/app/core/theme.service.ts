import { DOCUMENT, Injectable, computed, inject, signal } from '@angular/core';

import { readStorage, writeStorage } from './browser-storage';
import { MotionService } from './motion.service';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'jl.theme';
const THEME_COLORS: Record<Theme, string> = { dark: '#000000', light: '#f5f5f7' };

/**
 * Tema claro/oscuro. El valor inicial lo fija un script en `index.html` (para
 * evitar parpadeos) y este servicio lo lee del atributo `data-theme`.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly motion = inject(MotionService);
  private readonly root = this.document.documentElement;

  private readonly current = signal<Theme>(this.root.dataset['theme'] === 'light' ? 'light' : 'dark');

  readonly theme = this.current.asReadonly();
  readonly isDark = computed(() => this.current() === 'dark');

  constructor() {
    this.apply(this.current());
    this.followSystemPreference();
  }

  /**
   * Cambia el tema. Si el navegador soporta View Transitions, el nuevo tema se
   * revela con un círculo que crece desde el punto indicado (p. ej. el botón).
   */
  toggle(origin?: { x: number; y: number }): void {
    this.set(this.isDark() ? 'light' : 'dark', origin, true);
  }

  set(theme: Theme, origin?: { x: number; y: number }, persist = true): void {
    if (theme === this.current()) return;

    const update = () => {
      this.current.set(theme);
      this.apply(theme);
      if (persist) writeStorage(STORAGE_KEY, theme);
    };

    const doc = this.document as Document & { startViewTransition?: (cb: () => void) => ViewTransition };
    if (!doc.startViewTransition || this.motion.reduced()) {
      update();
      return;
    }

    const view = this.document.defaultView!;
    const x = origin?.x ?? view.innerWidth / 2;
    const y = origin?.y ?? 0;
    const radius = Math.hypot(Math.max(x, view.innerWidth - x), Math.max(y, view.innerHeight - y));

    const transition = doc.startViewTransition(update);
    transition.ready
      .then(() =>
        this.root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 700, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
        ),
      )
      .catch(() => undefined);
  }

  private apply(theme: Theme): void {
    this.root.dataset['theme'] = theme;
    this.document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
  }

  /** Si el usuario nunca eligió un tema, se sigue el del sistema operativo en vivo. */
  private followSystemPreference(): void {
    const media = this.document.defaultView?.matchMedia?.('(prefers-color-scheme: light)');
    media?.addEventListener('change', (event) => {
      if (!readStorage(STORAGE_KEY)) this.set(event.matches ? 'light' : 'dark', undefined, false);
    });
  }
}
