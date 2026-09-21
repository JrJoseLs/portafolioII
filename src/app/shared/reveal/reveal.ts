import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input, numberAttribute, signal } from '@angular/core';

import { RevealObserverService } from './reveal-observer.service';

/**
 * Aparición suave al hacer scroll. El valor opcional es un retraso en ms:
 * `<div appReveal>` o `<div appReveal="120">`. Los estilos están en `styles.css`.
 */
@Directive({
  selector: '[appReveal]',
  host: {
    class: 'reveal',
    '[class.is-visible]': 'visible()',
    '[style.--reveal-delay.ms]': 'delay()',
  },
})
export class Reveal {
  readonly delay = input(0, { alias: 'appReveal', transform: (value: unknown) => numberAttribute(value, 0) });

  protected readonly visible = signal(false);

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const observer = inject(RevealObserverService);

    afterNextRender(() => observer.observe(element, () => this.visible.set(true)));
    inject(DestroyRef).onDestroy(() => observer.unobserve(element));
  }
}
