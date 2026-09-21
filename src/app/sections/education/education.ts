import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { I18nService } from '../../core/i18n/i18n.service';
import { CERTIFICATIONS, DEGREES, LANGUAGES } from '../../data/education';
import { Icon } from '../../shared/icon/icon';
import { Reveal } from '../../shared/reveal/reveal';
import { SectionHeading } from '../../shared/section-heading/section-heading';
import { Tilt } from '../../shared/tilt/tilt';

@Component({
  selector: 'app-education',
  imports: [Icon, Reveal, SectionHeading, Tilt],
  templateUrl: './education.html',
  styleUrl: './education.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Education {
  protected readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;
  protected readonly degrees = DEGREES;
  protected readonly certifications = CERTIFICATIONS;
  protected readonly languages = LANGUAGES;
}
