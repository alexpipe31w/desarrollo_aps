import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Paso 1: registra HttpClient en el inyector raiz.
    // withFetch() usa la Fetch API en lugar de XMLHttpRequest: es lo recomendado
    // en Angular moderno y lo unico que funciona bien si algun dia se activa SSR.
    provideHttpClient(withFetch()),
  ],
};
