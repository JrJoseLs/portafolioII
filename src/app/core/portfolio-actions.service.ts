import { DOCUMENT, Injectable, inject, signal } from '@angular/core';

import { CV_FILES, CvFile, PROFILE } from '../data/profile';
import { I18nService } from './i18n/i18n.service';
import { ToastService } from './toast.service';

/** Acciones que se usan desde varios sitios (portada, contacto, buscador de comandos). */
@Injectable({ providedIn: 'root' })
export class PortfolioActionsService {
  private readonly document = inject(DOCUMENT);
  private readonly toast = inject(ToastService);
  private readonly i18n = inject(I18nService);

  /** Estado del buscador de comandos (Ctrl/⌘ + K). */
  readonly paletteOpen = signal(false);

  downloadCv(id: CvFile['id'] = 'cv'): void {
    const cv = CV_FILES.find((file) => file.id === id) ?? CV_FILES[0];
    const link = this.document.createElement('a');
    link.href = cv.file;
    link.download = cv.file.split('/').pop() ?? 'cv.pdf';
    link.click();
  }

  async copyEmail(): Promise<void> {
    const t = this.i18n.t().contact;
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      this.toast.show(t.copied, 'check');
    } catch {
      this.toast.show(`${t.copyFailed} ${PROFILE.email}`, 'mail', 5000);
    }
  }

  openExternal(url: string): void {
    this.document.defaultView?.open(url, '_blank', 'noopener,noreferrer');
  }
}
