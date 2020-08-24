import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { DepartamentoModelo } from '../../../modelos/departamento.modelo';
import { DepartamentosService } from '../../../servicios/departamentos.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.css']
})
export class DepartamentoComponent implements OnInit {
  crear = false;
  departamentoForm: FormGroup;

  departamento: DepartamentoModelo = new DepartamentoModelo();

  constructor( private departamentosService: DepartamentosService,
               private route: ActivatedRoute,
               private router: Router,
               private fb: FormBuilder ) { 
    this.crearFormulario();
  }              

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.departamentoForm.get('estado').setValue('A');
    if ( id !== 'nuevo' ) {
      
      this.departamentosService.getDepartamento( Number(id) )
        .subscribe( (resp: DepartamentoModelo) => {
          this.departamentoForm.patchValue(resp);
        });
    }else{
      this.crear = true;
    }
  }  

  guardar( ) {

    if ( this.departamentoForm.invalid ) {

      return Object.values( this.departamentoForm.controls ).forEach( control => {

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

    this.departamento = this.departamentoForm.getRawValue();

    if ( this.departamento.departamentoId ) {
      //Modificar
      this.departamento.usuarioModificacion = 'admin';
      peticion = this.departamentosService.actualizarDepartamento( this.departamento );
    } else {
      //Agregar
      this.departamento.usuarioCreacion = 'admin';
      peticion = this.departamentosService.crearDepartamento( this.departamento );
    }

    peticion.subscribe( resp => {

      Swal.fire({
                icon: 'success',
                title: this.departamento.codigo,
                text: resp.mensaje,
              }).then( resp => {

        if ( resp.value ) {
          if ( this.departamento.departamentoId ) {
            this.router.navigate(['/departamentos']);
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
    this.departamento = new DepartamentoModelo();
    this.departamentoForm.reset();
    this.departamentoForm.get('estado').setValue('A');
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

  get codigoNoValido() {
    return this.departamentoForm.get('codigo').invalid && this.departamentoForm.get('codigo').touched
  }

  get descripcionNoValido() {
    return this.departamentoForm.get('descripcion').invalid && this.departamentoForm.get('descripcion').touched
  }

  crearFormulario() {

    this.departamentoForm = this.fb.group({
      departamentoId  : [null, [] ],
      codigo  : [null, [ Validators.required ]  ],
      descripcion  : [null, [ Validators.required]  ],
      estado: [null, [] ],
      fechaCreacion: [null, [] ],
      fechaModificacion: [null, [] ],
      usuarioCreacion: [null, [] ],
      usuarioModificacion: [null, [] ],     
    });

    this.departamentoForm.get('departamentoId').disable();
    this.departamentoForm.get('fechaCreacion').disable();
    this.departamentoForm.get('fechaModificacion').disable();
    this.departamentoForm.get('usuarioCreacion').disable();
    this.departamentoForm.get('usuarioModificacion').disable();
  }

}