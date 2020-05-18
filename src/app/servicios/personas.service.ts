import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PersonaModelo } from '../modelos/persona.modelo';
import { map, delay } from 'rxjs/operators';
import { HttpParams } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class PersonasService {

  //private url = 'https://sigebi-app.firebaseio.com/';

  private url = 'http://localhost:8080';

  constructor( private http: HttpClient ) { }


  crearPersona( persona: PersonaModelo ) {

    return this.http.post(`${ this.url }/personas`, persona);

  }

  actualizarPersona( persona: PersonaModelo ) {

    const personaTemp = {
      ...persona
    };

    return this.http.put(`${ this.url }/personas/`, personaTemp);
  }

  borrarPersona( id: number ) {

    return this.http.delete(`${ this.url }/personas/${ id }`);

  }


  getPersona( id: number ) {

    return this.http.get(`${ this.url }/personas/${ id }`);

  }


  getPersonas() {
    return this.http.get(`${ this.url }/personas`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  buscarPersonas() {
    return this.http.get(`${ this.url }/personas/buscar`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  buscarPersonasFiltros( persona: PersonaModelo ) {
    let params = new HttpParams();
    params = params.append('filtros', JSON.stringify(persona));

    return this.http.get(`${ this.url }/personas/buscar/`,{params:params})
      .pipe(
        map( this.crearArreglo ),
        delay(0)
      );

  }

  private crearArreglo( personasObj: object ) {

    const personas: PersonaModelo[] = [];

    Object.keys( personasObj ).forEach( key => {

      const persona: PersonaModelo = personasObj[key];

      personas.push( persona );
    });

    return personas;

  }

}
