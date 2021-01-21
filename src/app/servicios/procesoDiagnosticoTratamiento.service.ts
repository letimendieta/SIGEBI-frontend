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

  procesoDiagnosticoTratamientos( procesoDiagnosticoTratamiento: ProcesoDiagnosticoTratamientoModelo) {
    let params = new HttpParams();
    var filtros = procesoDiagnosticoTratamiento == null ? new ProcesoDiagnosticoTratamientoModelo() : procesoDiagnosticoTratamiento;
    params = params.append('filtros', JSON.stringify(filtros));

    return this.http.get(`${ this.url }/proceso-diagnostico-tratamiento/`,{params:params});
  }

  crearProcesoDiagnosticoTratamiento( procesoDiagnosticoTratamiento: ProcesoDiagnosticoTratamientoModelo ) {

    return this.http.post(`${ this.url }/proceso-diagnostico-tratamiento`, procesoDiagnosticoTratamiento);

  }
}
