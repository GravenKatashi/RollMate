import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app.component';
import { routes } from './app.routes';
import { importProvidersFrom } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),  // Use routes here, not appRouting
    provideHttpClient(),
    importProvidersFrom(CommonModule, FormsModule, ReactiveFormsModule)
  ]
});