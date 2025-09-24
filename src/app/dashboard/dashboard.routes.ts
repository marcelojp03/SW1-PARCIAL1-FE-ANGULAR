// dashboard/dashboard.routes.ts
import { Routes } from '@angular/router';
import { ProjectsPage } from './components/projects-page.component';
import { UmlEditorComponent } from './components/uml-editor.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: ProjectsPage // Directamente mostrar la lista de proyectos
  }
];

export const editorRoutes: Routes = [
  {
    path: '',
    component: UmlEditorComponent // Usar el nuevo editor nativo de Syncfusion
  }
];