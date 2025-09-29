import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SyncfusionService {
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

  /**
   * Envía datos JSON al endpoint de echo de Syncfusion para pruebas
   * @param data - Datos JSON a enviar
   * @returns Observable con la respuesta del servidor
   */
  echo(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('[SyncfusionService] Sending data to echo endpoint');
    console.log('[SyncfusionService] Echo payload:', data);
    
    return this.http.post(`${this.apiUrl}/syncfusion/echo`, data, { headers }).pipe(
      map(response => {
        console.log('[SyncfusionService] Echo response:', response);
        return response;
      }),
      catchError(error => {
        console.error('[SyncfusionService] Echo error:', error);
        console.error('[SyncfusionService] Error details:', error.error);
        throw error;
      })
    );
  }
}