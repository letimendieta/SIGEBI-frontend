import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AntecedenteModelo } from '../modelos/antecedente.modelo';
import { map, delay } from 'rxjs/operators';
import { HttpParams } from "@angular/common/http";
import { GlobalConstants } from '../common/global-constants';

@Injectable({
  providedIn: 'root'
})
export class AntecedentesService {

  private url = GlobalConstants.apiUrlBackend;

  constructor( private http: HttpClient ) { }


  crearAntecedente( antecedente: AntecedenteModelo ) {

    return this.http.post(`${ this.url }/antecedentes`, antecedente);

  }

  actualizarAntecedente( antecedente: AntecedenteModelo ) {

    const AntecedenteTemp = {
      ...antecedente
    };

    return this.http.put(`${ this.url }/antecedentes/`, AntecedenteTemp);


  }

  borrarAntecedente( id: number ) {

    return this.http.delete(`${ this.url }/antecedentes/${ id }`);

  }


  getAntecedente( id: number ) {

    return this.http.get(`${ this.url }/antecedentes/${ id }`);

  }


  getAntecedentes() {
    return this.http.get(`${ this.url }/antecedentes`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  buscarAntecedentes() {
    return this.http.get(`${ this.url }/antecedentes/buscar`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  buscarAntecedentesFiltrosOrder( antecedente: AntecedenteModelo, orderBy:string, orderDir:string ) {
    let params = new HttpParams();
    var filtros = antecedente == null ? new AntecedenteModelo() : antecedente;
    params = params.append('filtros', JSON.stringify(filtros));
    params = params.append('orderBy', orderBy);
    params = params.append('orderDir', orderDir);
    params = params.append('size', '-1');

    params = params.append('filtros', JSON.stringify(filtros));
    return this.http.get(`${ this.url }/antecedentes/buscar/`,{params:params});
  }

  buscarAntecedentesFiltros( antecedente: AntecedenteModelo ) {
    let params = new HttpParams();
    var filtros = antecedente == null ? new AntecedenteModelo() : antecedente;
    params = params.append('filtros', JSON.stringify(filtros));

    return this.http.get(`${ this.url }/antecedentes/buscar/`,{params:params})
      .pipe(
        map( this.crearArreglo ),
        delay(0)
      );
  }

  buscarAntecedentesFiltrosTabla( antecedente: AntecedenteModelo ) {
    let params = new HttpParams();
    var filtros = antecedente == null ? new AntecedenteModelo() : antecedente;
    
    params = params.append('filtros', JSON.stringify(filtros));
    return this.http.get(`${ this.url }/antecedentes/buscar/`,{params:params})
      .pipe(
        map( this.crearArreglo ),
        delay(0)
      );
  }

  private crearArreglo( AntecedentesObj: object ) {

    const antecedentes: AntecedenteModelo[] = [];

    Object.keys( AntecedentesObj ).forEach( key => {

      const antecedente: AntecedenteModelo = AntecedentesObj[key];
      antecedentes.push( antecedente );
    });

    return antecedentes;

  }
}
