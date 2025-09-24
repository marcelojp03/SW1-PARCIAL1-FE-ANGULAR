import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Snapshot {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  projectId: string;
  diagramData: any;
  metadata: {
    classCount: number;
    relationCount: number;
    version: string;
    isAutomatic: boolean;
  };
}

export interface SnapshotComparison {
  added: any[];
  modified: any[];
  removed: any[];
  summary: {
    totalChanges: number;
    confidence: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SnapshotService {
  private apiUrl = `${environment.backend.host}/snapshots`;
  
  constructor(private http: HttpClient) {}

  getSnapshots(projectId: string): Observable<Snapshot[]> {
    return this.http.get<Snapshot[]>(`${this.apiUrl}/${projectId}`);
  }

  createSnapshot(projectId: string, name: string, description?: string): Observable<Snapshot> {
    return this.http.post<Snapshot>(`${this.apiUrl}/${projectId}`, {
      name,
      description
    });
  }

  deleteSnapshot(projectId: string, snapshotId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projectId}/${snapshotId}`);
  }

  restoreSnapshot(projectId: string, snapshotId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${projectId}/${snapshotId}/restore`, {});
  }

  compareSnapshots(projectId: string, snapshot1Id: string, snapshot2Id: string): Observable<SnapshotComparison> {
    return this.http.post<SnapshotComparison>(`${this.apiUrl}/${projectId}/compare`, {
      snapshot1Id,
      snapshot2Id
    });
  }

  compareWithCurrent(projectId: string, snapshotId: string): Observable<SnapshotComparison> {
    return this.http.post<SnapshotComparison>(`${this.apiUrl}/${projectId}/${snapshotId}/compare-current`, {});
  }

  // Automatic snapshots
  enableAutoSnapshots(projectId: string, interval: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${projectId}/auto-snapshots`, {
      enabled: true,
      interval
    });
  }

  disableAutoSnapshots(projectId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${projectId}/auto-snapshots`, {
      enabled: false
    });
  }

  // Helper methods
  formatSnapshotDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }

  getSnapshotIcon(snapshot: Snapshot): string {
    if (snapshot.metadata.isAutomatic) {
      return '🤖';
    }
    return '📸';
  }

  calculateSnapshotSize(snapshot: Snapshot): string {
    const size = JSON.stringify(snapshot.diagramData).length;
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${Math.round(size / 1024)} KB`;
    } else {
      return `${Math.round(size / (1024 * 1024))} MB`;
    }
  }

  generateSnapshotName(prefix: string = 'Snapshot'): string {
    const timestamp = new Date().toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${prefix} ${timestamp}`;
  }
}
