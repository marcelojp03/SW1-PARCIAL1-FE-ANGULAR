// app.routes.ts
import { Routes } from '@angular/router';
import { AppLayout } from './core/layouts/component/app.layout';
import { Notfound } from './core/layouts/component/notfound';
import { authGuard, authMatchGuard } from './core/guards/auth.guard';
import { loggedResolver } from './core/guards/logged.guard';
//import { UmlEditorComponent } from './dashboard/components/uml-editor/uml-editor.component';

export const appRoutes: Routes = [
    // Zona protegida por authGuard
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
        {
            path: '',
            redirectTo: 'projects',
            pathMatch: 'full'
        },
        {
            path: 'projects',
            // proteger el lazy con canMatch con doble capa
            canMatch: [authMatchGuard],
            loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.dashboardRoutes)
        },
        {
            path: 'p/:id',
            // Editor privado por id
            canMatch: [authMatchGuard],
            loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.editorRoutes)
        }
        ]
    },

    // Editor UML sin layout padre (pantalla completa)
    // {
    //     path: 'editor/:id',
    //     component: UmlEditorComponent,
    //     canActivate: [authGuard]
    // },

    // Auth (redirige si ya está logueado)
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes),
        resolve: [loggedResolver]
    },

    { path: 'not-found', component: Notfound },
    { path: '**', redirectTo: 'not-found' }
];
