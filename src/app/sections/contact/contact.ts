import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ContentService } from '../../core/content.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { PortfolioActionsService } from '../../core/portfolio-actions.service';
import { PROFILE } from '../../data/profile';
import { Icon } from '../../shared/icon/icon';
import { Reveal } from '../../shared/reveal/reveal';
import { SectionHeading } from '../../shared/section-heading/section-heading';
import { Tilt } from '../../shared/tilt/tilt';

@Component({
  selector: 'app-contact',
  imports: [Icon, Reveal, SectionHeading, Tilt],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  protected readonly i18n = inject(I18nService);
  protected readonly actions = inject(PortfolioActionsService);
  protected readonly content = inject(ContentService);
  protected readonly t = this.i18n.t;

  protected readonly name = signal('');
  protected readonly message = signal('');
  protected readonly canSend = computed(() => this.message().trim().length > 0);

  /** Texto final del mensaje, con saludo si el visitante escribió su nombre. */
  private readonly body = computed(() => {
    const name = this.name().trim();
    const greeting = name ? `${this.t().contact.greeting} ${name}.\n\n` : '';
    return `${greeting}${this.message().trim()}`;
  });

  protected sendEmail(): void {
    if (!this.canSend()) return;
    const subject = encodeURIComponent(this.t().contact.subject);
    window.location.href = `mailto:${this.content.email()}?subject=${subject}&body=${encodeURIComponent(this.body())}`;
  }

  protected sendWhatsapp(): void {
    if (!this.canSend()) return;
    this.actions.openExternal(`https://wa.me/${PROFILE.whatsappNumber}?text=${encodeURIComponent(this.body())}`);
  }
}
