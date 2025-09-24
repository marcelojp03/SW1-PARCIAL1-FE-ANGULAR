import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  owner: string;
  isShared: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private base = '/projects';
  
  // Datos simulados para desarrollo
  private mockProjects: Project[] = [
    {
      id: '1',
      name: 'Sistema de Inventario',
      description: 'Modelo de base de datos para sistema de inventario',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      owner: 'Usuario Test',
      isShared: false
    },
    {
      id: '2', 
      name: 'E-commerce Database',
      description: 'Base de datos para tienda online con productos, usuarios y pedidos',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18'),
      owner: 'Usuario Test',
      isShared: true
    },
    {
      id: '3',
      name: 'CRM System',
      description: 'Gestión de relaciones con clientes',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-12'),
      owner: 'Usuario Test',
      isShared: false
    },
    {
      id: '4',
      name: 'Blog Platform',
      description: 'Plataforma de blogs con usuarios, posts y comentarios',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-08'),
      owner: 'Usuario Test',
      isShared: true
    }
  ];

  constructor(private http: HttpClient) {}

  list(): Observable<Project[]> {
    // Simular llamada HTTP con delay
    return of(this.mockProjects).pipe(
      delay(500), // Simular latencia de red
      catchError(() => of([]))
    );
  }

  create(payload: {name: string, description?: string}): Observable<Project> {
    // Simular creación de proyecto
    const newProject: Project = {
      id: Date.now().toString(),
      name: payload.name,
      description: payload.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      owner: 'Usuario Test',
      isShared: false
    };
    
    this.mockProjects.unshift(newProject);
    
    return of(newProject).pipe(
      delay(300),
      catchError(() => of(null as any))
    );
  }

  getById(id: string): Observable<Project | null> {
    const project = this.mockProjects.find(p => p.id === id);
    return of(project || null).pipe(delay(200));
  }

  update(id: string, payload: Partial<Project>): Observable<Project | null> {
    const index = this.mockProjects.findIndex(p => p.id === id);
    if (index >= 0) {
      this.mockProjects[index] = { 
        ...this.mockProjects[index], 
        ...payload, 
        updatedAt: new Date() 
      };
      return of(this.mockProjects[index]).pipe(delay(300));
    }
    return of(null);
  }

  delete(id: string): Observable<boolean> {
    const index = this.mockProjects.findIndex(p => p.id === id);
    if (index >= 0) {
      this.mockProjects.splice(index, 1);
      return of(true).pipe(delay(200));
    }
    return of(false);
  }
}
