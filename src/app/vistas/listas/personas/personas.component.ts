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

  dtOptions: DataTables.Settings = {};

  personas: PersonaModelo[] = [];
  buscador: PersonaModelo = new PersonaModelo();
  buscadorForm: FormGroup;
  cargando = false;  

  constructor( private personasService: PersonasService,
               private fb: FormBuilder ) { 
    
  }

  ngOnInit() {
    this.crearFormulario();
    this.crearTabla();
  }

  crearTabla(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [[5,10,15,20,50,-1],[5,10,15,20,50,"Todos"]],
      searching: false,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
      },
      processing: true,
      columns: [
        {data:'#'},
        {data:'personaId'}, {data:'cedula'}, {data:'nombres'},
        {data:'apellidos'}, {data:'edad'}, {data:'direccion'},
        {data:'email'}, {data:'estadoCivil'},
        {data:'fechaNacimiento'},{data:'nacionalidad'},{data:'sexo'},
        {data:'telefono'},{data:'celular'},
        {data:'Editar'},
        {data:'Borrar'},
      ]
    };
  }

  buscadorPersonas(event) {
    event.preventDefault();
    this.cargando = true;
    this.buscador = this.buscadorForm.getRawValue();
    this.personasService.buscarPersonasFiltros(this.buscador)
    .subscribe( resp => {
      this.personas = resp;
      this.cargando = false;
    }, e => {
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.obtenerError(e)
      })
      this.cargando = false;
    });
  }

  limpiar(event) {
    event.preventDefault();
    this.buscadorForm.reset();
    this.buscador = new PersonaModelo();
    this.personas = [];
  }

  borrarPersona(event, persona: PersonaModelo ) {

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
                  icon: 'error',
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
