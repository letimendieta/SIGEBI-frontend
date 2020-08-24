import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ProcedimientoModelo } from '../../../modelos/procedimiento.modelo';
import { FuncionarioModelo } from '../../../modelos/funcionario.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ProcedimientosService } from '../../../servicios/procedimientos.service';
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

  procedimientoForm: FormGroup;

  modificar: boolean = false;


  constructor( private procedimientosService: ProcedimientosService,
               private pacientesService: PacientesService,
               private funcionariosService: FuncionariosService,
               private router: Router,
               private route: ActivatedRoute,
               private fb: FormBuilder ) { 
    this.crearFormulario();
  }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    if ( id !== 'nuevo' ) {
      this.procedimientosService.getProcedimiento( Number(id) )
        .subscribe( (resp: ProcedimientoModelo) => {         
          this.procedimientoForm.patchValue(resp);
        });
    }else{
      this.crear = true;
    }
  }  

  obtenerPaciente(event ){
    event.preventDefault();
    var id = this.procedimientoForm.get('pacientes').get('pacienteId').value;
    this.pacientesService.getPaciente( id )
        .subscribe( (resp: PacienteModelo) => {         
          this.procedimientoForm.get('pacientes').patchValue(resp);
        }, e => {
            Swal.fire({
              icon: 'info',
              text: e.status +'. '+ this.obtenerError(e),
            })
          }
        );

  }
  obtenerFuncionario(event ){
    event.preventDefault();

    var id = this.procedimientoForm.get('funcionarios').get('funcionarioId').value;
    this.funcionariosService.getFuncionario( id )
      .subscribe( (resp: FuncionarioModelo) => {          
        this.procedimientoForm.get('funcionarios').patchValue(resp);
      }, e => {
          Swal.fire({
            icon: 'info',
            //title: 'Algo salio mal',
            text: e.status +'. '+ this.obtenerError(e),
          })
        }
      );
  }
  
  guardar( ) {

    if ( this.procedimientoForm.invalid ){
      return Object.values( this.procedimientoForm.controls ).forEach( control => {
        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
      });
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    let peticion: Observable<any>;

    this.procedimiento = this.procedimientoForm.getRawValue();

    if ( this.procedimiento.procedimientoId ) {
      this.procedimiento.usuarioModificacion = 'admin';
      peticion = this.procedimientosService.actualizarProcedimiento( this.procedimiento );
    } else {
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
            this.router.navigate(['/procedimientos']);
          }else{
            this.limpiar();
          }
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

  limpiar(){
    this.procedimientoForm.reset();
    this.procedimiento = new ProcedimientoModelo();
    this.paciente = new PacienteModelo();
    this.funcionario = new FuncionarioModelo();
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
  
  get notaNoValido() {
    return this.procedimientoForm.get('notas').invalid && this.procedimientoForm.get('notas').touched
  }

  crearFormulario() {
    this.procedimientoForm = this.fb.group({
      procedimientoId  : [null, [] ],
      pacientes : this.fb.group({
        pacienteId  : [null, [] ],
        personas : this.fb.group({
          cedula  : [null, [] ],
          nombres  : [null, [] ],
          apellidos  : [null, [] ]
        })
      }),
      funcionarios : this.fb.group({
        funcionarioId  : [null, [] ],
        personas : this.fb.group({
          cedula  : [null, [] ],
          nombres  : [null, [] ],
          apellidos  : [null, [] ]
        })
      }),
      insumoId  : [null, [] ],
      fecha  : [null, [] ],
      notas  : [null, [Validators.required] ],
      fechaCreacion: [null, [] ],
      fechaModificacion: [null, [] ],
      usuarioCreacion: [null, [] ],
      usuarioModificacion: [null, [] ],             
    });

    this.procedimientoForm.get('procedimientoId').disable();
    this.procedimientoForm.get('pacientes').get('personas').get('cedula').disable();
    this.procedimientoForm.get('pacientes').get('personas').get('nombres').disable();
    this.procedimientoForm.get('pacientes').get('personas').get('apellidos').disable();

    this.procedimientoForm.get('funcionarios').get('personas').get('cedula').disable();
    this.procedimientoForm.get('funcionarios').get('personas').get('nombres').disable();
    this.procedimientoForm.get('funcionarios').get('personas').get('apellidos').disable();

    this.procedimientoForm.get('fechaCreacion').disable();
    this.procedimientoForm.get('fechaModificacion').disable();
    this.procedimientoForm.get('usuarioCreacion').disable();
    this.procedimientoForm.get('usuarioModificacion').disable();
  }
}
