import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProcesoDiagnosticoTratamientoModelo } from '../modelos/procesoDiagnosticoTratamiento.modelo';
import { map, delay } from 'rxjs/operators';
import { HttpParams } from "@angular/common/http";
import { GlobalConstants } from '../common/global-constants';

@Injectable({
  providedIn: 'root'
})
export class ProcesoDiagnosticoTratamientosService {

  private url = GlobalConstants.apiUrlBackend;

  constructor( private http: HttpClient ) { }


  /*crearProcesoDiagnosticoTratamiento( procesoDiagnosticoTratamiento: ProcesoDiagnosticoTratamientoModelo ) {

    return this.http.post(`${ this.url }/procesoDiagnosticoTratamientos`, procesoDiagnosticoTratamiento);

  }

  actualizarProcesoDiagnosticoTratamiento( procesoDiagnosticoTratamiento: ProcesoDiagnosticoTratamientoModelo ) {

    const ProcesoDiagnosticoTratamientoTemp = {
      ...procesoDiagnosticoTratamiento
    };

    return this.http.put(`${ this.url }/procesoDiagnosticoTratamientos/`, ProcesoDiagnosticoTratamientoTemp);


  }

  borrarProcesoDiagnosticoTratamiento( id: number ) {

    return this.http.delete(`${ this.url }/procesoDiagnosticoTratamientos/${ id }`);

  }


  getProcesoDiagnosticoTratamiento( id: number ) {

    return this.http.get(`${ this.url }/procesoDiagnosticoTratamientos/${ id }`);

  }


  getProcesoDiagnosticoTratamientos() {
    return this.http.get(`${ this.url }/procesoDiagnosticoTratamientos`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  buscarProcesoDiagnosticoTratamientos() {
    return this.http.get(`${ this.url }/procesoDiagnosticoTratamientos/buscar`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }*/

  procesoDiagnosticoTratamientos( procesoDiagnosticoTratamiento: ProcesoDiagnosticoTratamientoModelo) {
    let params = new HttpParams();
    var filtros = procesoDiagnosticoTratamiento == null ? new ProcesoDiagnosticoTratamientoModelo() : procesoDiagnosticoTratamiento;
    params = params.append('filtros', JSON.stringify(filtros));

    return this.http.get(`${ this.url }/proceso-diagnostico-tratamiento/`,{params:params});
  }

  crearProcesoDiagnosticoTratamiento( procesoDiagnosticoTratamiento: ProcesoDiagnosticoTratamientoModelo ) {

    return this.http.post(`${ this.url }/proceso-diagnostico-tratamiento`, procesoDiagnosticoTratamiento);

  }

  /*buscarProcesoDiagnosticoTratamientosFiltrosTabla( procesoDiagnosticoTratamiento: ProcesoDiagnosticoTratamientoModelo ) {
    let params = new HttpParams();
    var filtros = procesoDiagnosticoTratamiento == null ? new ProcesoDiagnosticoTratamientoModelo() : procesoDiagnosticoTratamiento;
    
    params = params.append('filtros', JSON.stringify(filtros));
    return this.http.get(`${ this.url }/procesoDiagnosticoTratamientos/buscar/`,{params:params})
      .pipe(
        map( this.crearArreglo ),
        delay(0)
      );
  }

  private crearArreglo( ProcesoDiagnosticoTratamientosObj: object ) {

    const procesoDiagnosticoTratamientos: ProcesoDiagnosticoTratamientoModelo[] = [];

    Object.keys( ProcesoDiagnosticoTratamientosObj ).forEach( key => {

      const procesoDiagnosticoTratamiento: ProcesoDiagnosticoTratamientoModelo = ProcesoDiagnosticoTratamientosObj[key];
      procesoDiagnosticoTratamientos.push( procesoDiagnosticoTratamiento );
    });

    return procesoDiagnosticoTratamientos;

  }*/
}
