import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Icon } from '../icon/icon';
import { IconName } from '../icon/icons';
import { Reveal } from '../reveal/reveal';

/** Encabezado común de las secciones: etiqueta, título y subtítulo. */
@Component({
  selector: 'app-section-heading',
  imports: [Icon, Reveal],
  template: `
    <p class="eyebrow" appReveal>
      <app-icon [name]="icon()" />
      {{ eyebrow() }}
    </p>
    <h2 class="section-title" [id]="titleId()" appReveal="80">{{ title() }}</h2>
    @if (subtitle()) {
      <p class="section-subtitle" appReveal="160">{{ subtitle() }}</p>
    }
  `,
  styles: `
    :host {
      display: block;
      margin-bottom: clamp(2rem, 5vw, 3.5rem);
      max-width: 46rem;
    }
    :host(.is-centered) {
      margin-inline: auto;
      text-align: center;
    }
    .section-title {
      font-size: clamp(2.1rem, 5.2vw, 3.6rem);
      line-height: 1.05;
      letter-spacing: -0.035em;
      font-weight: 750;
      margin-top: 0.9rem;
    }
    .section-subtitle {
      margin-top: 1rem;
      font-size: clamp(1rem, 1.6vw, 1.2rem);
      color: var(--text-2);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeading {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly icon = input.required<IconName>();
  readonly titleId = input<string>();
}
