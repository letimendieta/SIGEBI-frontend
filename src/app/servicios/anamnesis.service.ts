import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AnamnesisModelo } from '../modelos/anamnesis.modelo';
import { map, delay } from 'rxjs/operators';
import { HttpParams } from "@angular/common/http";
import { GlobalConstants } from '../common/global-constants';

@Injectable({
  providedIn: 'root'
})
export class AnamnesisService {

  private url = GlobalConstants.apiUrlBackend;

  constructor( private http: HttpClient ) { }


  crearAnamnesis( anamnesis: AnamnesisModelo ) {

    return this.http.post(`${ this.url }/anamnesis`, anamnesis);

  }

  actualizarAnamnesis( anamnesis: AnamnesisModelo ) {

    const AnamnesisTemp = {
      ...anamnesis
    };

    return this.http.put(`${ this.url }/anamnesis/`, AnamnesisTemp);


  }

  borrarAnamnesis( id: number ) {

    return this.http.delete(`${ this.url }/anamnesis/${ id }`);

  }


  getAnamnesis( id: number ) {

    return this.http.get(`${ this.url }/anamnesis/${ id }`);

  }


  getAnamnesisList() {
    return this.http.get(`${ this.url }/anamnesis`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  buscarAnamnesis() {
    return this.http.get(`${ this.url }/anamnesis/buscar`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  buscarAnamnesisFiltros( anamnesis: AnamnesisModelo, orderBy:string, orderDir:string ) {
    let params = new HttpParams();
    var filtros = anamnesis == null ? new AnamnesisModelo() : anamnesis;
    params = params.append('filtros', JSON.stringify(filtros));
    params = params.append('orderBy', orderBy);
    params = params.append('orderDir', orderDir);
    params = params.append('size', '-1');

    params = params.append('filtros', JSON.stringify(filtros));
    return this.http.get(`${ this.url }/anamnesis/buscar/`,{params:params});
  }

  buscarAnamnesisFiltrosTabla( anamnesis: AnamnesisModelo ) {
    let params = new HttpParams();
    var filtros = anamnesis == null ? new AnamnesisModelo() : anamnesis;
    
    params = params.append('filtros', JSON.stringify(filtros));
    return this.http.get(`${ this.url }/anamnesis/buscar/`,{params:params})
      .pipe(
        map( this.crearArreglo ),
        delay(0)
      );
  }

  private crearArreglo( AnamnesisObj: object ) {

    const anamnesisList: AnamnesisModelo[] = [];

    Object.keys( AnamnesisObj ).forEach( key => {

      const anamnesis: AnamnesisModelo = AnamnesisObj[key];
      anamnesisList.push( anamnesis );
    });

    return anamnesisList;

  }
}
