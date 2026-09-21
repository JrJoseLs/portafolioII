import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { formatDuration, formatMonth, monthsBetween } from '../../core/format';
import { I18nService } from '../../core/i18n/i18n.service';
import { EXPERIENCE } from '../../data/experience';
import { Icon } from '../../shared/icon/icon';
import { Reveal } from '../../shared/reveal/reveal';
import { SectionHeading } from '../../shared/section-heading/section-heading';
import { Tilt } from '../../shared/tilt/tilt';

@Component({
  selector: 'app-experience',
  imports: [Icon, Reveal, SectionHeading, Tilt],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Experience {
  protected readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;

  /** Empleos con el periodo y la duración ya formateados en el idioma activo. */
  protected readonly jobs = computed(() => {
    const lang = this.i18n.lang();
    const t = this.t().experience;
    return EXPERIENCE.map((job) => ({
      ...job,
      current: job.end === null,
      period: `${formatMonth(job.start, lang)} – ${job.end ? formatMonth(job.end, lang) : t.present}`,
      duration: formatDuration(monthsBetween(job.start, job.end), t),
    }));
  });
}
