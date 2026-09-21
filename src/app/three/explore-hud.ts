import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { I18nService } from '../core/i18n/i18n.service';
import { SceneService } from '../core/scene.service';
import { ScrollSpyService } from '../core/scroll-spy.service';
import { SECTIONS } from '../core/sections';
import { Icon } from '../shared/icon/icon';
import { SHAPE_NAMES, ShapeName } from './shapes';

/** Controles del modo exploración: elegir figura y salir. */
@Component({
  selector: 'app-explore-hud',
  imports: [Icon],
  template: `
    @if (scene.exploreMode()) {
      <div class="hud-top glass" role="status">
        <app-icon name="move-3d" />
        <div>
          <strong>{{ t().explore.title }}</strong>
          <span>{{ t().explore.hint }}</span>
        </div>
      </div>

      <div class="hud-bottom glass" role="toolbar" [attr.aria-label]="t().explore.title">
        <div class="shapes">
          @for (shape of shapes; track shape) {
            <button
              type="button"
              class="chip"
              [class.is-active]="shape === activeShape()"
              [attr.aria-pressed]="shape === activeShape()"
              (click)="scene.chooseShape(shape)"
            >
              {{ t().explore.shapes[shape] }}
            </button>
          }
        </div>
        <button type="button" class="btn btn--primary btn--sm" (click)="scene.exitExplore()">
          <app-icon name="x" />
          {{ t().explore.exit }}
          <kbd>Esc</kbd>
        </button>
      </div>
    }
  `,
  styles: `
    :host {
      position: fixed;
      inset: 0;
      z-index: 40;
      pointer-events: none;
    }
    .glass {
      pointer-events: auto;
      position: absolute;
      left: 50%;
      translate: -50% 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem;
      border-radius: 999px;
      animation: hud-in 0.5s var(--ease-out) both;
    }
    .hud-top {
      top: max(1rem, env(safe-area-inset-top));
      padding: 0.7rem 1.2rem;
      font-size: 0.85rem;
      color: var(--text-2);
      width: max-content;
      max-width: calc(100vw - 2rem);
    }
    .hud-top div {
      display: flex;
      flex-direction: column;
    }
    .hud-top strong {
      color: var(--text);
      font-size: 0.95rem;
    }
    .hud-bottom {
      bottom: max(1.25rem, env(safe-area-inset-bottom));
      width: max-content;
      max-width: calc(100vw - 2rem);
      flex-wrap: wrap;
      justify-content: center;
      border-radius: 1.5rem;
    }
    .shapes {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.35rem;
    }
    .chip {
      cursor: pointer;
    }
    kbd {
      font-size: 0.7rem;
      color: #fff;
      background: rgb(255 255 255 / 0.18);
      border-color: rgb(255 255 255 / 0.35);
    }
    @media (max-width: 600px) {
      kbd {
        display: none;
      }
    }
    @keyframes hud-in {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreHud {
  protected readonly scene = inject(SceneService);
  private readonly spy = inject(ScrollSpyService);
  protected readonly t = inject(I18nService).t;
  protected readonly shapes = SHAPE_NAMES;

  protected readonly activeShape = computed<ShapeName>(
    () => this.scene.shapeOverride() ?? SECTIONS.find((s) => s.id === this.spy.active())?.shape ?? 'planet',
  );
}
