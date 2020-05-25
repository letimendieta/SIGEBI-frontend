import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PersonaModelo } from '../modelos/persona.modelo';
import { PacienteModelo } from '../modelos/paciente.modelo';
import { map, delay } from 'rxjs/operators';
import { HttpParams } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class PacientesService {

  //private url = 'https://sigebi-app.firebaseio.com/';

  private url = 'http://localhost:8080';

  constructor( private http: HttpClient ) { }


  crearPaciente( paciente: PacienteModelo ) {

    return this.http.post(`${ this.url }/pacientes`, paciente);

  }

  actualizarPaciente( paciente: PacienteModelo ) {

    const pacienteTemp = {
      ...paciente
    };

    return this.http.put(`${ this.url }/pacientes/`, pacienteTemp);
  }

  borrarPaciente( id: number ) {

    return this.http.delete(`${ this.url }/pacientes/${ id }`);
  }


  getPaciente( id: number ) {

    return this.http.get(`${ this.url }/pacientes/${ id }`);
  }


  getPacientes() {
    return this.http.get(`${ this.url }/pacientes`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  buscarPacientes() {
    return this.http.get(`${ this.url }/pacientes/buscar`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  buscarPacientesFiltros( paciente: PacienteModelo ) {
    let params = new HttpParams();
    params = params.append('filtros', JSON.stringify(paciente));

    return this.http.get(`${ this.url }/pacientes/buscar/`,{params:params})
      .pipe(
        map( this.crearArreglo ),
        delay(0)
      );
  }

  getPersona( id: number ) {

    return this.http.get(`${ this.url }/personas/${ id }`);

  }

  private crearArreglo( pacientesObj: object ) {

    const pacientes: PacienteModelo[] = [];

    Object.keys( pacientesObj ).forEach( key => {

      const paciente: PacienteModelo = pacientesObj[key];
      pacientes.push( paciente );
    });

    return pacientes;
  }
}
