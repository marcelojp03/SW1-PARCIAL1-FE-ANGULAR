import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ExportOptions {
  format: 'spring-boot' | 'sql' | 'png' | 'svg' | 'json';
  includeData?: boolean;
  database?: 'mysql' | 'postgresql' | 'sqlite' | 'oracle';
  imageOptions?: {
    width: number;
    height: number;
    quality: number;
    background: string;
  };
  springBootOptions?: {
    packageName: string;
    groupId: string;
    artifactId: string;
    version: string;
    javaVersion: string;
    includeRepositories: boolean;
    includeServices: boolean;
    includeControllers: boolean;
  };
}

export interface ExportResult {
  id: string;
  format: string;
  downloadUrl: string;
  createdAt: Date;
  size: number;
  status: 'processing' | 'completed' | 'failed';
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private apiUrl = `${environment.backend.host}/export`;
  
  constructor(private http: HttpClient) {}

  exportProject(projectId: string, options: ExportOptions): Observable<ExportResult> {
    return this.http.post<ExportResult>(`${this.apiUrl}/${projectId}`, options);
  }

  getExportStatus(projectId: string, exportId: string): Observable<ExportResult> {
    return this.http.get<ExportResult>(`${this.apiUrl}/${projectId}/${exportId}/status`);
  }

  getExportHistory(projectId: string): Observable<ExportResult[]> {
    return this.http.get<ExportResult[]>(`${this.apiUrl}/${projectId}/history`);
  }

  downloadExport(projectId: string, exportId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${projectId}/${exportId}/download`, {
      responseType: 'blob'
    });
  }

  deleteExport(projectId: string, exportId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projectId}/${exportId}`);
  }

  // Specific export methods
  exportAsSpringBoot(projectId: string, options: ExportOptions['springBootOptions']): Observable<ExportResult> {
    return this.exportProject(projectId, {
      format: 'spring-boot',
      springBootOptions: options
    });
  }

  exportAsSQL(projectId: string, database: ExportOptions['database']): Observable<ExportResult> {
    return this.exportProject(projectId, {
      format: 'sql',
      database
    });
  }

  exportAsImage(projectId: string, format: 'png' | 'svg', options?: ExportOptions['imageOptions']): Observable<ExportResult> {
    return this.exportProject(projectId, {
      format,
      imageOptions: options
    });
  }

  exportAsJSON(projectId: string, includeData: boolean = true): Observable<ExportResult> {
    return this.exportProject(projectId, {
      format: 'json',
      includeData
    });
  }

  // Canvas export helpers
  exportCanvasAsPNG(canvas: HTMLCanvasElement, filename: string): void {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  exportCanvasAsSVG(svgElement: SVGElement, filename: string): void {
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgElement);
    const blob = new Blob([source], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  // Validation helpers
  validateExportOptions(options: ExportOptions): string[] {
    const errors: string[] = [];

    if (options.format === 'spring-boot' && !options.springBootOptions) {
      errors.push('Spring Boot options are required for Spring Boot export');
    }

    if (options.format === 'sql' && !options.database) {
      errors.push('Database type is required for SQL export');
    }

    if ((options.format === 'png' || options.format === 'svg') && options.imageOptions) {
      if (options.imageOptions.width <= 0 || options.imageOptions.height <= 0) {
        errors.push('Image dimensions must be positive');
      }
    }

    return errors;
  }

  // Helper methods
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFormatIcon(format: string): string {
    switch (format) {
      case 'spring-boot': return '📦';
      case 'sql': return '🗄️';
      case 'png': return '🖼️';
      case 'svg': return '📐';
      case 'json': return '📄';
      default: return '📁';
    }
  }

  getFormatDescription(format: string): string {
    switch (format) {
      case 'spring-boot': return 'Proyecto completo Spring Boot con entidades JPA';
      case 'sql': return 'Scripts CREATE TABLE para base de datos';
      case 'png': return 'Imagen del diagrama en formato PNG';
      case 'svg': return 'Vector escalable del diagrama';
      case 'json': return 'Estructura del diagrama en formato JSON';
      default: return 'Archivo exportado';
    }
  }
}
