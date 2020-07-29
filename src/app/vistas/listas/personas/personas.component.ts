import { Component, OnInit } from '@angular/core';
import { PersonasService } from '../../../servicios/personas.service';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  buscadorForm: FormGroup;
  cargando = false;  

  constructor( private personasService: PersonasService,
               private fb: FormBuilder ) { 
    this.crearFormulario();
  }

  ngOnInit() {    
    this.cargando = true;
    this.personasService.buscarPersonasFiltros(null)
      .subscribe( resp => {
        this.personas = resp;
        this.cargando = false;
      }, e => {      
        Swal.fire({
          icon: 'info',
          title: 'Algo salio mal',
          text: e.status +'. '+ this.obtenerError(e),
        })
        this.cargando = false;
      });
  }

  buscadorPersonas() {
    this.buscador = this.buscadorForm.getRawValue();
    this.personasService.buscarPersonasFiltros(this.buscador)
    .subscribe( resp => {
      this.personas = resp;
      this.cargando = false;
    }, e => {
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.obtenerError(e),
      })
    });
  }

  limpiar() {
    this.buscadorForm.reset();
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
              icon: 'info',
              title: 'Algo salio mal',
              text: e.status +'. '+ this.obtenerError(e),
            })
          }
        );
      }
    });
  }

  obtenerError(e : any){
    var mensaje = "Error indefinido ";
      if(e.error.mensaje){
        mensaje = e.error.mensaje;
      }
      if(e.error.message){
        mensaje = e.error.message;
      }
      if(e.error.errors){
        mensaje = mensaje + ' ' + e.error.errors[0];
      }
      if(e.error.error){
        mensaje = mensaje + ' ' + e.error.error;
      }
    return mensaje;  
  }

  crearFormulario() {

    this.buscadorForm = this.fb.group({
      personaId  : ['', [] ],
      cedula  : ['', [] ],
      nombres  : ['', [] ],
      apellidos: ['', [] ]   
    });
  }
}
