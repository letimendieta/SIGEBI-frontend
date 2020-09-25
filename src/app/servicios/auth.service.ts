import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioModelo } from '../modelos/usuario.modelo';
import { JwtDTO } from '../modelos/jwt-dto';
import { GlobalConstants } from '../common/global-constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authURL = GlobalConstants.apiUrlBackend;

  constructor(private httpClient: HttpClient) { }

  public login(loginUsuario: UsuarioModelo): Observable<JwtDTO> {
    return this.httpClient.post<JwtDTO>(this.authURL + '/login', loginUsuario);
  }
}
