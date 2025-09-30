import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  createdAt: Date;
  updatedAt: Date;
  owner: string;
  owner_id?: string;
  isShared: boolean;
  diagrams?: any[];
  has_thumbnail?: boolean;
  thumbnail_data_uri?: string;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private apiUrl = environment.backend.host;
  
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const session = localStorage.getItem('session');
    if (session) {
      const sessionData = JSON.parse(session);
      const token = sessionData.data?.access_token;
      if (token) {
        return new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
      }
    }
    return new HttpHeaders({'Content-Type': 'application/json'});
  }
  
  // Datos simulados para desarrollo (fallback)
  private mockProjects: Project[] = [
    {
      id: '1',
      name: 'Sistema de Inventario',
      description: 'Modelo de base de datos para sistema de inventario',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      owner: 'Usuario Test',
      isShared: false,
      has_thumbnail: true,
      thumbnail_data_uri: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iIzQzODVmNCIvPjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkludmVudGFyaW88L3RleHQ+PC9zdmc+'
    },
    {
      id: '2', 
      name: 'E-commerce Database',
      description: 'Base de datos para tienda online con productos, usuarios y pedidos',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18'),
      owner: 'Usuario Test',
      isShared: true,
      has_thumbnail: true,
      thumbnail_data_uri: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iIzEwYjk4MSIvPjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkUtY29tbWVyY2U8L3RleHQ+PC9zdmc+'
    },
    {
      id: '3',
      name: 'CRM System',
      description: 'Gestión de relaciones con clientes',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-12'),
      owner: 'Usuario Test',
      isShared: false,
      has_thumbnail: false,
      thumbnail_data_uri: undefined
    },
    {
      id: '4',
      name: 'Blog Platform',
      description: 'Plataforma de blogs con usuarios, posts y comentarios',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-08'),
      owner: 'Usuario Test',
      isShared: true,
      has_thumbnail: true,
      thumbnail_data_uri: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iIzk5MzNlYSIvPjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkJsb2c8L3RleHQ+PC9zdmc+'
    }
  ];

  list(): Observable<Project[]> {
    // Si skipAuth está habilitado, usar datos simulados
    if (environment.skipAuth) {
      return of(this.mockProjects).pipe(
        delay(500),
        catchError(() => of([]))
      );
    }

    // Usar API real
    const headers = this.getAuthHeaders();
    console.log('[ProjectService] Loading projects from API');
    console.log('[ProjectService] Request URL:', `${this.apiUrl}/projects`);
    console.log('[ProjectService] Auth headers:', headers.get('Authorization') ? 'Present' : 'Missing');
    
    return this.http.get<any>(`${this.apiUrl}/projects`, { headers }).pipe(
      map((response:any) => {
        console.log('[ProjectService] Projects API response:', response);
        if (response.success && response.data) {
          const mappedProjects = response.data.map((project: any) => ({
            id: project.id,
            name: project.name,
            description: project.description || '',
            createdAt: new Date(project.created_at),
            updatedAt: new Date(project.updated_at),
            owner: project.owner?.name || 'Usuario',
            owner_id: project.owner_id,
            isShared: false, // Por ahora no tenemos info de compartido
            diagrams: project.diagrams || [],
            has_thumbnail: project.has_thumbnail || false,
            thumbnail_data_uri: project.thumbnail_data_uri || null
          }));
          console.log('[ProjectService] Mapped projects:', mappedProjects);
          return mappedProjects;
        }
        console.log('[ProjectService] No projects found in response');
        return [];
      }),
      catchError((error) => {
        console.warn('[ProjectService] Error loading projects, using mock data:', error);
        console.error('[ProjectService] Error details:', error.error);
        return of(this.mockProjects);
      })
    );
  }

  create(payload: {name: string, description?: string}): Observable<Project> {
    // Si skipAuth está habilitado, usar datos simulados
    if (environment.skipAuth) {
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

    // Usar API real
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/projects`, payload, { headers }).pipe(
      map(response => {
        if (response.success && response.data) {
          const project = response.data;
          return {
            id: project.id,
            name: project.name,
            description: project.description || '',
            createdAt: new Date(project.created_at),
            updatedAt: new Date(project.updated_at),
            owner: project.owner?.name || 'Usuario',
            owner_id: project.owner_id,
            isShared: false,
            diagrams: project.diagrams || []
          };
        }
        throw new Error('Error creating project');
      }),
      catchError(error => {
        console.error('Error creating project:', error);
        throw error;
      })
    );
  }

  getById(id: string): Observable<Project | null> {
    // Si skipAuth está habilitado, usar datos simulados
    if (environment.skipAuth) {
      const project = this.mockProjects.find(p => p.id === id);
      return of(project || null).pipe(delay(200));
    }

    // Usar API real
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/projects/${id}`, { headers }).pipe(
      map(response => {
        if (response.success && response.data) {
          const project = response.data;
          return {
            id: project.id,
            name: project.name,
            description: project.description || '',
            createdAt: new Date(project.created_at),
            updatedAt: new Date(project.updated_at),
            owner: project.owner?.name || 'Usuario',
            owner_id: project.owner_id,
            isShared: false,
            diagrams: project.diagrams || []
          };
        }
        return null;
      }),
      catchError(error => {
        console.error('Error fetching project:', error);
        return of(null);
      })
    );
  }

  update(id: string, payload: Partial<Project>): Observable<Project | null> {
    // Si skipAuth está habilitado, usar datos simulados
    if (environment.skipAuth) {
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

    // Usar API real
    const headers = this.getAuthHeaders();
    const updateData = {
      name: payload.name,
      ...(payload.description && { description: payload.description })
    };
    
    console.log(`[ProjectService] Updating project ${id}`);
    console.log('[ProjectService] Update payload:', updateData);
    
    return this.http.patch<any>(`${this.apiUrl}/projects/${id}`, updateData, { headers }).pipe(
      map(response => {
        console.log('[ProjectService] Update response:', response);
        if (response.success && response.data) {
          const project = response.data;
          return {
            id: project.id,
            name: project.name,
            description: project.description || '',
            createdAt: new Date(project.created_at),
            updatedAt: new Date(project.updated_at),
            owner: project.owner?.name || 'Usuario',
            owner_id: project.owner_id,
            isShared: false,
            diagrams: project.diagrams || []
          };
        }
        throw new Error('Error updating project');
      }),
      catchError(error => {
        console.error('[ProjectService] Error updating project:', error);
        console.error('[ProjectService] Error details:', error.error);
        throw error;
      })
    );
  }

  delete(id: string): Observable<boolean> {
    // Si skipAuth está habilitado, usar datos simulados
    if (environment.skipAuth) {
      const index = this.mockProjects.findIndex(p => p.id === id);
      if (index >= 0) {
        this.mockProjects.splice(index, 1);
        return of(true).pipe(delay(200));
      }
      return of(false);
    }

    // Usar API real
    const headers = this.getAuthHeaders();
    console.log(`[ProjectService] Deleting project ${id}`);
    console.log('[ProjectService] Request URL:', `${this.apiUrl}/api/projects/${id}`);
    console.log('[ProjectService] Auth headers:', headers.get('Authorization') ? 'Present' : 'Missing');
    
    return this.http.delete<any>(`${this.apiUrl}/api/projects/${id}`, { headers }).pipe(
      map(response => {
        console.log('[ProjectService] Delete response:', response);
        if (response && response.success) {
          return true;
        }
        throw new Error('Error deleting project');
      }),
      catchError(error => {
        console.error('[ProjectService] Error deleting project:', error);
        console.error('[ProjectService] Error details:', error.error);
        throw error;
      })
    );
  }

  // ===== MÉTODOS ESPECÍFICOS PARA SYNCFUSION =====

  /**
   * Guarda el JSON crudo de Syncfusion
   * POST /api/projects/{id}/syncfusion
   */
  saveSyncfusionJson(projectId: string, syncfusionData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log(`[ProjectService] Saving Syncfusion JSON for project ${projectId}`);
    console.log('[ProjectService] Payload:', syncfusionData);
    
    return this.http.post<any>(`${this.apiUrl}/projects/${projectId}/syncfusion`, syncfusionData, { headers }).pipe(
      map(response => {
        console.log('[ProjectService] Syncfusion JSON save response:', response);
        return response;
      }),
      catchError(error => {
        console.error('[ProjectService] Error saving Syncfusion JSON:', error);
        console.error('[ProjectService] Error details:', error.error);
        throw error;
      })
    );
  }

  /**
   * Restaura el diagrama desde el JSON crudo guardado
   * GET /api/projects/{id}/restore
   */
  restoreProject(projectId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log(`[ProjectService] Restoring project ${projectId}`);
    
    return this.http.get<any>(`${this.apiUrl}/projects/${projectId}/restore`, { headers }).pipe(
      map(response => {
        console.log('[ProjectService] Restore response:', response);
        if (response.success) {
          console.log('[ProjectService] Diagram data to restore:', response.data);
          return response.data; // El JSON crudo para loadDiagram()
        }
        throw new Error('Error restoring project');
      }),
      catchError(error => {
        console.error('[ProjectService] Error restoring project:', error);
        console.error('[ProjectService] Error details:', error.error);
        throw error;
      })
    );
  }

  /**
   * Convierte el JSON crudo a modelo canónico
   * POST /api/projects/{id}/convert
   */
  convertToCanonical(projectId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log(`[ProjectService] Converting to canonical model for project ${projectId}`);
    
    return this.http.post<any>(`${this.apiUrl}/projects/${projectId}/convert`, {}, { headers }).pipe(
      map(response => {
        console.log('[ProjectService] Canonical conversion response:', response);
        return response;
      }),
      catchError(error => {
        console.error('[ProjectService] Error converting to canonical:', error);
        console.error('[ProjectService] Error details:', error.error);
        throw error;
      })
    );
  }

  /**
   * Obtiene el modelo canónico actual
   * GET /api/projects/{id}/model
   */
  getCanonicalModel(projectId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/projects/${projectId}/model`, { headers }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error('Error getting canonical model');
      }),
      catchError(error => {
        console.error('Error getting canonical model:', error);
        throw error;
      })
    );
  }

  /**
   * Guarda el thumbnail del proyecto
   * POST /api/projects/{id}/thumbnail
   */
  saveThumbnail(projectId: string, dataUri: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const payload = { dataUri };
    console.log(`[ProjectService] Saving thumbnail for project ${projectId}`);
    console.log('[ProjectService] Thumbnail data URI length:', dataUri.length);
    
    return this.http.post<any>(`${this.apiUrl}/projects/${projectId}/thumbnail`, payload, { headers }).pipe(
      map(response => {
        console.log('[ProjectService] Thumbnail save response:', response);
        return response;
      }),
      catchError(error => {
        console.error('[ProjectService] Error saving thumbnail:', error);
        console.error('[ProjectService] Error details:', error.error);
        throw error;
      })
    );
  }

  /**
   * Exporta el proyecto a Spring Boot
   * POST /api/export/projects/{id}/springboot
   */
  exportToSpringBoot(projectId: string): Observable<Blob> {
    const headers = this.getAuthHeaders();
    console.log(`[ProjectService] Exporting project ${projectId} to Spring Boot`);
    console.log(`[ProjectService] Using endpoint: ${environment.backend.host}/export/projects/${projectId}/springboot`);
    
    return this.http.post(`${environment.backend.host}/export/projects/${projectId}/springboot`, {}, { 
      headers, 
      responseType: 'blob' 
    }).pipe(
      map(blob => {
        console.log('[ProjectService] Spring Boot export completed, blob size:', blob.size);
        return blob;
      }),
      catchError(error => {
        console.error('[ProjectService] Error exporting to Spring Boot:', error);
        console.error('[ProjectService] Error details:', error.error);
        throw error;
      })
    );
  }

  /**
   * Guardado completo: Thumbnail + JSON crudo + Conversión canónica
   * Flujo unificado que maneja todo en secuencia
   */
  saveCompleteProject(projectId: string, syncfusionData: any, thumbnailDataUri?: string): Observable<any> {
    console.log(`[ProjectService] Starting complete save for project ${projectId}`);
    
    // Paso 1: Guardar JSON crudo
    return this.saveSyncfusionJson(projectId, syncfusionData).pipe(
      switchMap(syncResponse => {
        console.log('[ProjectService] JSON crudo saved, proceeding to canonical conversion');
        
        // Paso 2: Convertir a canónico
        return this.convertToCanonical(projectId).pipe(
          map(canonicalResponse => ({ syncResponse, canonicalResponse }))
        );
      }),
      switchMap(({ syncResponse, canonicalResponse }) => {
        // Paso 3: Guardar thumbnail (opcional)
        if (thumbnailDataUri) {
          console.log('[ProjectService] Saving thumbnail as final step');
          return this.saveThumbnail(projectId, thumbnailDataUri).pipe(
            map(thumbnailResponse => ({
              syncfusion: syncResponse,
              canonical: canonicalResponse,
              thumbnail: thumbnailResponse
            }))
          );
        } else {
          console.log('[ProjectService] No thumbnail provided, completing save');
          return of({
            syncfusion: syncResponse,
            canonical: canonicalResponse,
            thumbnail: null
          });
        }
      }),
      catchError(error => {
        console.error('[ProjectService] Error in complete save flow:', error);
        throw error;
      })
    );
  }
}
