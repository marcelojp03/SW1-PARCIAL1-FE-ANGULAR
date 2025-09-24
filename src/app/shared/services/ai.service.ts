import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AiMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  metadata?: {
    confidence?: number;
    suggestions?: any[];
    context?: string;
  };
}

export interface AiSuggestion {
  id: string;
  type: 'optimization' | 'correction' | 'enhancement';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  changes: any[];
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = `${environment.backend.host}/ai`;
  
  constructor(private http: HttpClient) {}

  sendMessage(projectId: string, message: string, context?: any): Observable<AiMessage> {
    return this.http.post<AiMessage>(`${this.apiUrl}/chat/${projectId}`, {
      message,
      context
    });
  }

  getChatHistory(projectId: string): Observable<AiMessage[]> {
    return this.http.get<AiMessage[]>(`${this.apiUrl}/chat/${projectId}/history`);
  }

  analyzeDiagram(projectId: string): Observable<AiSuggestion[]> {
    return this.http.post<AiSuggestion[]>(`${this.apiUrl}/analyze/${projectId}`, {});
  }

  generateClasses(projectId: string, description: string): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/generate/classes/${projectId}`, {
      description
    });
  }

  optimizeDiagram(projectId: string, criteria: string[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/optimize/${projectId}`, {
      criteria
    });
  }

  explainElement(projectId: string, elementId: string, elementType: 'class' | 'relation'): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/explain/${projectId}`, {
      elementId,
      elementType
    });
  }

  generateSQL(projectId: string, database: 'mysql' | 'postgresql' | 'sqlite'): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/generate/sql/${projectId}`, {
      database
    });
  }

  validateNamingConventions(projectId: string, convention: string): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/validate/naming/${projectId}`, {
      convention
    });
  }

  suggestIndexes(projectId: string): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/suggest/indexes/${projectId}`, {});
  }

  // Helper methods para la UI
  formatAiResponse(response: string): string {
    // Formatear respuesta de IA con markdown básico
    return response
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  createUserMessage(content: string): AiMessage {
    return {
      id: this.generateId(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
