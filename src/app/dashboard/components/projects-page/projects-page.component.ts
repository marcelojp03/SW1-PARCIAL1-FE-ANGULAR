// dashboard/components/projects-page/projects-page.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NewProjectDialog } from '../new-project-dialog/new-project-dialog.component';
import { ProjectService, Project } from '../../../shared/services/project.service';

@Component({
  selector: 'dashboard-projects-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NewProjectDialog],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss'
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
    //this.router.navigate(['/editor', project.id]);
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