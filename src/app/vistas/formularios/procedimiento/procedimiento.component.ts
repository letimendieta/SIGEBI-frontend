import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

import { ProcedimientoModelo } from '../../../modelos/procedimiento.modelo';
import { ParametroModelo } from '../../../modelos/parametro.modelo';
import { FuncionarioModelo } from '../../../modelos/funcionario.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';

import { ProcedimientosService } from '../../../servicios/procedimientos.service';
import { ParametrosService } from '../../../servicios/parametros.service';
import { PacientesService } from '../../../servicios/pacientes.service';
import { FuncionariosService } from '../../../servicios/funcionarios.service';

import Swal from 'sweetalert2';
import { PacienteModelo } from 'src/app/modelos/paciente.modelo';

@Component({
  selector: 'app-procedimiento',
  templateUrl: './procedimiento.component.html',
  styleUrls: ['./procedimiento.component.css']
})
export class ProcedimientoComponent implements OnInit {
  crear = false;
  procedimiento: ProcedimientoModelo = new ProcedimientoModelo();
  pacientePersona: PersonaModelo = new PersonaModelo();  
  funcionarioPersona: PersonaModelo = new PersonaModelo();

  paciente: PacienteModelo = new PacienteModelo();
  funcionario: FuncionarioModelo = new FuncionarioModelo();

  modificar: boolean = false;


  constructor( private procedimientosService: ProcedimientosService,
               private parametrosService: ParametrosService,
               private pacientesService: PacientesService,
               private funcionariosService: FuncionariosService,
               private route: ActivatedRoute ) { }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');
    //this.obtenerParametros();

    if ( id !== 'nuevo' ) {
      this.procedimientosService.getProcedimiento( Number(id) )
        .subscribe( (resp: ProcedimientoModelo) => {
          this.procedimiento = resp;
          this.paciente = resp.pacientes;
          this.pacientePersona = resp.pacientes.personas;
          this.funcionario = resp.funcionarios;
          this.funcionarioPersona = resp.funcionarios.personas;
        });
    }else{
      this.crear = true;
    }
  }

  

  obtenerPaciente( id : number ){

    this.pacientesService.getPaciente( id )
        .subscribe( (resp: PacienteModelo) => {
          this.paciente = resp;
          this.pacientePersona = resp.personas;
        }, e => {
            Swal.fire({
              icon: 'info',
              //title: 'Algo salio mal',
              text: e.status +'. '+e.error.mensaje,
            })
          }
        );

  }
  obtenerFuncionario( id : number ){

    this.funcionariosService.getFuncionario( id )
        .subscribe( (resp: FuncionarioModelo) => {
          this.funcionario = resp;
          this.funcionarioPersona = resp.personas;
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

    if ( this.procedimiento.procedimientoId ) {

      this.procedimiento.funcionarios = this.funcionario;
      this.procedimiento.pacientes = this.paciente;
      this.procedimiento.usuarioModificacion = 'admin';

      peticion = this.procedimientosService.actualizarProcedimiento( this.procedimiento );
    } else {

      this.procedimiento.funcionarios = this.funcionario;
      this.procedimiento.pacientes = this.paciente;
      this.procedimiento.usuarioCreacion = 'admin';

      peticion = this.procedimientosService.crearProcedimiento( this.procedimiento );
    }

    peticion.subscribe( resp => {

      Swal.fire({
                icon: 'success',
                title: this.procedimiento.procedimientoId,
                text: resp.mensaje,
              }).then( resp => {

        if ( resp.value ) {
          if ( this.procedimiento.procedimientoId ) {
            //volver a la lista de procedimientos
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
    this.procedimiento = new ProcedimientoModelo();
    this.pacientePersona = new PersonaModelo();  
    this.funcionarioPersona = new PersonaModelo();
    this.paciente = new PacienteModelo();
    this.funcionario = new FuncionarioModelo();

  }
}
