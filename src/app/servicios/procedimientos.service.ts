import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProcedimientoModelo } from '../modelos/procedimiento.modelo';
import { map, delay } from 'rxjs/operators';
import { HttpParams } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class ProcedimientosService {

  //private url = 'https://sigebi-app.firebaseio.com/';

  private url = 'http://localhost:8080/auth';

  constructor( private http: HttpClient ) { }


  crearProcedimiento( procedimiento: ProcedimientoModelo ) {

    return this.http.post(`${ this.url }/procedimientos`, procedimiento);

  }

  actualizarProcedimiento( procedimiento: ProcedimientoModelo ) {

    const procedimientoTemp = {
      ...procedimiento
    };

    return this.http.put(`${ this.url }/procedimientos/`, procedimientoTemp);
  }

  borrarProcedimiento( id: number ) {

    return this.http.delete(`${ this.url }/procedimientos/${ id }`);
  }


  getProcedimiento( id: number ) {

    return this.http.get(`${ this.url }/procedimientos/${ id }`);
  }


  getProcedimientos() {
    return this.http.get(`${ this.url }/procedimientos`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  buscarProcedimientos() {
    return this.http.get(`${ this.url }/procedimientos/buscar`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  buscarProcedimientosFiltros( procedimiento: ProcedimientoModelo ) {
    let params = new HttpParams();
    var filtros = procedimiento == null ? new ProcedimientoModelo() : procedimiento;
    params = params.append('filtros', JSON.stringify(filtros));

    return this.http.get(`${ this.url }/procedimientos/buscar/`,{params:params})
      .pipe(
        map( this.crearArreglo ),
        delay(0)
      );
  }

  getPersona( id: number ) {

    return this.http.get(`${ this.url }/personas/${ id }`);

  }

  private crearArreglo( procedimientosObj: object ) {

    const procedimientos: ProcedimientoModelo[] = [];

    Object.keys( procedimientosObj ).forEach( key => {

      const procedimiento: ProcedimientoModelo = procedimientosObj[key];
      procedimientos.push( procedimiento );
    });

    return procedimientos;
  }
}
