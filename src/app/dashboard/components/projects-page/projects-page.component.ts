import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NewProjectDialog } from '../new-project-dialog/new-project-dialog.component';
import { EditProjectDialog } from '../edit-project-dialog/edit-project-dialog.component';
import { ProjectService, Project } from '../../../shared/services/project.service';
import { SharedModule } from '../../../shared/shared.module';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'dashboard-projects-page',
  standalone: true,
  imports: [SharedModule, NewProjectDialog, EditProjectDialog],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss',
  providers: [MessageService]
})
export class ProjectsPage implements OnInit {
  projects: Project[] = [];
  filter = '';
  showNewDialog = false;
  showEditDialog = false;
  selectedProject: Project | null = null;
  loading = false;

  constructor(
    private ps: ProjectService,
    private router: Router,
    private messageService: MessageService
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
    this.ps.create(event).subscribe({
      next: (response) => {
        this.load();
        this.messageService.add({
          severity: 'success',
          summary: 'Proyecto creado',
          detail: `El proyecto "${event.name}" fue creado exitosamente`,
          life: 3000
        });
      },
      error: (error) => {
        console.error('Error creating project:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear el proyecto. Inténtalo de nuevo.',
          life: 5000
        });
      }
    });
  }

  openProject(project: Project) {
    //this.router.navigate(['/editor', project.id]);
    this.router.navigate(['/p', project.id]);
  }

  editProject(project: Project, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.selectedProject = { ...project };
    this.showEditDialog = true;
  }

  onProjectUpdated(event: {name: string, description?: string}) {
    if (!this.selectedProject) return;

    this.ps.update(this.selectedProject.id, event).subscribe({
      next: () => {
        this.load(); // Recargar la lista
        this.showEditDialog = false;
        this.selectedProject = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Proyecto actualizado',
          detail: `El proyecto "${event.name}" fue actualizado exitosamente`,
          life: 3000
        });
      },
      error: (error) => {
        console.error('Error updating project:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el proyecto. Inténtalo de nuevo.',
          life: 5000
        });
      }
    });
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