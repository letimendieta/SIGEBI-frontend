import { Component, OnInit } from '@angular/core';
import { PersonasService } from '../../../servicios/personas.service';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.css']
})
export class PersonasComponent implements OnInit {

  personas: PersonaModelo[] = [];
  buscador: PersonaModelo = new PersonaModelo();
  cargando = false;  

  constructor( private personasService: PersonasService) { }

  ngOnInit() {    
    this.cargando = true;
    this.personasService.buscarPersonasFiltros(null)
      .subscribe( resp => {
        this.personas = resp;
        this.cargando = false;
      });

  }

  buscadorPersonas() {
    this.personasService.buscarPersonasFiltros(this.buscador)
    .subscribe( resp => {
      this.personas = resp;
      this.cargando = false;
    }, e => {
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.error.mensaje,
      })
    });
  }

  limpiar() {
    this.buscador = new PersonaModelo();
    this.buscadorPersonas();
  }

  borrarPersona( persona: PersonaModelo ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ persona.nombres }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        let peticion: Observable<any>;
        //this.personas.splice(i, 1);
        peticion = this.personasService.borrarPersona( persona.personaId );

        peticion.subscribe( resp => {
          Swal.fire({
                    icon: 'success',
                    title: persona.nombres,
                    text: resp.mensaje,
                  }).then( resp => {
            if ( resp.value ) {
              this.ngOnInit();
            }
          });
        }, e => {
                Swal.fire({
                  icon: 'error',
                  title: 'Algo salio mal',
                  text: e.status +'. '+e.error.errors[0],
                })
            }
        );
      }

    });
  }
}
