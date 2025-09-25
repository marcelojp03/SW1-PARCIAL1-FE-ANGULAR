// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Register Syncfusion license from environment variables
import { registerLicense } from '@syncfusion/ej2-base';

// Get license from environment variable (fallback to trial license)
const syncfusionLicense = (window as any).__env?.['SYNCFUSION_LICENSE_KEY'] || 'Ngo9BigBOggjGyl/Vkd+XU9FcVRDXXxIeEx0RWFcb1Z6dlJMZFVBNQtUQF1hTH5ad0NjUX1Wc3JXRGVeWkd3';

registerLicense(syncfusionLicense);

// Aplicar tema oscuro por defecto
document.documentElement.classList.add('app-dark');

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
