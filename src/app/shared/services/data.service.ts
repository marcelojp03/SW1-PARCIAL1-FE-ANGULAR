import { HttpBackend, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';
// import { RespuestaMenu } from '../interfaces/adm_interfaces';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class DataService {

  nombreTramite :string  ="";

  constructor(
    private handler: HttpBackend,
    private http: HttpClient
  ) {
    this.http = new HttpClient(this.handler);
  }

  getMenu(user_id:number){
    return this.http.get(`${environment.backend.host}/roles/menu/`+ user_id);
  }
}