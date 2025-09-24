import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders, JsonpClientBackend } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

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
      code: userRequest.codigo,
      email: userRequest.email,
      password: userRequest.password
    };

    //return this.http.post(HttpApi.userRegister, data)
    return this.http.post(`${this.apiUrl}/usuarios/registrar`, data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  loginWithUserCredentials(email: string, password: string): Observable<any> {
    let idf="core:auth.service::loginWithUserCredentials::";
    let user: User = {
      correo_electronico: email,
      clave: password  
    }  
    const credentials = {
      correo: email,
      contraseña: password
    };

    
    const httpOptions = {
      headers: new HttpHeaders({
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
      })
    }; 


    console.log(idf +"Ev:10::credentials:",credentials);
    let url=this.apiUrl+"/usuarios/login";
    console.log(idf +"Ev:20::url:",url);

    return this.http.post(url, credentials,httpOptions);    
      // .pipe(
      //   map((response: any) => {
      //     console.log("response:",response);
          
      //     localStorage.setItem('session', JSON.stringify(response));
      //     localStorage.setItem('token',JSON.stringify(response.data.token))
      //     localStorage.setItem('usuario',JSON.stringify(response.data.usuario))
      //     localStorage.setItem('username',JSON.stringify(response.data.usuario.nombre_usuario));
      //     localStorage.setItem('name',JSON.stringify(response.data.usuario.nombre));
      //     localStorage.setItem('user_id',JSON.stringify(response.data.usuario.id));
          
      //     return response;
      //   })
      // );
  }

  loginWithRefreshToken(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('client_id', OAUTH_DATA.client_id);
    body.set('client_secret', OAUTH_DATA.client_secret);
    body.set('refresh_token', this.refreshToken);
    body.set('scope', OAUTH_DATA.scope);

    return this.http.post(HttpApi.oauthLogin, body.toString(), { headers })
      .pipe(
        map((response: any) => {
          localStorage.setItem('session', JSON.stringify(response));
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
    return localStorage['session'] ? JSON.parse(localStorage['session']).access_token : null;
  }

  get refreshToken() {
    return localStorage['session'] ? JSON.parse(localStorage['session']).refresh_token : null;
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
