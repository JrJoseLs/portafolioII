import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';

import { ContentService } from './core/content.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    // Carga public/content.json (los cambios hechos desde el panel de edición).
    provideAppInitializer(() => inject(ContentService).load()),
  ],
};
