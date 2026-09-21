import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject } from '@angular/core';

import { I18nService } from './core/i18n/i18n.service';
import { PortfolioActionsService } from './core/portfolio-actions.service';
import { SceneService } from './core/scene.service';
import { ScrollSpyService } from './core/scroll-spy.service';
import { CommandPalette } from './layout/command-palette/command-palette';
import { Footer } from './layout/footer/footer';
import { Navbar } from './layout/navbar/navbar';
import { Toast } from './layout/toast/toast';
import { About } from './sections/about/about';
import { Contact } from './sections/contact/contact';
import { Education } from './sections/education/education';
import { Experience } from './sections/experience/experience';
import { Hero } from './sections/hero/hero';
import { Projects } from './sections/projects/projects';
import { Skills } from './sections/skills/skills';
import { ExploreHud } from './three/explore-hud';
import { ParticleScene } from './three/particle-scene';

/** Componente raíz: estructura de la página y atajos de teclado globales. */
@Component({
  selector: 'app-root',
  imports: [
    About,
    CommandPalette,
    Contact,
    Education,
    Experience,
    ExploreHud,
    Footer,
    Hero,
    Navbar,
    ParticleScene,
    Projects,
    Skills,
    Toast,
  ],
  templateUrl: './app.html',
  host: { '(document:keydown)': 'onKeydown($event)' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly t = inject(I18nService).t;
  private readonly actions = inject(PortfolioActionsService);
  private readonly scene = inject(SceneService);
  private readonly spy = inject(ScrollSpyService);

  constructor() {
    afterNextRender(() => this.spy.start());
    inject(DestroyRef).onDestroy(() => this.spy.stop());
  }

  protected onKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.actions.paletteOpen.update((open) => !open);
    } else if (event.key === 'Escape' && this.scene.exploreMode()) {
      this.scene.exitExplore();
    }
  }

  protected skipToContent(event: Event): void {
    event.preventDefault();
    this.spy.scrollTo('about');
  }
}
