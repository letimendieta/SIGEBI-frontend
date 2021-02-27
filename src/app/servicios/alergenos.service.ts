import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlergenoModelo } from '../modelos/alergeno.modelo';
import { map, delay } from 'rxjs/operators';
import { HttpParams } from "@angular/common/http";
import { GlobalConstants } from '../common/global-constants';

@Injectable({
  providedIn: 'root'
})
export class AlergenosService {

  private url = GlobalConstants.apiUrlBackend;

  constructor( private http: HttpClient ) { }


  crearAlergeno( alergeno: AlergenoModelo ) {

    return this.http.post(`${ this.url }/alergenos`, alergeno);

  }

  actualizarAlergeno( alergeno: AlergenoModelo ) {

    const AlergenoTemp = {
      ...alergeno
    };

    return this.http.put(`${ this.url }/alergenos/`, AlergenoTemp);


  }

  borrarAlergeno( id: number ) {

    return this.http.delete(`${ this.url }/alergenos/${ id }`);

  }


  getAlergeno( id: number ) {

    return this.http.get(`${ this.url }/alergenos/${ id }`);

  }


  getAlergenos() {
    return this.http.get(`${ this.url }/alergenos`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  buscarAlergenos() {
    return this.http.get(`${ this.url }/alergenos/buscar`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  buscarAlergenosFiltros( alergeno: AlergenoModelo, orderBy:string, orderDir:string ) {
    let params = new HttpParams();
    var filtros = alergeno == null ? new AlergenoModelo() : alergeno;
    params = params.append('filtros', JSON.stringify(filtros));
    params = params.append('orderBy', orderBy);
    params = params.append('orderDir', orderDir);
    params = params.append('size', '-1');

    params = params.append('filtros', JSON.stringify(filtros));
    return this.http.get(`${ this.url }/alergenos/buscar/`,{params:params});
  }

  buscarAlergenosFiltrosTabla( alergeno: AlergenoModelo ) {
    let params = new HttpParams();
    var filtros = alergeno == null ? new AlergenoModelo() : alergeno;
    
    params = params.append('filtros', JSON.stringify(filtros));
    return this.http.get(`${ this.url }/alergenos/buscar/`,{params:params})
      .pipe(
        map( this.crearArreglo ),
        delay(0)
      );
  }

  private crearArreglo( AlergenosObj: object ) {

    const alergenos: AlergenoModelo[] = [];

    Object.keys( AlergenosObj ).forEach( key => {

      const alergeno: AlergenoModelo = AlergenosObj[key];
      alergenos.push( alergeno );
    });

    return alergenos;

  }
}
