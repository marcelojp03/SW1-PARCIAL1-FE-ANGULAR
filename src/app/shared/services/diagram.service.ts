import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DiagramElement {
  id: string;
  type: 'class' | 'relation';
  x: number;
  y: number;
  width?: number;
  height?: number;
  data: any;
}

export interface ClassElement {
  id: string;
  name: string;
  attributes: ClassAttribute[];
  position: { x: number; y: number };
  color?: string;
}

export interface ClassAttribute {
  id: string;
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isNullable: boolean;
  defaultValue?: string;
  length?: number;
}

export interface Relation {
  id: string;
  type: '1:1' | '1:N' | 'N:M';
  fromClassId: string;
  toClassId: string;
  fkSide?: 'from' | 'to';
  name?: string;
}

export interface Diagram {
  id: string;
  classes: ClassElement[];
  relations: Relation[];
  settings: {
    showGrid: boolean;
    snapToGrid: boolean;
    gridSize: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DiagramService {
  private apiUrl = `${environment.backend.host}/diagrams`;

  constructor(private http: HttpClient) {}

  getDiagram(projectId: string): Observable<Diagram> {
    return this.http.get<Diagram>(`${this.apiUrl}/${projectId}`);
  }

  saveDiagram(projectId: string, diagram: Diagram): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${projectId}`, diagram);
  }

  addClass(projectId: string, classElement: ClassElement): Observable<ClassElement> {
    return this.http.post<ClassElement>(`${this.apiUrl}/${projectId}/classes`, classElement);
  }

  updateClass(projectId: string, classId: string, classElement: Partial<ClassElement>): Observable<ClassElement> {
    return this.http.put<ClassElement>(`${this.apiUrl}/${projectId}/classes/${classId}`, classElement);
  }

  deleteClass(projectId: string, classId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projectId}/classes/${classId}`);
  }

  addRelation(projectId: string, relation: Relation): Observable<Relation> {
    return this.http.post<Relation>(`${this.apiUrl}/${projectId}/relations`, relation);
  }

  updateRelation(projectId: string, relationId: string, relation: Partial<Relation>): Observable<Relation> {
    return this.http.put<Relation>(`${this.apiUrl}/${projectId}/relations/${relationId}`, relation);
  }

  deleteRelation(projectId: string, relationId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projectId}/relations/${relationId}`);
  }

  validateDiagram(projectId: string): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/${projectId}/validate`, {});
  }

  // Helper methods para el canvas
  createElement(type: 'class' | 'relation', position: { x: number; y: number }): DiagramElement {
    const id = this.generateId();
    
    if (type === 'class') {
      return {
        id,
        type: 'class',
        x: position.x,
        y: position.y,
        width: 200,
        height: 150,
        data: {
          name: 'NewClass',
          attributes: [
            {
              id: this.generateId(),
              name: 'id',
              type: 'Long',
              isPrimaryKey: true,
              isNullable: false
            }
          ]
        }
      };
    } else {
      return {
        id,
        type: 'relation',
        x: position.x,
        y: position.y,
        data: {
          type: '1:N',
          fromClassId: '',
          toClassId: '',
          fkSide: 'to'
        }
      };
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
