import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NewProjectDialog } from './new-project-dialog.component';
import { ProjectService, Project } from '../../shared/services/project.service';

@Component({
  selector: 'dashboard-projects-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NewProjectDialog],
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Mis Proyectos</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Gestiona tus diagramas de base de datos</p>
        </div>
        <button 
          (click)="showNewDialog = true" 
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <i class="pi pi-plus"></i>
          Nuevo Proyecto
        </button>
      </div>

      <!-- Barra de búsqueda -->
      <div class="mb-6">
        <div class="relative">
          <i class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input 
            [(ngModel)]="filter" 
            placeholder="Buscar proyectos..." 
            class="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <!-- Loading state -->
      <div *ngIf="loading" class="flex justify-center items-center py-12">
        <i class="pi pi-spinner pi-spin text-2xl text-gray-400"></i>
        <span class="ml-2 text-gray-600">Cargando proyectos...</span>
      </div>

      <!-- Grid de proyectos -->
      <div *ngIf="!loading" class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <ng-container *ngFor="let project of filteredProjects">
          <div class="bg-white dark:bg-gray-800 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer"
               (click)="openProject(project)">
            <div class="p-6">
              <div class="flex items-start justify-between mb-3">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {{ project.name }}
                </h3>
                <span *ngIf="project.isShared" class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Compartido
                </span>
              </div>
              
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {{ project.description || 'Sin descripción' }}
              </p>
              
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>{{ formatDate(project.updatedAt) }}</span>
                <span>por {{ project.owner }}</span>
              </div>
            </div>
          </div>
        </ng-container>
      </div>

      <!-- Estado vacío -->
      <div *ngIf="!loading && projects.length === 0" class="text-center py-12">
        <i class="pi pi-folder-open text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">No tienes proyectos aún</h3>
        <p class="text-gray-500 mb-6">Crea tu primer diagrama de base de datos</p>
        <button 
          (click)="showNewDialog = true"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Crear Primer Proyecto
        </button>
      </div>

      <!-- Sin resultados de búsqueda -->
      <div *ngIf="!loading && projects.length > 0 && filteredProjects.length === 0" class="text-center py-12">
        <i class="pi pi-search text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">No se encontraron proyectos</h3>
        <p class="text-gray-500">Intenta con otros términos de búsqueda</p>
      </div>
      
      <!-- New Project Dialog -->
      <app-new-project-dialog
        [(visible)]="showNewDialog"
        (projectCreated)="onProjectCreated($event)"
      ></app-new-project-dialog>
    </div>
  `
})
export class ProjectsPage implements OnInit {
  projects: Project[] = [];
  filter = '';
  showNewDialog = false;
  loading = false;

  constructor(
    private ps: ProjectService,
    private router: Router
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.ps.list().subscribe((projects: Project[]) => {
      this.projects = projects || [];
      this.loading = false;
    });
  }

  get filteredProjects(): Project[] {
    if (!this.filter) return this.projects;
    const searchTerm = this.filter.toLowerCase();
    return this.projects.filter(project => 
      project.name.toLowerCase().includes(searchTerm) ||
      project.description?.toLowerCase().includes(searchTerm)
    );
  }

  onProjectCreated(event: {name: string, description?: string}) {
    this.ps.create(event).subscribe(() => {
      this.load();
    });
  }

  openProject(project: Project) {
    this.router.navigate(['/p', project.id]);
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Ayer';
    if (diffDays <= 7) return `Hace ${diffDays} días`;
    if (diffDays <= 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`;
    if (diffDays <= 365) return `Hace ${Math.ceil(diffDays / 30)} meses`;
    return `Hace ${Math.ceil(diffDays / 365)} años`;
  }
}
