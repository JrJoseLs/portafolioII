import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';

import { RevealObserverService } from '../reveal/reveal-observer.service';

/** Número que cuenta desde 0 hasta `value` cuando aparece en pantalla. */
@Component({
  selector: 'app-count-up',
  template: `{{ prefix() }}{{ display() }}{{ suffix() }}`,
  host: { '[attr.aria-label]': 'prefix() + value() + suffix()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountUp {
  readonly value = input.required<number>();
  readonly prefix = input('');
  readonly suffix = input('');
  readonly duration = input(1600);

  protected readonly display = signal(0);
  private frame = 0;

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const observer = inject(RevealObserverService);

    afterNextRender(() => observer.observe(element, () => this.animate()));
    inject(DestroyRef).onDestroy(() => {
      cancelAnimationFrame(this.frame);
      observer.unobserve(element);
    });
  }

  private animate(): void {
    const target = this.value();
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / this.duration());
      const eased = 1 - Math.pow(1 - progress, 4);
      this.display.set(Math.round(target * eased));
      if (progress < 1) this.frame = requestAnimationFrame(step);
    };
    this.frame = requestAnimationFrame(step);
  }
}
