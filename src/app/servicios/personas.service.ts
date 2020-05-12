import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PersonaModelo } from '../modelos/persona.modelo';
import { map, delay } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PersonasService {

  //private url = 'https://sigebi-app.firebaseio.com/';

  private url = 'http://localhost:8080';

  constructor( private http: HttpClient ) { }


  crearPersona( persona: PersonaModelo ) {

    return this.http.post(`${ this.url }/personas`, persona)
            .pipe(
              map( (resp: any) => {
                //persona.id = resp.name;
                return persona;
              })
            );

  }

  actualizarPersona( persona: PersonaModelo ) {

    const personaTemp = {
      ...persona
    };

    delete personaTemp.personaId;

    return this.http.put(`${ this.url }/personas/${ persona.personaId }`, personaTemp);


  }

  borrarPersona( id: number ) {

    return this.http.delete(`${ this.url }/personas/${ id }`);

  }


  getPersona( id: string ) {

    return this.http.get(`${ this.url }/personas/${ id }.json`);

  }


  getPersonas() {
    return this.http.get(`${ this.url }/personas`)/*/personas.json*/
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  private crearArreglo( personasObj: object ) {

    const personas: PersonaModelo[] = [];

    Object.keys( personasObj ).forEach( key => {

      const persona: PersonaModelo = personasObj[key];
      //persona.id = key;

      personas.push( persona );
    });


    return personas;

  }


}
