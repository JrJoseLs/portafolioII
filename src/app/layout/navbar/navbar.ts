import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ContentService } from '../../core/content.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { PortfolioActionsService } from '../../core/portfolio-actions.service';
import { ScrollSpyService } from '../../core/scroll-spy.service';
import { SECTIONS, SectionId } from '../../core/sections';
import { ThemeService } from '../../core/theme.service';
import { Icon } from '../../shared/icon/icon';

/**
 * Navegación flotante estilo "dock". En escritorio es una píldora superior;
 * en móvil los controles quedan arriba y las secciones pasan a una barra
 * inferior, como las pestañas de iOS.
 */
@Component({
  selector: 'app-navbar',
  imports: [Icon],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  protected readonly i18n = inject(I18nService);
  protected readonly theme = inject(ThemeService);
  protected readonly spy = inject(ScrollSpyService);
  protected readonly content = inject(ContentService);
  private readonly actions = inject(PortfolioActionsService);

  protected readonly t = this.i18n.t;
  protected readonly sections = SECTIONS;
  protected readonly isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

  protected readonly themeLabel = computed(() => (this.theme.isDark() ? this.t().a11y.toLight : this.t().a11y.toDark));

  protected go(event: Event, id: SectionId): void {
    event.preventDefault();
    this.spy.scrollTo(id);
  }

  protected toggleTheme(event: MouseEvent): void {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    this.theme.toggle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  }

  protected openPalette(): void {
    this.actions.paletteOpen.set(true);
  }
}
