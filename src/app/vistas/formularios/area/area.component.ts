import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { AreaModelo } from '../../../modelos/area.modelo';
import { AreasService } from '../../../servicios/areas.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit {
  crear = false;
  areaForm: FormGroup;

  area: AreaModelo = new AreaModelo();

  constructor( private areasService: AreasService,
               private route: ActivatedRoute,
               private router: Router,
               private fb: FormBuilder ) { 
    this.crearFormulario();
  }              

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.areaForm.get('estado').setValue('A');
    if ( id !== 'nuevo' ) {
      
      this.areasService.getArea( Number(id) )
        .subscribe( (resp: AreaModelo) => {
          this.areaForm.patchValue(resp);
        });
    }else{
      this.crear = true;
    }
  }  

  guardar( ) {

    if ( this.areaForm.invalid ) {

      return Object.values( this.areaForm.controls ).forEach( control => {

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

    this.area = this.areaForm.getRawValue();

    if ( this.area.areaId ) {
      //Modificar
      this.area.usuarioModificacion = 'admin';
      peticion = this.areasService.actualizarArea( this.area );
    } else {
      //Agregar
      this.area.usuarioCreacion = 'admin';
      peticion = this.areasService.crearArea( this.area );
    }

    peticion.subscribe( resp => {

      Swal.fire({
                icon: 'success',
                title: this.area.codigo,
                text: resp.mensaje,
              }).then( resp => {

        if ( resp.value ) {
          if ( this.area.areaId ) {
            this.router.navigate(['/areas']);
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
    this.area = new AreaModelo();
    this.areaForm.reset();
    this.areaForm.get('estado').setValue('A');
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
    return this.areaForm.get('codigo').invalid && this.areaForm.get('codigo').touched
  }

  get descripcionNoValido() {
    return this.areaForm.get('descripcion').invalid && this.areaForm.get('descripcion').touched
  }

  crearFormulario() {

    this.areaForm = this.fb.group({
      areaId  : [null, [] ],
      codigo  : [null, [ Validators.required ]  ],
      descripcion  : [null, [ Validators.required]  ],
      estado: [null, [] ],
      fechaCreacion: [null, [] ],
      fechaModificacion: [null, [] ],
      usuarioCreacion: [null, [] ],
      usuarioModificacion: [null, [] ],     
    });

    this.areaForm.get('areaId').disable();
    this.areaForm.get('fechaCreacion').disable();
    this.areaForm.get('fechaModificacion').disable();
    this.areaForm.get('usuarioCreacion').disable();
    this.areaForm.get('usuarioModificacion').disable();
  }

}
