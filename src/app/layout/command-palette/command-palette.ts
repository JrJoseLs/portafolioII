import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import { I18nService } from '../../core/i18n/i18n.service';
import { PortfolioActionsService } from '../../core/portfolio-actions.service';
import { SceneService } from '../../core/scene.service';
import { ScrollSpyService } from '../../core/scroll-spy.service';
import { SECTIONS } from '../../core/sections';
import { ThemeService } from '../../core/theme.service';
import { SOCIAL_LINKS } from '../../data/profile';
import { Icon } from '../../shared/icon/icon';
import { IconName } from '../../shared/icon/icons';

interface Command {
  readonly id: string;
  readonly group: 'navigation' | 'actions' | 'links';
  readonly label: string;
  readonly icon: IconName;
  /** Palabras extra para la búsqueda (en ambos idiomas). */
  readonly keywords?: string;
  readonly run: () => void;
}

/** Busca sin distinguir mayúsculas ni tildes: "formacion" encuentra "Formación". */
function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

/** Buscador de comandos estilo Spotlight: navegar, cambiar tema/idioma, descargar el CV… */
@Component({
  selector: 'app-command-palette',
  imports: [Icon],
  templateUrl: './command-palette.html',
  styleUrl: './command-palette.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandPalette {
  private readonly i18n = inject(I18nService);
  private readonly theme = inject(ThemeService);
  private readonly spy = inject(ScrollSpyService);
  private readonly scene = inject(SceneService);
  protected readonly actions = inject(PortfolioActionsService);

  protected readonly t = this.i18n.t;
  protected readonly query = signal('');
  protected readonly activeIndex = signal(0);

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');
  private readonly list = viewChild<ElementRef<HTMLElement>>('list');

  private readonly commands = computed<Command[]>(() => {
    const t = this.t().palette;
    const lang = this.i18n.lang();
    const navigation: Command[] = SECTIONS.map((section) => ({
      id: `go-${section.id}`,
      group: 'navigation',
      label: `${t.goTo} ${section.label[lang]}`,
      icon: section.icon,
      keywords: `${section.label.es} ${section.label.en}`,
      run: () => this.spy.scrollTo(section.id),
    }));

    const actions: Command[] = [
      { id: 'theme', group: 'actions', label: t.toggleTheme, icon: this.theme.isDark() ? 'sun' : 'moon', keywords: 'tema theme dark light oscuro claro modo', run: () => this.theme.toggle() },
      { id: 'lang', group: 'actions', label: t.switchLang, icon: 'languages', keywords: 'idioma language english español ingles', run: () => this.i18n.toggle() },
      { id: 'cv', group: 'actions', label: t.downloadCv, icon: 'download', keywords: 'cv curriculum resume pdf descargar download', run: () => this.actions.downloadCv('cv') },
      { id: 'resume', group: 'actions', label: t.downloadResume, icon: 'file-text', keywords: 'cv curriculum resume pdf english ingles', run: () => this.actions.downloadCv('resume') },
      { id: 'email', group: 'actions', label: t.copyEmail, icon: 'copy', keywords: 'email correo mail copiar copy contacto contact', run: () => void this.actions.copyEmail() },
    ];
    if (this.scene.available()) {
      actions.push({ id: 'explore', group: 'actions', label: t.explore, icon: 'move-3d', keywords: '3d three explorar explore particulas particles', run: () => this.scene.enterExplore() });
    }

    const links: Command[] = SOCIAL_LINKS.map((link) => ({
      id: `link-${link.id}`,
      group: 'links',
      label: link.label,
      icon: link.icon,
      keywords: link.handle,
      run: () => this.actions.openExternal(link.url),
    }));

    return [...navigation, ...actions, ...links];
  });

  protected readonly results = computed(() => {
    const terms = normalize(this.query().trim()).split(/\s+/).filter(Boolean);
    if (!terms.length) return this.commands();
    return this.commands().filter((command) => {
      const haystack = normalize(`${command.label} ${command.keywords ?? ''}`);
      return terms.every((term) => haystack.includes(term));
    });
  });

  /** Resultados agrupados por sección, conservando el índice global para el teclado. */
  protected readonly groups = computed(() => {
    const t = this.t().palette;
    const titles = { navigation: t.navigation, actions: t.actions, links: t.links };
    const indexed = this.results().map((command, index) => ({ command, index }));
    return (['navigation', 'actions', 'links'] as const)
      .map((group) => ({ id: group, title: titles[group], items: indexed.filter((item) => item.command.group === group) }))
      .filter((group) => group.items.length);
  });

  constructor() {
    afterRenderEffect(() => {
      const dialog = this.dialog().nativeElement;
      if (this.actions.paletteOpen() && !dialog.open) {
        this.query.set('');
        this.activeIndex.set(0);
        dialog.showModal();
        this.input().nativeElement.focus();
      } else if (!this.actions.paletteOpen() && dialog.open) {
        dialog.close();
      }
    });
  }

  protected close(): void {
    this.actions.paletteOpen.set(false);
  }

  protected onSearch(value: string): void {
    this.query.set(value);
    this.activeIndex.set(0);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const count = this.results().length;
    if (!count) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      this.activeIndex.update((index) => (index + step + count) % count);
      this.scrollActiveIntoView();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.execute(this.results()[this.activeIndex()]);
    }
  }

  protected execute(command: Command | undefined): void {
    if (!command) return;
    this.close();
    // Se espera a que el diálogo se cierre para no interferir con el scroll o el foco.
    requestAnimationFrame(() => command.run());
  }

  /** Clic fuera del panel (sobre el fondo del diálogo) = cerrar. */
  protected onDialogClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.close();
  }

  private scrollActiveIntoView(): void {
    requestAnimationFrame(() =>
      this.list()?.nativeElement.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' }),
    );
  }
}
