import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { HistorialClinicoModelo } from '../modelos/historialClinico.modelo';
import { map, delay } from 'rxjs/operators';
import { HttpParams } from "@angular/common/http";
import { GlobalConstants } from '../common/global-constants';
import { HistorialClinicoPacienteModelo } from '../modelos/historialClinicoPaciente.modelo';

@Injectable({
  providedIn: 'root'
})
export class HistorialesClinicosService {

  private url = GlobalConstants.apiUrlBackend;

  constructor( private http: HttpClient ) { }


  crearHistorialClinico( historialClinico: HistorialClinicoModelo) {

    return this.http.post(`${ this.url }/historial-clinico`, historialClinico);

  }
 
  actualizarHistorialClinico( historialClinico: HistorialClinicoModelo ) {

    const historialClinicoTemp = {
      ...historialClinico
    };

    return this.http.put(`${ this.url }/historial-clinico/`, historialClinicoTemp);
  }

  borrarHistorialClinico( id: number ) {

    return this.http.delete(`${ this.url }/historial-clinico/${ id }`);
  }


  getHistorialClinico( id: number ) {

    return this.http.get(`${ this.url }/historial-clinico/${ id }`);
  }


  getHistorialClinicos() {
    return this.http.get(`${ this.url }/historial-clinico`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  buscarHistorialClinicos() {
    return this.http.get(`${ this.url }/historial-clinico/buscar`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  buscarHistorialClinicosFiltros( historialClinico: HistorialClinicoModelo ) {
    let params = new HttpParams();
    var filtros = historialClinico == null ? new HistorialClinicoModelo() : historialClinico;
    params = params.append('filtros', JSON.stringify(filtros));

    return this.http.get(`${ this.url }/historial-clinico/buscar/`,{params:params})
      .pipe(
        map( this.crearArreglo ),
        delay(0)
      );
  }

  busquedaHistorialPacienteFiltros( busqueda: HistorialClinicoPacienteModelo ) {
    let params = new HttpParams();
    var filtros = busqueda == null ? new HistorialClinicoPacienteModelo() : busqueda;
    params = params.append('filtros', JSON.stringify(filtros));

    return this.http.get(`${ this.url }/historial-clinico/buscar/historialPaciente`,{params:params})
      .pipe(
        map( this.crearArregloBusqueda ),
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

  private crearArregloBusqueda( historialClinicosObj: object ) {

    const historialClinicos: HistorialClinicoPacienteModelo[] = [];

    Object.keys( historialClinicosObj ).forEach( key => {

      const historialClinico: HistorialClinicoPacienteModelo = historialClinicosObj[key];
      historialClinicos.push( historialClinico );
    });

    return historialClinicos;
  }
}
