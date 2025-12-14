// src/app/app.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideForms } from '@angular/forms';
import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { App } from './app.component'; // Your root component
import { routes } from './app.routes';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),   // enables routing
    provideForms(),          // enables [(ngModel)]
    provideCommonModule()    // enables *ngIf, *ngFor
  ]
});
