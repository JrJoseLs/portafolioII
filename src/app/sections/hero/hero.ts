import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';

import { ContentService } from '../../core/content.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { MotionService } from '../../core/motion.service';
import { SceneService } from '../../core/scene.service';
import { ScrollSpyService } from '../../core/scroll-spy.service';
import { Icon } from '../../shared/icon/icon';
import { Reveal } from '../../shared/reveal/reveal';

@Component({
  selector: 'app-hero',
  imports: [Icon, Reveal],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  protected readonly i18n = inject(I18nService);
  protected readonly scene = inject(SceneService);
  protected readonly spy = inject(ScrollSpyService);
  protected readonly content = inject(ContentService);
  private readonly motion = inject(MotionService);

  protected readonly t = this.i18n.t;
  protected readonly emailHref = computed(() => `mailto:${this.content.email()}`);

  /** Texto del rol que se "escribe" letra a letra. */
  protected readonly typed = signal('');
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    // Reinicia la animación cuando cambia el idioma.
    effect(() => {
      const roles = this.t().hero.roles;
      clearTimeout(this.timer);
      if (this.motion.reduced()) this.rotate(roles, 0);
      else this.type(roles, 0, 0, false);
    });
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  /** Efecto máquina de escribir: escribe, espera, borra y pasa al siguiente rol. */
  private type(roles: readonly string[], index: number, length: number, deleting: boolean): void {
    const word = roles[index];
    this.typed.set(word.slice(0, length));

    let delay = deleting ? 35 : 70;
    let next: [number, number, boolean] = [index, length + (deleting ? -1 : 1), deleting];
    if (!deleting && length === word.length) {
      delay = 2200;
      next = [index, length, true];
    } else if (deleting && length === 0) {
      delay = 350;
      next = [(index + 1) % roles.length, 0, false];
    }
    this.timer = setTimeout(() => this.type(roles, ...next), delay);
  }

  /** Versión sin animación de letras (movimiento reducido): cambia la palabra completa. */
  private rotate(roles: readonly string[], index: number): void {
    this.typed.set(roles[index]);
    this.timer = setTimeout(() => this.rotate(roles, (index + 1) % roles.length), 3000);
  }
}
