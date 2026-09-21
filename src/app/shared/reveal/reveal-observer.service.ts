import { Injectable, inject } from '@angular/core';

import { MotionService } from '../../core/motion.service';

/**
 * Un único IntersectionObserver compartido por todos los elementos que se
 * animan al entrar en pantalla (más eficiente que uno por elemento).
 */
@Injectable({ providedIn: 'root' })
export class RevealObserverService {
  private readonly motion = inject(MotionService);
  private readonly callbacks = new Map<Element, () => void>();
  private observer?: IntersectionObserver;

  /** Llama a `onVisible` una sola vez, cuando el elemento aparece en pantalla. */
  observe(element: Element, onVisible: () => void): void {
    if (this.motion.reduced() || typeof IntersectionObserver === 'undefined') {
      onVisible();
      return;
    }
    this.callbacks.set(element, onVisible);
    this.getObserver().observe(element);
  }

  unobserve(element: Element): void {
    this.callbacks.delete(element);
    this.observer?.unobserve(element);
  }

  private getObserver(): IntersectionObserver {
    this.observer ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          this.callbacks.get(entry.target)?.();
          this.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    return this.observer;
  }
}
