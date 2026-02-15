

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { appConfigWithRoutes } from './app.config.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    ...appConfigWithRoutes,
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ]
};
