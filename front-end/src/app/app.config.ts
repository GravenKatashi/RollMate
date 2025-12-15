// src/app/app.config.ts

// Dynamically determine API URL based on current hostname
// This allows the same code to work on desktop (localhost) and mobile (IP address)
function getApiUrl(): string {
  // For Docker container networking
  return 'http://backend:8000/api';
}

import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};

// Keep the environment configuration for backward compatibility
export const environment = {
  production: false,
  apiUrl: getApiUrl(),
  appName: 'RollMate',
  version: '1.0.0'
};
