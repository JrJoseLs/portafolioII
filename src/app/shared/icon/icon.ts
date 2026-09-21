import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Renderer2,
  afterRenderEffect,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';

import { ICONS, IconName } from './icons';

/**
 * Icono SVG del registro `icons.ts`. Los nodos se crean con Renderer2 en lugar
 * de `innerHTML`, así no hace falta desactivar el sanitizador de Angular.
 *
 * Uso: `<app-icon name="github" />`. Hereda el color del texto (`currentColor`)
 * y mide `1.25em` por defecto (cámbialo con `size` o con `--icon-size`).
 */
@Component({
  selector: 'app-icon',
  template: `<svg
    #svg
    xmlns="http://www.w3.org/2000/svg"
    [attr.viewBox]="definition().viewBox"
    [attr.fill]="definition().filled ? 'currentColor' : 'none'"
    [attr.stroke]="definition().filled ? null : 'currentColor'"
    [attr.stroke-width]="definition().filled ? null : strokeWidth()"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  ></svg>`,
  styles: `
    :host {
      display: inline-flex;
      flex: none;
      width: var(--icon-size, 1.25em);
      height: var(--icon-size, 1.25em);
    }
    svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }
  `,
  host: { '[style.--icon-size]': 'size() ? size() + "px" : null' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input<number>();
  readonly strokeWidth = input(1.75);

  protected readonly definition = computed(() => ICONS[this.name()]);

  private readonly svg = viewChild.required<ElementRef<SVGSVGElement>>('svg');
  private readonly renderer = inject(Renderer2);

  constructor() {
    afterRenderEffect({
      write: () => {
        const svg = this.svg().nativeElement;
        const { nodes } = this.definition();

        while (svg.firstChild) this.renderer.removeChild(svg, svg.firstChild);
        for (const [tag, attributes] of nodes) {
          const element = this.renderer.createElement(tag, 'svg');
          for (const [name, value] of Object.entries(attributes)) this.renderer.setAttribute(element, name, value);
          this.renderer.appendChild(svg, element);
        }
      },
    });
  }
}
