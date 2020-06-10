import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModelo } from '../modelos/usuario.modelo';
import { map, delay } from 'rxjs/operators';
import { HttpParams } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  //private url = 'https://sigebi-app.firebaseio.com/';

  private url = 'http://localhost:8080';

  constructor( private http: HttpClient ) { }


  crearUsuario( usuario: UsuarioModelo ) {

    return this.http.post(`${ this.url }/usuarios`, usuario);

  }

  actualizarUsuario( usuario: UsuarioModelo ) {

    const usuarioTemp = {
      ...usuario
    };

    return this.http.put(`${ this.url }/usuarios/`, usuarioTemp);
  }

  borrarUsuario( id: number ) {

    return this.http.delete(`${ this.url }/usuarios/${ id }`);
  }


  getUsuario( id: number ) {

    return this.http.get(`${ this.url }/usuarios/${ id }`);
  }


  getUsuarios() {
    return this.http.get(`${ this.url }/usuarios`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  buscarUsuarios() {
    return this.http.get(`${ this.url }/usuarios/buscar`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  buscarUsuariosFiltros( usuario: UsuarioModelo ) {
    let params = new HttpParams();
    var filtros = usuario == null ? new UsuarioModelo() : usuario;
    params = params.append('filtros', JSON.stringify(filtros));

    return this.http.get(`${ this.url }/usuarios/buscar/`,{params:params})
      .pipe(
        map( this.crearArreglo ),
        delay(0)
      );
  }

  getPersona( id: number ) {

    return this.http.get(`${ this.url }/personas/${ id }`);

  }

  private crearArreglo( usuariosObj: object ) {

    const usuarios: UsuarioModelo[] = [];

    Object.keys( usuariosObj ).forEach( key => {

      const usuario: UsuarioModelo = usuariosObj[key];
      usuarios.push( usuario );
    });

    return usuarios;
  }
}
