import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { 
  ChatMessage, 
  DiagramAction, 
  AiResponse, 
  AiMessage, 
  AiSuggestion,
  AiChatRequest 
} from '../interfaces/ai.interface';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = environment.backend.host;
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

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
  // Chat functionality
  async sendChatMessage(projectId: string, message: string): Promise<AiResponse> {
    try {
      const headers = this.getAuthHeaders();

      const body = {
        projectId: projectId,
        message: message
      };

      const response = await firstValueFrom(
        this.http.post<AiResponse>(`${this.apiUrl}/ai/chat`, body, { headers })
      );

      return response;
    } catch (error) {
      console.error('AI API Error:', error);
      throw error;
    }
  }


  // Helper methods para la UI
  

  createUserMessage(content: string): ChatMessage {
    return {
      id: this.generateId(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
  }

  createAiMessage(content: string, suggestions?: string[]): ChatMessage {
    return {
      id: this.generateId(),
      content,
      sender: 'ai',
      timestamp: new Date(),
      suggestions
    };
  }

  getErrorMessage(error: any): string {
    let errorMessage = 'No se pudo procesar la solicitud';
    
    if (error.status === 422) {
      errorMessage = 'No se pudo interpretar la solicitud. Intenta ser más específico.';
    } else if (error.status === 404) {
      errorMessage = 'Proyecto no encontrado';
    } else if (error.status === 403) {
      errorMessage = 'No tienes permisos para modificar este proyecto';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }

    return errorMessage;
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
