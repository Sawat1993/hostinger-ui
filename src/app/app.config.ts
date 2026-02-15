import Aura from '@primeuix/themes/aura';


import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { appConfigWithRoutes } from './app.config.routes';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    ...appConfigWithRoutes,
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
            darkModeSelector: false || 'none'
        }
      }
    }),
    MessageService
  ]
};
