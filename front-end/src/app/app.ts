import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app.component';
import { appRouting } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

bootstrapApplication(App, {
  providers: [
    appRouting,
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(CommonModule, FormsModule, ReactiveFormsModule)
  ]
});