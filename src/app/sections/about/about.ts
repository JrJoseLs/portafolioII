import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ContentService } from '../../core/content.service';
import { monthsBetween } from '../../core/format';
import { I18nService } from '../../core/i18n/i18n.service';
import { EXPERIENCE } from '../../data/experience';
import { PROFILE } from '../../data/profile';
import { FEATURED_PROJECTS } from '../../data/projects';
import { CountUp } from '../../shared/count-up/count-up';
import { Icon } from '../../shared/icon/icon';
import { Reveal } from '../../shared/reveal/reveal';
import { SectionHeading } from '../../shared/section-heading/section-heading';
import { Tilt } from '../../shared/tilt/tilt';

@Component({
  selector: 'app-about',
  imports: [CountUp, Icon, Reveal, SectionHeading, Tilt],
  templateUrl: './about.html',
  styleUrl: './about.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  protected readonly i18n = inject(I18nService);
  protected readonly content = inject(ContentService);
  protected readonly t = this.i18n.t;
  protected readonly profile = PROFILE;

  /**
   * Años completos de experiencia, calculados a partir de las fechas de cada
   * empleo (se resta 1 mes por empleo porque monthsBetween cuenta ambos extremos).
   */
  protected readonly years = Math.floor(
    EXPERIENCE.reduce((total, job) => total + monthsBetween(job.start, job.end) - 1, 0) / 12,
  );
  protected readonly featuredCount = FEATURED_PROJECTS.length;
}
