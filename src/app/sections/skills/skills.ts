import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { I18nService } from '../../core/i18n/i18n.service';
import { SKILL_GROUPS, STACK_MARQUEE, Skill } from '../../data/skills';
import { Icon } from '../../shared/icon/icon';
import { Reveal } from '../../shared/reveal/reveal';
import { SectionHeading } from '../../shared/section-heading/section-heading';

@Component({
  selector: 'app-skills',
  imports: [Icon, Reveal, SectionHeading],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Skills {
  protected readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;
  protected readonly groups = SKILL_GROUPS;
  /** La cinta se duplica para que el desplazamiento infinito no tenga saltos. */
  protected readonly marquee = [...STACK_MARQUEE, ...STACK_MARQUEE];

  protected readonly selectedId = signal(SKILL_GROUPS[0].id);
  protected readonly selected = computed(() => SKILL_GROUPS.find((g) => g.id === this.selectedId()) ?? SKILL_GROUPS[0]);

  protected name(skill: Skill): string {
    return typeof skill.name === 'string' ? skill.name : skill.name[this.i18n.lang()];
  }

  /** Navegación con flechas entre pestañas (patrón WAI-ARIA de tabs). */
  protected onTabKeydown(event: KeyboardEvent, index: number): void {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    const step = keys[event.key];
    if (!step) return;
    event.preventDefault();
    const next = (index + step + this.groups.length) % this.groups.length;
    this.selectedId.set(this.groups[next].id);
    const tablist = (event.currentTarget as HTMLElement).parentElement;
    (tablist?.children[next] as HTMLElement | undefined)?.focus();
  }
}
