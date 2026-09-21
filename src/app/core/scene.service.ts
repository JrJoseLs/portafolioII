import { DOCUMENT, Injectable, inject, signal } from '@angular/core';

import type { ShapeName } from '../three/shapes';

/**
 * Estado compartido entre la escena 3D y la interfaz: el modo exploración
 * (se oculta el contenido y se puede manipular la figura) y la figura elegida.
 */
@Injectable({ providedIn: 'root' })
export class SceneService {
  private readonly root = inject(DOCUMENT).documentElement;

  private readonly exploring = signal(false);
  private readonly chosenShape = signal<ShapeName | null>(null);
  private readonly webgl = signal(true);

  readonly exploreMode = this.exploring.asReadonly();
  /** Figura elegida en el modo exploración (`null` = la de la sección activa). */
  readonly shapeOverride = this.chosenShape.asReadonly();
  /** `false` si el navegador no puede mostrar WebGL: se oculta todo lo relacionado con 3D. */
  readonly available = this.webgl.asReadonly();

  enterExplore(): void {
    if (!this.webgl()) return;
    this.exploring.set(true);
    this.root.classList.add('is-exploring');
  }

  exitExplore(): void {
    this.exploring.set(false);
    this.chosenShape.set(null);
    this.root.classList.remove('is-exploring');
  }

  chooseShape(shape: ShapeName): void {
    this.chosenShape.set(shape);
  }

  markUnavailable(): void {
    this.webgl.set(false);
    this.exitExplore();
  }
}
