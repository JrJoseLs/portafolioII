import { DOCUMENT, Injectable, inject, signal } from '@angular/core';

import { ContentService } from './content.service';
import { I18nService } from './i18n/i18n.service';
import { ToastService } from './toast.service';

/** Acciones que se usan desde varios sitios (portada, contacto, buscador de comandos). */
@Injectable({ providedIn: 'root' })
export class PortfolioActionsService {
  private readonly document = inject(DOCUMENT);
  private readonly toast = inject(ToastService);
  private readonly i18n = inject(I18nService);
  private readonly content = inject(ContentService);

  /** Estado del buscador de comandos (Ctrl/⌘ + K). */
  readonly paletteOpen = signal(false);

  /** Abre el CV en Google Drive (solo visualización). */
  openCv(): void {
    this.openExternal(this.content.cvUrl());
  }

  async copyEmail(): Promise<void> {
    const t = this.i18n.t().contact;
    const email = this.content.email();
    try {
      await navigator.clipboard.writeText(email);
      this.toast.show(t.copied, 'check');
    } catch {
      this.toast.show(`${t.copyFailed} ${email}`, 'mail', 5000);
    }
  }

  openExternal(url: string): void {
    this.document.defaultView?.open(url, '_blank', 'noopener,noreferrer');
  }
}
