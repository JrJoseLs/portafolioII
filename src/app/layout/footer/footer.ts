import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { I18nService } from '../../core/i18n/i18n.service';
import { PortfolioActionsService } from '../../core/portfolio-actions.service';
import { ScrollSpyService } from '../../core/scroll-spy.service';
import { PROFILE, SOCIAL_LINKS } from '../../data/profile';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-footer',
  imports: [Icon],
  template: `
    <footer class="footer">
      <div class="container footer__inner">
        <div class="footer__brand">
          <span class="footer__mark gradient-text">JL</span>
          <div>
            <p class="footer__name">{{ profile.name }}</p>
            <p class="footer__made">{{ t().footer.made }}</p>
          </div>
        </div>

        <button type="button" class="footer__palette" (click)="actions.paletteOpen.set(true)">
          <app-icon name="command" />
          {{ paletteHint() }}
        </button>

        <div class="footer__end">
          <ul class="footer__socials">
            @for (social of socials; track social.id) {
              <li>
                <a class="icon-btn" [href]="social.url" target="_blank" rel="noopener noreferrer" [attr.aria-label]="social.label">
                  <app-icon [name]="social.icon" />
                </a>
              </li>
            }
          </ul>
          <button type="button" class="icon-btn glass" [attr.aria-label]="t().a11y.backToTop" [title]="t().a11y.backToTop" (click)="spy.scrollTo('home')">
            <app-icon name="arrow-up" />
          </button>
        </div>
      </div>
      <p class="footer__copy">© {{ year }} {{ profile.name }}</p>
    </footer>
  `,
  styles: `
    .footer {
      position: relative;
      padding: 3rem 0 2rem;
      border-top: 1px solid var(--border);
      background: color-mix(in srgb, var(--bg) 70%, transparent);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
    .footer__inner {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
    .footer__brand {
      display: flex;
      align-items: center;
      gap: 0.9rem;
    }
    .footer__mark {
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.05em;
    }
    .footer__name {
      font-weight: 600;
    }
    .footer__made {
      font-size: 0.85rem;
      color: var(--muted);
    }
    .footer__palette {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.55rem 0.9rem;
      border-radius: 999px;
      border: 1px dashed var(--border-strong);
      font-size: 0.82rem;
      color: var(--text-2);
      transition: border-color 0.2s ease, color 0.2s ease;
    }
    .footer__palette:hover {
      border-color: var(--accent);
      color: var(--text);
    }
    .footer__end {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .footer__socials {
      display: flex;
      gap: 0.25rem;
      list-style: none;
    }
    .footer__copy {
      margin-top: 2rem;
      text-align: center;
      font-size: 0.78rem;
      color: var(--muted);
    }
    @media (max-width: 860px) {
      .footer {
        padding-bottom: 7rem;
      }
      .footer__palette {
        display: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected readonly t = inject(I18nService).t;
  protected readonly actions = inject(PortfolioActionsService);
  protected readonly spy = inject(ScrollSpyService);
  protected readonly profile = PROFILE;
  protected readonly socials = SOCIAL_LINKS;
  protected readonly year = new Date().getFullYear();

  private readonly isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
  protected readonly paletteHint = computed(() =>
    this.t().footer.palette.replace('{key}', this.isMac ? '⌘ K' : 'Ctrl + K'),
  );
}
