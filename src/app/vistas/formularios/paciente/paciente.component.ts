import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

import { PacienteModelo } from '../../../modelos/paciente.modelo';
import { PacientesService } from '../../../servicios/pacientes.service';

import { PersonaModelo } from '../../../modelos/persona.modelo';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {

  paciente: PacienteModelo = new PacienteModelo();
  persona: PersonaModelo = new PersonaModelo();

  modificar: boolean = false;


  constructor( private pacientesService: PacientesService,
               private route: ActivatedRoute ) { }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    if ( id !== 'nuevo' ) {
      //this.modificar = true;
      this.pacientesService.getPaciente( Number(id) )
        .subscribe( (resp: PacienteModelo) => {
          this.paciente = resp;
          this.persona = resp.personas;
        });
    }
  }

  obtenerPersona( id : number ){

    this.pacientesService.getPersona( id )
        .subscribe( (resp: PersonaModelo) => {
          this.persona = resp;
        }, e => {
            Swal.fire({
              icon: 'info',
              //title: 'Algo salio mal',
              text: e.status +'. '+e.error.mensaje,
            })
          }
        );

  }
  
  guardar( form: NgForm ) {

    if ( form.invalid ) {
      console.log('Formulario no válido');
      return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    let peticion: Observable<any>;       

    if ( this.paciente.pacienteId ) {
      this.persona.usuarioModificacion = 'admin';
      this.paciente.personas = this.persona;
      this.paciente.usuarioModificacion = 'admin';
      peticion = this.pacientesService.actualizarPaciente( this.paciente );
    } else {
      this.persona.usuarioCreacion = 'admin';
      this.paciente.personas = this.persona;
      this.paciente.usuarioCreacion = 'admin';
      peticion = this.pacientesService.crearPaciente( this.paciente );
    }

    peticion.subscribe( resp => {

      Swal.fire({
                icon: 'info',
                title: this.paciente.personas.nombres,
                text: resp.mensaje,
              }).then( resp => {

        if ( resp.value ) {
          if ( this.paciente.pacienteId ) {
            //volver a la lista de pacientes
          }else{
            this.limpiar();
          }
        }

      });
    }, e => {
          var mensaje = "";
          if(e.status != 500){
            mensaje = e.status +'. '+e.error.errors[0];
          }else{
            mensaje = e.status +'. '+ e.error.mensaje +'. '+ e.error.error;
          }
            Swal.fire({
              icon: 'error',
              title: 'Algo salio mal',
              text: mensaje,
            })
          
       }
    );
  }

  limpiar(){
    this.paciente = new PacienteModelo();
    this.persona = new PersonaModelo();
  }
}
