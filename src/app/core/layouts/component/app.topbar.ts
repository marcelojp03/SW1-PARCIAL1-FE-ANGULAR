import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { SharedModule } from '../../../shared/shared.module';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, SharedModule],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <!-- Botón de menú oculto para maximizar espacio del diagramador -->
            <!-- <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button> -->
            <a class="layout-topbar-logo" routerLink="/">
                <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M17.1637 19.2467C17.1566 19.4033 17.1529 19.561 17.1529 19.7194C17.1529 25.3503 21.7203 29.915 27.3546 29.915C32.9887 29.915 37.5561 25.3503 37.5561 19.7194C37.5561 19.5572 37.5524 19.3959 37.5449 19.2355C38.5617 19.0801 39.5759 18.9013 40.5867 18.6994L40.6926 18.6782C40.7191 19.0218 40.7326 19.369 40.7326 19.7194C40.7326 27.1036 34.743 33.0896 27.3546 33.0896C19.966 33.0896 13.9765 27.1036 13.9765 19.7194C13.9765 19.374 13.9896 19.0316 14.0154 18.6927L14.0486 18.6994C15.0837 18.9062 16.1223 19.0886 17.1637 19.2467ZM33.3284 11.4538C31.6493 10.2396 29.5855 9.52381 27.3546 9.52381C25.1195 9.52381 23.0524 10.2421 21.3717 11.4603C20.0078 11.3232 18.6475 11.1387 17.2933 10.907C19.7453 8.11308 23.3438 6.34921 27.3546 6.34921C31.36 6.34921 34.9543 8.10844 37.4061 10.896C36.0521 11.1292 34.692 11.3152 33.3284 11.4538ZM43.826 18.0518C43.881 18.6003 43.9091 19.1566 43.9091 19.7194C43.9091 28.8568 36.4973 36.2642 27.3546 36.2642C18.2117 36.2642 10.8 28.8568 10.8 19.7194C10.8 19.1615 10.8276 18.61 10.8816 18.0663L7.75383 17.4411C7.66775 18.1886 7.62354 18.9488 7.62354 19.7194C7.62354 30.6102 16.4574 39.4388 27.3546 39.4388C38.2517 39.4388 47.0855 30.6102 47.0855 19.7194C47.0855 18.9439 47.0407 18.1789 46.9536 17.4267L43.826 18.0518ZM44.2613 9.54743L40.9084 10.2176C37.9134 5.95821 32.9593 3.1746 27.3546 3.1746C21.7442 3.1746 16.7856 5.96385 13.7915 10.2305L10.4399 9.56057C13.892 3.83178 20.1756 0 27.3546 0C34.5281 0 40.8075 3.82591 44.2613 9.54743Z"
                        fill="var(--primary-color)"
                    />
                    <mask id="mask0_1413_1551" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="0" y="8" width="54" height="11">
                        <path d="M27 18.3652C10.5114 19.1944 0 8.88892 0 8.88892C0 8.88892 16.5176 14.5866 27 14.5866C37.4824 14.5866 54 8.88892 54 8.88892C54 8.88892 43.4886 17.5361 27 18.3652Z" fill="var(--primary-color)" />
                    </mask>
                    <g mask="url(#mask0_1413_1551)">
                        <path
                            d="M27 26.0151V3.15796C30.1348 3.15796 37.2976 -3.70901 19.6996 -3.7022L19.7019 -3.68858C19.7066 -3.67095L19.7127 -3.6494C19.72 -3.60629L19.7348 -3.54745C19.7548 -3.47359L19.7797 -3.32589C19.8296 -3.11788L19.8993 -2.85516C19.986 -2.33008L20.1593 -1.58425C20.4011 -0.662589L20.6886 1.17485C21.2618 3.74125L22.026 6.67073C22.7931 12.2327L24.2495 20.1913L26.0151 27L26.0151V3.15796Z"
                            fill="var(--primary-color)"
                        />
                    </g>
                </svg>
                <span>DATABASE DESIGNER</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <button
                        type="button"
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" 
                pStyleClass="@next" 
                enterFromClass="hidden" 
                enterActiveClass="animate-scalein" 
                leaveToClass="hidden" 
                leaveActiveClass="animate-fadeout" 
                [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-inbox"></i>
                        <span>Messages</span>
                    </button>

                    <!-- Botón de perfil con overlay menu -->
                    <div class="relative">
                        <!-- Menú flotante -->
                        <p-menu
                        #profileMenu
                        [popup]="true"
                        [model]="profileItems"
                        [appendTo]="'body'"
                        [baseZIndex]="1200"
                        styleClass="min-w-56"
                        ></p-menu>

                        <!-- Toggler -->
                        <button
                            pButton
                            type="button"
                            class="layout-topbar-action layout-topbar-action-highlight"
                            (click)="profileMenu.toggle($event)"
                            aria-haspopup="true"
                            aria-controls="profileMenu"
                            title="Opciones"
                            >
                            <i class="pi pi-cog text-lg"></i>
                            <span>Configuración</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar {
    items!: MenuItem[];
    profileItems: MenuItem[] = [];
    
    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router
    ) {
        this.profileItems = [
        {
            label: 'Perfil',
            icon: 'pi pi-user',
            command: () => this.goProfile()
        },
        {
            label: 'Notificaciones',
            icon: 'pi pi-bell',
            disabled: true
        },
        { separator: true },
        {
            label: 'Cerrar sesión',
            icon: 'pi pi-sign-out',
            command: () => this.onLogout()
        }
        ];
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
    goProfile() {
        this.router.navigate(['/dashboard/perfil']); 
    }

    onLogout() {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
    }
}
