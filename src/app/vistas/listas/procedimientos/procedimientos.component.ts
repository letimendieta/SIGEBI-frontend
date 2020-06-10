import { Component, OnInit } from '@angular/core';
import { ProcedimientosService } from '../../../servicios/procedimientos.service';
import { ProcedimientoModelo } from '../../../modelos/procedimiento.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import { PacienteModelo } from '../../../modelos/paciente.modelo';
import { FuncionarioModelo } from '../../../modelos/funcionario.modelo';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-procedimientos',
  templateUrl: './procedimientos.component.html',
  styleUrls: ['./procedimientos.component.css']
})
export class ProcedimientosComponent implements OnInit {

  procedimientos: ProcedimientoModelo[] = [];
  paciente : PacienteModelo = new PacienteModelo();
  pacientePersona: PersonaModelo = new PersonaModelo();

  funcionario: FuncionarioModelo = new FuncionarioModelo();
  funcionarioPersona: PersonaModelo = new PersonaModelo();

  buscador: ProcedimientoModelo = new ProcedimientoModelo();
  cargando = false;


  constructor( private procedimientosService: ProcedimientosService) { }

  ngOnInit() {

    this.cargando = true;
    this.procedimientosService.buscarProcedimientosFiltros(null)
      .subscribe( resp => {
        this.procedimientos = resp;
        this.cargando = false;
      });

  }

  buscadorProcedimientos() {
    this.paciente.personas = this.pacientePersona;
    this.buscador.pacientes = this.paciente;
    this.procedimientosService.buscarProcedimientosFiltros(this.buscador)
    .subscribe( resp => {
      this.procedimientos = resp;
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
    this.buscador = new ProcedimientoModelo();
    this.pacientePersona = new PersonaModelo();   
    this.buscadorProcedimientos();
  }

  borrarProcedimiento( procedimiento: ProcedimientoModelo ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea procedimiento id ${ procedimiento.procedimientoId }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        let peticion: Observable<any>;
        peticion = this.procedimientosService.borrarProcedimiento( procedimiento.procedimientoId );

        peticion.subscribe( resp => {
          Swal.fire({
                    icon: 'success',
                    title: procedimiento.procedimientoId,
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
