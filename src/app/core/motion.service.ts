import { DOCUMENT, Injectable, inject, signal } from '@angular/core';

/** Expone como señales las preferencias del sistema que afectan a las animaciones. */
@Injectable({ providedIn: 'root' })
export class MotionService {
  private readonly window = inject(DOCUMENT).defaultView;

  /** `true` si el usuario pidió reducir el movimiento en su sistema operativo. */
  readonly reduced = this.mediaSignal('(prefers-reduced-motion: reduce)');

  /** `true` en dispositivos con ratón (no táctiles), donde tienen sentido los efectos hover. */
  readonly finePointer = this.mediaSignal('(hover: hover) and (pointer: fine)');

  private mediaSignal(query: string) {
    const media = this.window?.matchMedia?.(query);
    const value = signal(media?.matches ?? false);
    media?.addEventListener('change', (event) => value.set(event.matches));
    return value.asReadonly();
  }
}
