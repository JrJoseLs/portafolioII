import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ToastService } from '../../core/toast.service';
import { Icon } from '../../shared/icon/icon';

/** Aviso flotante en la parte inferior (anunciado a lectores de pantalla). */
@Component({
  selector: 'app-toast',
  imports: [Icon],
  template: `
    <div class="region" role="status" aria-live="polite">
      @if (toasts.toast(); as toast) {
        @for (item of [toast]; track item.id) {
          <div class="toast glass-strong">
            <span class="toast__icon"><app-icon [name]="item.icon" /></span>
            {{ item.text }}
          </div>
        }
      }
    </div>
  `,
  styles: `
    .region {
      position: fixed;
      left: 50%;
      bottom: max(1.5rem, env(safe-area-inset-bottom));
      translate: -50% 0;
      z-index: 60;
      pointer-events: none;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.7rem 1.1rem 0.7rem 0.7rem;
      border-radius: 999px;
      font-size: 0.9rem;
      font-weight: 500;
      white-space: nowrap;
      animation: toast-in 0.45s var(--ease-spring);
    }
    .toast__icon {
      display: grid;
      place-items: center;
      width: 1.8rem;
      height: 1.8rem;
      border-radius: 50%;
      background: var(--gradient);
      color: #fff;
      --icon-size: 1rem;
    }
    @keyframes toast-in {
      from {
        opacity: 0;
        transform: translateY(16px) scale(0.9);
      }
    }
    @media (max-width: 860px) {
      .region {
        bottom: calc(max(0.75rem, env(safe-area-inset-bottom)) + 5rem);
      }
      .toast {
        white-space: normal;
        max-width: calc(100vw - 2rem);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast {
  protected readonly toasts = inject(ToastService);
}
