import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { I18nService } from '../../core/i18n/i18n.service';
import { PROFILE } from '../../data/profile';
import { FEATURED_PROJECTS, MORE_PROJECTS, Project, ProjectCategory } from '../../data/projects';
import { Icon } from '../../shared/icon/icon';
import { Reveal } from '../../shared/reveal/reveal';
import { SectionHeading } from '../../shared/section-heading/section-heading';
import { Tilt } from '../../shared/tilt/tilt';

type Filter = 'all' | ProjectCategory;

@Component({
  selector: 'app-projects',
  imports: [Icon, Reveal, SectionHeading, Tilt],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projects {
  protected readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;
  protected readonly githubUrl = PROFILE.githubUrl;

  protected readonly filter = signal<Filter>('all');

  /** Filtros con el número de proyectos de cada categoría. */
  protected readonly filters = computed(() => {
    const labels = this.t().projects.filters;
    const all = [...FEATURED_PROJECTS, ...MORE_PROJECTS];
    return (['all', 'three', 'web', 'data'] as const).map((id) => ({
      id,
      label: labels[id],
      count: id === 'all' ? all.length : all.filter((p) => p.category === id).length,
    }));
  });

  protected readonly featured = computed(() => this.applyFilter(FEATURED_PROJECTS));
  protected readonly more = computed(() => this.applyFilter(MORE_PROJECTS));

  private applyFilter(projects: readonly Project[]): readonly Project[] {
    const filter = this.filter();
    return filter === 'all' ? projects : projects.filter((project) => project.category === filter);
  }
}
