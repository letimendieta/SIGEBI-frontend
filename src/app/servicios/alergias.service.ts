import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlergiaModelo } from '../modelos/alergia.modelo';
import { map, delay } from 'rxjs/operators';
import { HttpParams } from "@angular/common/http";
import { GlobalConstants } from '../common/global-constants';

@Injectable({
  providedIn: 'root'
})
export class AlergiasService {

  private url = GlobalConstants.apiUrlBackend;

  constructor( private http: HttpClient ) { }


  crearAlergia( alergia: AlergiaModelo ) {

    return this.http.post(`${ this.url }/alergias`, alergia);

  }

  actualizarAlergia( alergia: AlergiaModelo ) {

    const AlergiaTemp = {
      ...alergia
    };

    return this.http.put(`${ this.url }/alergias/`, AlergiaTemp);


  }

  borrarAlergia( id: number ) {

    return this.http.delete(`${ this.url }/alergias/${ id }`);

  }


  getAlergia( id: number ) {

    return this.http.get(`${ this.url }/alergias/${ id }`);

  }


  getAlergias() {
    return this.http.get(`${ this.url }/alergias`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  buscarAlergias() {
    return this.http.get(`${ this.url }/alergias/buscar`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  buscarAlergiasFiltrosOrder( alergia: AlergiaModelo, orderBy:string, orderDir:string ) {
    let params = new HttpParams();
    var filtros = alergia == null ? new AlergiaModelo() : alergia;
    params = params.append('filtros', JSON.stringify(filtros));
    params = params.append('orderBy', orderBy);
    params = params.append('orderDir', orderDir);
    params = params.append('size', '-1');

    params = params.append('filtros', JSON.stringify(filtros));
    return this.http.get(`${ this.url }/alergias/buscar/`,{params:params});
  }

  buscarAlergiasFiltros( alergia: AlergiaModelo ) {
    let params = new HttpParams();
    var filtros = alergia == null ? new AlergiaModelo() : alergia;
    params = params.append('filtros', JSON.stringify(filtros));

    return this.http.get(`${ this.url }/alergias/buscar/`,{params:params})
      .pipe(
        map( this.crearArreglo ),
        delay(0)
      );
  }

  buscarAlergiasFiltrosTabla( alergia: AlergiaModelo ) {
    let params = new HttpParams();
    var filtros = alergia == null ? new AlergiaModelo() : alergia;
    
    params = params.append('filtros', JSON.stringify(filtros));
    return this.http.get(`${ this.url }/alergias/buscar/`,{params:params})
      .pipe(
        map( this.crearArreglo ),
        delay(0)
      );
  }

  private crearArreglo( AlergiasObj: object ) {

    const alergias: AlergiaModelo[] = [];

    Object.keys( AlergiasObj ).forEach( key => {

      const alergia: AlergiaModelo = AlergiasObj[key];
      alergias.push( alergia );
    });

    return alergias;

  }
}
