import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CitaModelo } from '../modelos/cita.modelo';
import { map, delay } from 'rxjs/operators';
import { HttpParams } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class CitasService {

  //private url = 'https://sigebi-app.firebaseio.com/';

  private url = 'http://localhost:8080/auth';

  constructor( private http: HttpClient ) { }


  crearCita( cita: CitaModelo ) {

    return this.http.post(`${ this.url }/citas`, cita);

  }

  actualizarCita( cita: CitaModelo ) {

    const citaTemp = {
      ...cita
    };

    return this.http.put(`${ this.url }/citas/`, citaTemp);
  }

  borrarCita( id: number ) {

    return this.http.delete(`${ this.url }/citas/${ id }`);
  }


  getCita( id: number ) {

    return this.http.get(`${ this.url }/citas/${ id }`);
  }


  getCitas() {
    return this.http.get(`${ this.url }/citas`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  buscarCitas() {
    return this.http.get(`${ this.url }/citas/buscar`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  buscarCitasFiltros( cita: CitaModelo ) {
    let params = new HttpParams();
    var filtros = cita == null ? new CitaModelo() : cita;
    params = params.append('filtros', JSON.stringify(filtros));

    return this.http.get(`${ this.url }/citas/buscar/`,{params:params})
      .pipe(
        map( this.crearArreglo ),
        delay(0)
      );
  }

  getPersona( id: number ) {

    return this.http.get(`${ this.url }/personas/${ id }`);

  }

  private crearArreglo( citasObj: object ) {

    const citas: CitaModelo[] = [];

    Object.keys( citasObj ).forEach( key => {

      const cita: CitaModelo = citasObj[key];
      citas.push( cita );
    });

    return citas;
  }
}
