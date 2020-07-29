import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { FuncionarioModelo } from '../../../modelos/funcionario.modelo';
import { HorarioModelo } from '../../../modelos/horario.modelo';
import { HorariosService } from '../../../servicios/horarios.service';
import { FuncionariosService } from '../../../servicios/funcionarios.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css']
})
export class HorarioComponent implements OnInit {
  crear = false;
  horarioForm: FormGroup;

  horario: HorarioModelo = new HorarioModelo();

  constructor( private horariosService: HorariosService,
               private funcionariosService: FuncionariosService,
               private route: ActivatedRoute, 
               private fb: FormBuilder ) { 
    this.crearFormulario();
  }              

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.horarioForm.get('estado').setValue('A');
    if ( id !== 'nuevo' ) {
      
      this.horariosService.getHorario( Number(id) )
        .subscribe( (resp: HorarioModelo) => {
          this.horarioForm.patchValue(resp);
        });
    }else{
      this.crear = true;
    }
  } 

  obtenerFuncionario( ){
    var id = this.horarioForm.get('funcionarios').get('funcionarioId').value;
    this.funcionariosService.getFuncionario( id )
      .subscribe( (resp: FuncionarioModelo) => {          
        this.horarioForm.get('funcionarios').patchValue(resp);
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

    if ( this.horarioForm.invalid ) {

      return Object.values( this.horarioForm.controls ).forEach( control => {

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

    this.horario = this.horarioForm.getRawValue();

    if ( this.horario.horarioDisponibleId ) {
      //Modificar
      this.horario.usuarioModificacion = 'admin';
      peticion = this.horariosService.actualizarHorario( this.horario );
    } else {
      //Agregar
      this.horario.usuarioCreacion = 'admin';
      peticion = this.horariosService.crearHorario( this.horario );
    }

    peticion.subscribe( resp => {

      Swal.fire({
                icon: 'success',
                title: this.horario.horarioDisponibleId,
                text: resp.mensaje,
              }).then( resp => {

        if ( resp.value ) {
          if ( this.horario.horarioDisponibleId ) {
            //volver a la lista de horarios
          }else{
            this.limpiar();
          }
        }

      });
    }, e => {Swal.fire({
              icon: 'error',
              title: 'Algo salio mal',
              text: e.status +'. '+ this.obtenerError(e),
            })
       }
    );
  }

  limpiar(){
    this.horario = new HorarioModelo();
    this.horarioForm.reset();
    this.horarioForm.get('estado').setValue('A');
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

  get funcionarioIdNoValido() {
    return this.horarioForm.get('funcionarios').get('funcionarioId').invalid 
    && this.horarioForm.get('funcionarios').get('funcionarioId').touched
  }
  get fechaNoValido() {
    return this.horarioForm.get('fecha').invalid && this.horarioForm.get('fecha').touched
  }

  get horaInicioNoValido() {
    return this.horarioForm.get('horaInicio').invalid && this.horarioForm.get('horaInicio').touched
  }

  get horaFinNoValido() {
    return this.horarioForm.get('horaFin').invalid && this.horarioForm.get('horaFin').touched
  }

  crearFormulario() {
    this.horarioForm = this.fb.group({
      horarioDisponibleId  : [null, [] ],
      fecha  : [null, [Validators.required] ],
      horaInicio  : [null, [Validators.required] ],
      horaFin  : [null, [Validators.required] ],
      funcionarios : this.fb.group({
        funcionarioId  : [null, [] ],
        personas : this.fb.group({
          cedula  : [null, [] ],
          nombres  : [null, [] ],
          apellidos  : [null, [] ]
        })
      }),
      estado: [null, [] ],
      fechaCreacion: [null, [] ],
      fechaModificacion: [null, [] ],
      usuarioCreacion: [null, [] ],
      usuarioModificacion: [null, [] ]     
    });

    this.horarioForm.get('horarioDisponibleId').disable();
    this.horarioForm.get('funcionarios').get('personas').get('cedula').disable();
    this.horarioForm.get('funcionarios').get('personas').get('nombres').disable();
    this.horarioForm.get('funcionarios').get('personas').get('apellidos').disable();

    this.horarioForm.get('fechaCreacion').disable();
    this.horarioForm.get('fechaModificacion').disable();
    this.horarioForm.get('usuarioCreacion').disable();
    this.horarioForm.get('usuarioModificacion').disable();
  }

}
