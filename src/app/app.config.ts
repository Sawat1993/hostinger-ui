import Aura from '@primeuix/themes/aura';


import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './services/auth.interceptor';
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
    MessageService,
    provideHttpClient(withInterceptors([
      authInterceptor
    ])),
  ]
};
