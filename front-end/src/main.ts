import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { App } from './app/app.component';       // Your root component
import { appRouting } from './app/app.routes';   // Your routes

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    appRouting,
    importProvidersFrom(CommonModule, FormsModule, ReactiveFormsModule)
  ]
});
