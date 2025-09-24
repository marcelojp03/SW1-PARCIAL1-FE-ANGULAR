import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Register Syncfusion license (trial mode - replace with actual license when available)
import { registerLicense } from '@syncfusion/ej2-base';


registerLicense('Ngo9BigBOggjGyl/Vkd+XU9FcVRDXXxIeEx0RWFcb1Z6dlJMZFVBNQtUQF1hTH5ad0NjUX1Wc3JXRGVeWkd3');

// Aplicar tema oscuro por defecto
document.documentElement.classList.add('app-dark');

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

// import { enableProdMode } from '@angular/core';
// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { AppModule } from './app/app.module';
// import { environment } from './environments/environment';

// if (environment.production) {
//   enableProdMode();
// }

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));
