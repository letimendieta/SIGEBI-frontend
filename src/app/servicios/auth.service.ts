import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { NuevoUsuario } from '../models/nuevo-usuario';
import { Observable } from 'rxjs';
import { UsuarioModelo } from '../modelos/usuario.modelo';
import { JwtDTO } from '../modelos/jwt-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authURL = 'http://localhost:8080/auth/';

  constructor(private httpClient: HttpClient) { }

  //public nuevo(nuevoUsuario: NuevoUsuario): Observable<any> {
    //return this.httpClient.post<any>(this.authURL + 'nuevo', nuevoUsuario);
  //}

  public login(loginUsuario: UsuarioModelo): Observable<JwtDTO> {
    return this.httpClient.post<JwtDTO>(this.authURL + 'login', loginUsuario);
  }
}
