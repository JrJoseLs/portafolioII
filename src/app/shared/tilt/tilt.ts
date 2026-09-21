import { Directive, ElementRef, inject, input } from '@angular/core';

import { MotionService } from '../../core/motion.service';

/**
 * Inclina la tarjeta en 3D siguiendo el ratón y mueve un foco de luz
 * (variables CSS `--rx`, `--ry`, `--mx`, `--my`; estilos en `styles.css`).
 * Solo actúa con ratón y si el usuario no pidió reducir el movimiento.
 */
@Directive({
  selector: '[appTilt]',
  host: {
    class: 'tilt',
    '(pointermove)': 'onMove($event)',
    '(pointerleave)': 'reset()',
  },
})
export class Tilt {
  /** Inclinación máxima en grados. */
  readonly maxTilt = input(6, { alias: 'appTilt', transform: (value: unknown) => Number(value) || 6 });

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly motion = inject(MotionService);
  private frame = 0;

  protected onMove(event: PointerEvent): void {
    if (event.pointerType !== 'mouse') return;

    const rect = this.element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => {
      const style = this.element.style;
      style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
      style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
      if (this.motion.reduced() || !this.motion.finePointer()) return;
      const max = this.maxTilt();
      style.setProperty('--rx', `${((0.5 - y) * max * 2).toFixed(2)}deg`);
      style.setProperty('--ry', `${((x - 0.5) * max * 2).toFixed(2)}deg`);
    });
  }

  protected reset(): void {
    cancelAnimationFrame(this.frame);
    const style = this.element.style;
    style.setProperty('--rx', '0deg');
    style.setProperty('--ry', '0deg');
  }
}
