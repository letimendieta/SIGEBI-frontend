import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { HistorialClinicoModelo } from '../modelos/historialClinico.modelo';
import { map, delay } from 'rxjs/operators';
import { HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HistorialesClinicosService {

  //private url = 'https://sigebi-app.firebaseio.com/';

  private url = 'http://localhost:8080/auth';

  constructor( private http: HttpClient ) { }


  crearHistorialClinico( historialClinico: HistorialClinicoModelo) {

    return this.http.post(`${ this.url }/historial-Clinico`, historialClinico);

  }
 
  actualizarHistorialClinico( historialClinico: HistorialClinicoModelo ) {

    const historialClinicoTemp = {
      ...historialClinico
    };

    return this.http.put(`${ this.url }/historial-Clinico/`, historialClinicoTemp);
  }

  borrarHistorialClinico( id: number ) {

    return this.http.delete(`${ this.url }/historial-Clinico/${ id }`);
  }


  getHistorialClinico( id: number ) {

    return this.http.get(`${ this.url }/historial-Clinico/${ id }`);
  }


  getHistorialClinicos() {
    return this.http.get(`${ this.url }/historial-Clinico`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  buscarHistorialClinicos() {
    return this.http.get(`${ this.url }/historial-Clinico/buscar`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  buscarHistorialClinicosFiltros( historialClinico: HistorialClinicoModelo ) {
    let params = new HttpParams();
    var filtros = historialClinico == null ? new HistorialClinicoModelo() : historialClinico;
    params = params.append('filtros', JSON.stringify(filtros));

    return this.http.get(`${ this.url }/historial-Clinico/buscar/`,{params:params})
      .pipe(
        map( this.crearArreglo ),
        delay(0)
      );
  }

  getPersona( id: number ) {

    return this.http.get(`${ this.url }/personas/${ id }`);

  }

  private crearArreglo( historialClinicosObj: object ) {

    const historialClinicos: HistorialClinicoModelo[] = [];

    Object.keys( historialClinicosObj ).forEach( key => {

      const historialClinico: HistorialClinicoModelo = historialClinicosObj[key];
      historialClinicos.push( historialClinico );
    });

    return historialClinicos;
  }
}