import { Component, OnInit } from '@angular/core';
import { PacientesService } from '../../../servicios/pacientes.service';
import { PacienteModelo } from '../../../modelos/paciente.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {

  pacientes: PacienteModelo[] = [];
  persona: PersonaModelo = new PersonaModelo();
  buscador: PacienteModelo = new PacienteModelo();
  cargando = false;


  constructor( private pacientesService: PacientesService) { }

  ngOnInit() {

    this.cargando = true;
    this.pacientesService.buscarPacientes()
      .subscribe( resp => {
        this.pacientes = resp;
        this.cargando = false;
      });

  }

  buscadorPacientes() {
    this.buscador.personas = this.persona;
    this.pacientesService.buscarPacientesFiltros(this.buscador)
    .subscribe( resp => {
      this.pacientes = resp;
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
    this.buscador = new PacienteModelo();
    this.persona = new PersonaModelo();   
    this.buscadorPacientes();
  }

  borrarPaciente( paciente: PacienteModelo ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ paciente.personas.nombres }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        let peticion: Observable<any>;
        peticion = this.pacientesService.borrarPaciente( paciente.pacienteId );

        peticion.subscribe( resp => {
          Swal.fire({
                    icon: 'info',
                    title: paciente.personas.nombres,
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
