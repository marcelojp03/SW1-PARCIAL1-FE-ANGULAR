import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders, JsonpClientBackend } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { HttpApi } from '../http/http-api';
// import { BitacoraService } from 'src/app/dashboard/bitacora/bitacora.service';
import { User } from '../../auth/interfaces/auth.interface';

const OAUTH_DATA = environment.oauth;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.backend.host;
  private tokenKey = 'authToken'; // Nombre de la clave
  constructor(
    private handler: HttpBackend,
    private http: HttpClient,
    // private bitacoraService:BitacoraService
    ) {
      this.http = new HttpClient(this.handler);
      // If skipAuth is enabled for development, seed a minimal session so
      // guards and code that read localStorage won't fail.
      if ((environment as any).skipAuth) {
        const existing = localStorage.getItem('session');
        if (!existing) {
          const fakeSession = JSON.stringify({
            access_token: 'dev-token',
            refresh_token: 'dev-refresh',
            data: { usuario: { id: 0, nombre: 'dev' } }
          });
          localStorage.setItem('session', fakeSession);
        }
      }
    }

  register(userRequest: any): Observable<any> {
    const data = {
      name: userRequest.name,
      email: userRequest.email,
      password: userRequest.password
    };

    console.log('[AuthService] Attempting registration for user:', userRequest.email);
    console.log('[AuthService] Register URL:', `${this.apiUrl}/auth/register`);
    console.log('[AuthService] Register payload:', data);

    return this.http.post(`${this.apiUrl}/auth/register`, data)
      .pipe(
        map((response: any) => {
          console.log('[AuthService] Register response:', response);
          return response;
        }),
        catchError((error: any) => {
          console.error('[AuthService] Register error:', error);
          console.error('[AuthService] Error status:', error.status);
          console.error('[AuthService] Error details:', error.error);
          throw error;
        })
      );
  }

  loginWithUserCredentials(email: string, password: string): Observable<any> {
    const credentials = {
      email: email,
      password: password
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    }; 

    console.log('[AuthService] Attempting login for user:', email);
    console.log('[AuthService] Login URL:', `${this.apiUrl}/auth/login`);
    console.log('[AuthService] Login payload:', credentials);

    return this.http.post(`${this.apiUrl}/auth/login`, credentials, httpOptions).pipe(
      map((response: any) => {
        console.log('[AuthService] Login response:', response);
        return response;
      }),
      catchError((error: any) => {
        console.error('[AuthService] Login error:', error);
        console.error('[AuthService] Error status:', error.status);
        console.error('[AuthService] Error details:', error.error);
        throw error;
      })
    );
  }

  loginWithRefreshToken(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.refreshToken}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/auth/refresh`, {}, { headers })
      .pipe(
        map((response: any) => {
          if (response.success) {
            // Actualizar tokens en localStorage
            const currentSession = JSON.parse(localStorage.getItem('session') || '{}');
            currentSession.data.access_token = response.data.access_token;
            currentSession.data.refresh_token = response.data.refresh_token;
            localStorage.setItem('session', JSON.stringify(currentSession));
          }
          return response;
        })
      );
  }

  isLogged(): boolean {
    // If skipAuth is enabled, always treat as logged in.
    if ((environment as any).skipAuth) {
      return true;
    }
    return localStorage.getItem('session') ? true : false;
  }

  logout(): void {
    var datos={}
    // this.bitacoraService.actualizarBitacora(datos);
    localStorage.clear();
  }

  get accessToken() {
    const session = localStorage.getItem('session');
    if (session) {
      const sessionData = JSON.parse(session);
      return sessionData.data?.access_token || null;
    }
    return null;
  }

  get refreshToken() {
    const session = localStorage.getItem('session');
    if (session) {
      const sessionData = JSON.parse(session);
      return sessionData.data?.refresh_token || null;
    }
    return null;
  }


  // Método para iniciar sesión y obtener el token de autenticación
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api-token-auth/`, credentials);
  }

  // Método para cerrar sesión
  logout2(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout/`, {});
  }

  // Método para guardar el token de autenticación en el almacenamiento local
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    console.log('Token guardado', token);
  }

  // Método para obtener el token de autenticación del almacenamiento local
  getToken(): Observable<string> {
    const token = localStorage.getItem(this.tokenKey);
    return of(token || '');
  }


  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const isAuthenticated = !!this.getToken();
    console.log('¿Usuario autenticado?', isAuthenticated);
    return isAuthenticated;
  }
  // Método para limpiar el token de autenticación del almacenamiento local
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
  getidUsuario(): number {
    let idf="auth.service::getidUsuario::";
    let respLogin: any;
    console.log(idf + "ev:10");
    respLogin= JSON.parse(localStorage.getItem("session")!);
    console.log(idf + "ev:20::respLogin:",respLogin);
    return respLogin.data.usuario.id;
  }


}
