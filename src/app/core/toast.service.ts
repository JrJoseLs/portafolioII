import { Injectable, signal } from '@angular/core';

import type { IconName } from '../shared/icon/icons';

export interface Toast {
  readonly id: number;
  readonly text: string;
  readonly icon: IconName;
}

/** Notificaciones breves (p. ej. "Correo copiado"). Solo se muestra una a la vez. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly current = signal<Toast | null>(null);
  private timer?: ReturnType<typeof setTimeout>;
  private nextId = 0;

  readonly toast = this.current.asReadonly();

  show(text: string, icon: IconName = 'check', duration = 2600): void {
    clearTimeout(this.timer);
    this.current.set({ id: ++this.nextId, text, icon });
    this.timer = setTimeout(() => this.current.set(null), duration);
  }
}
