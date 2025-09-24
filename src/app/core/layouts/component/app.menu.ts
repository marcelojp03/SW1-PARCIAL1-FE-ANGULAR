import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { LayoutService } from '../service/layout.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];
    constructor(
        private layoutService: LayoutService
    ){
        effect(() => {
            this.model = this.layoutService.menu();
        });
    }

    ngOnInit() {
        // Configurar menú estático para Database Designer
        this.model = [
            {
                label: 'Database Designer',
                items: [
                    { 
                        label: 'Mis Proyectos', 
                        icon: 'pi pi-fw pi-folder', 
                        routerLink: ['/projects'] 
                    }
                ]
            },
            {
                label: 'Herramientas',
                items: [
                    { 
                        label: 'Nuevo Proyecto', 
                        icon: 'pi pi-fw pi-plus', 
                        routerLink: ['/projects'],
                        queryParams: { action: 'new' }
                    },
                    { 
                        label: 'Plantillas', 
                        icon: 'pi pi-fw pi-clone', 
                        routerLink: ['/templates'] 
                    },
                    { 
                        label: 'Importar Diagrama', 
                        icon: 'pi pi-fw pi-upload', 
                        routerLink: ['/import'] 
                    }
                ]
            },
            {
                label: 'Configuración',
                items: [
                    { 
                        label: 'Perfil', 
                        icon: 'pi pi-fw pi-user', 
                        routerLink: ['/profile'] 
                    },
                    { 
                        label: 'Preferencias', 
                        icon: 'pi pi-fw pi-cog', 
                        routerLink: ['/settings'] 
                    },
                    { 
                        label: 'Ayuda', 
                        icon: 'pi pi-fw pi-question-circle', 
                        routerLink: ['/help'] 
                    }
                ]
            }
        ];
    }
}
