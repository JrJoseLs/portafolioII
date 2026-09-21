import { DOCUMENT, Injectable, inject, signal } from '@angular/core';

import { MotionService } from './motion.service';
import { SECTIONS, SectionId } from './sections';

/** Detecta qué sección ocupa el centro de la pantalla y permite desplazarse a ella. */
@Injectable({ providedIn: 'root' })
export class ScrollSpyService {
  private readonly document = inject(DOCUMENT);
  private readonly motion = inject(MotionService);
  private observer?: IntersectionObserver;

  private readonly current = signal<SectionId>('home');
  readonly active = this.current.asReadonly();

  /** Empieza a observar las secciones. Llamar una vez tras el primer renderizado. */
  start(): void {
    if (this.observer || typeof IntersectionObserver === 'undefined') return;

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) this.current.set(entry.target.id as SectionId);
        }
      },
      // Una franja estrecha en el centro de la ventana: la sección que la cruza es la activa.
      { rootMargin: '-45% 0px -50% 0px' },
    );

    for (const { id } of SECTIONS) {
      const element = this.document.getElementById(id);
      if (element) this.observer.observe(element);
    }
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = undefined;
  }

  scrollTo(id: SectionId): void {
    const element = this.document.getElementById(id);
    if (!element) return;
    element.scrollIntoView({ behavior: this.motion.reduced() ? 'auto' : 'smooth', block: 'start' });
    this.current.set(id);
    element.focus({ preventScroll: true });
  }
}
