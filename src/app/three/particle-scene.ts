import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import { MotionService } from '../core/motion.service';
import { SceneService } from '../core/scene.service';
import { ScrollSpyService } from '../core/scroll-spy.service';
import { SECTIONS } from '../core/sections';
import { ThemeService } from '../core/theme.service';
import type { ParticleEngine, SceneLayout } from './particle-engine';

/**
 * Lienzo 3D a pantalla completa detrás del contenido. Three.js se descarga
 * después del primer renderizado (import dinámico), así que la página aparece
 * al instante y la escena se suma cuando está lista.
 */
@Component({
  selector: 'app-particle-scene',
  template: `<canvas #canvas aria-hidden="true"></canvas>`,
  styles: `
    :host {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      opacity: 0;
      transition: opacity 1.2s ease;
    }
    :host(.is-ready) {
      opacity: 1;
    }
    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  `,
  host: { '[class.is-ready]': 'ready()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticleScene {
  private readonly theme = inject(ThemeService);
  private readonly motion = inject(MotionService);
  private readonly spy = inject(ScrollSpyService);
  private readonly scene = inject(SceneService);
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private readonly engine = signal<ParticleEngine | null>(null);
  private readonly viewportWidth = signal(typeof window === 'undefined' ? 1280 : window.innerWidth);
  protected readonly ready = signal(false);

  private readonly shape = computed(
    () => this.scene.shapeOverride() ?? SECTIONS.find((s) => s.id === this.spy.active())?.shape ?? 'planet',
  );

  /** Dónde se coloca la figura: a la derecha en la portada y de fondo en el resto. */
  private readonly layout = computed<SceneLayout>(() => {
    const wide = this.viewportWidth() >= 1024;
    if (this.scene.exploreMode()) return { x: 0, y: 0, scale: 1.15, opacity: 1 };
    if (this.spy.active() === 'home') {
      return wide ? { x: 2.35, y: 0, scale: 1, opacity: 1 } : { x: 0, y: 1.1, scale: 0.9, opacity: 0.7 };
    }
    return { x: wide ? 3.3 : 0, y: 0, scale: wide ? 1.05 : 1.2, opacity: wide ? 0.4 : 0.28 };
  });

  constructor() {
    afterNextRender(() => {
      const idle = window.requestIdleCallback ?? ((callback: () => void) => setTimeout(callback, 200));
      idle(() => void this.init());
    });

    effect(() => this.engine()?.setTheme(this.theme.isDark()));
    effect(() => this.engine()?.setShape(this.shape()));
    effect(() => this.engine()?.setLayout(this.layout()));
    effect(() => this.engine()?.setExplore(this.scene.exploreMode()));
    effect(() => this.engine()?.setReducedMotion(this.motion.reduced()));

    const onResize = () => this.viewportWidth.set(window.innerWidth);
    afterNextRender(() => window.addEventListener('resize', onResize, { passive: true }));

    inject(DestroyRef).onDestroy(() => {
      window.removeEventListener('resize', onResize);
      this.engine()?.dispose();
    });
  }

  private async init(): Promise<void> {
    if (!supportsWebGL()) {
      this.scene.markUnavailable();
      return;
    }
    try {
      const { ParticleEngine } = await import('./particle-engine');
      const engine = new ParticleEngine(this.canvas().nativeElement, {
        dark: this.theme.isDark(),
        reducedMotion: this.motion.reduced(),
        shape: this.shape(),
        layout: this.layout(),
        onContextLost: () => {
          this.ready.set(false);
          this.scene.markUnavailable();
        },
      });
      this.engine.set(engine);
      requestAnimationFrame(() => this.ready.set(true));
    } catch (error) {
      console.warn('No se pudo iniciar la escena 3D:', error);
      this.scene.markUnavailable();
    }
  }
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}
