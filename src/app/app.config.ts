
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { appConfigWithRoutes } from './app.config.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    ...appConfigWithRoutes
  ]
};
