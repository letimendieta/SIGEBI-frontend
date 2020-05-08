import { Component, OnInit } from '@angular/core';
import { PersonasService } from '../../../servicios/personas.service';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.css']
})
export class PersonasComponent implements OnInit {

  personas: PersonaModelo[] = [];
  cargando = false;


  constructor( private personasService: PersonasService) { }

  ngOnInit() {

    this.cargando = true;
    this.personasService.getPersonas()
      .subscribe( resp => {
        this.personas = resp;
        this.cargando = false;
      });

  }

  borrarPersona( persona: PersonaModelo, i: number ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ persona.nombres }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        this.personas.splice(i, 1);
        this.personasService.borrarPersona( persona.personaId ).subscribe();
        this.ngOnInit();
      }

    });



  }


}
