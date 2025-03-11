import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

import { JwtInterceptor } from '../Interceptors/jwt.interceptor';
import { HTTP_INTERCEPTORS, withFetch } from '@angular/common/http';

import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    provideHttpClient(withFetch()),
  ],
};
