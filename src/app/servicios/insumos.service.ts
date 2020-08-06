import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InsumoModelo } from '../modelos/insumo.modelo';
import { map, delay } from 'rxjs/operators';
import { HttpParams } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class InsumosService {

  //private url = 'https://sigebi-app.firebaseio.com/';

  private url = 'http://localhost:8080/auth';

  constructor( private http: HttpClient ) { }


  crearInsumo( insumo: InsumoModelo ) {

    return this.http.post(`${ this.url }/insumos`, insumo);

  }

  actualizarInsumo( insumo: InsumoModelo ) {

    const InsumoTemp = {
      ...insumo
    };

    return this.http.put(`${ this.url }/insumos/`, InsumoTemp);


  }

  borrarInsumo( id: number ) {

    return this.http.delete(`${ this.url }/insumos/${ id }`);

  }


  getInsumo( id: number ) {

    return this.http.get(`${ this.url }/insumos/${ id }`);

  }


  getInsumos() {
    return this.http.get(`${ this.url }/insumos`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  buscarInsumos() {
    return this.http.get(`${ this.url }/insumos/buscar`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  buscarInsumosFiltros( insumo: InsumoModelo, orderBy:string, orderDir:string ) {
    let params = new HttpParams();
    var filtros = insumo == null ? new InsumoModelo() : insumo;
    params = params.append('filtros', JSON.stringify(filtros));
    params = params.append('orderBy', orderBy);
    params = params.append('orderDir', orderDir);

    params = params.append('filtros', JSON.stringify(filtros));
    return this.http.get(`${ this.url }/insumos/buscar/`,{params:params});
  }

  buscarInsumosFiltrosTabla( insumo: InsumoModelo ) {
    let params = new HttpParams();
    var filtros = insumo == null ? new InsumoModelo() : insumo;
    
    params = params.append('filtros', JSON.stringify(filtros));
    return this.http.get(`${ this.url }/insumos/buscar/`,{params:params})
      .pipe(
        map( this.crearArreglo ),
        delay(0)
      );
  }

  private crearArreglo( InsumosObj: object ) {

    const insumos: InsumoModelo[] = [];

    Object.keys( InsumosObj ).forEach( key => {

      const insumo: InsumoModelo = InsumosObj[key];
      insumos.push( insumo );
    });

    return insumos;

  }
}
