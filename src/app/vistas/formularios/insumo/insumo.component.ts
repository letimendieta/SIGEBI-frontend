import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ComunesService } from 'src/app/servicios/comunes.service';
import { InsumoModelo } from '../../../modelos/insumo.modelo';
import { InsumosService } from '../../../servicios/insumos.service';

import Swal from 'sweetalert2';
import { ParametroModelo } from 'src/app/modelos/parametro.modelo';
import { ParametrosService } from 'src/app/servicios/parametros.service';

@Component({
  selector: 'app-insumo',
  templateUrl: './insumo.component.html',
  styleUrls: ['./insumo.component.css']
})
export class InsumoComponent implements OnInit {
  crear = false;
  insumoForm: FormGroup;
  alertGuardar:boolean=false;
  insumo: InsumoModelo = new InsumoModelo();
  listaTipoInsumo: ParametroModelo;

  constructor( private insumosService: InsumosService,
               private parametrosService: ParametrosService,
               private route: ActivatedRoute,
               private router: Router,
               private comunes: ComunesService,
               private fb: FormBuilder ) { 
    this.crearFormulario();
    this.obtenerParametros();
  }              

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if ( id !== 'nuevo' ) {
      
      this.insumosService.getInsumo( Number(id) )
        .subscribe( (resp: InsumoModelo) => {
          this.insumoForm.patchValue(resp);
        });
    }else{
      this.crear = true;
    }
  }  

  guardar( ) {

    if ( this.insumoForm.invalid ) {
      this.alertGuardar = true;
      return Object.values( this.insumoForm.controls ).forEach( control => {

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

    this.insumo = this.insumoForm.getRawValue();

    if ( this.insumo.insumoId ) {
      //Modificar
      this.insumo.usuarioModificacion = 'admin';
      peticion = this.insumosService.actualizarInsumo( this.insumo );
    } else {
      //Agregar
      this.insumo.usuarioCreacion = 'admin';
      peticion = this.insumosService.crearInsumo( this.insumo );
    }

    peticion.subscribe( resp => {

      Swal.fire({
                icon: 'success',
                title: this.insumo.codigo,
                text: resp.mensaje,
              }).then( resp => {

        if ( resp.value ) {
          if ( this.insumo.insumoId ) {
            this.router.navigate(['/insumos']);
          }else{
            this.limpiar();
          }
        }

      });
    }, e => {Swal.fire({
              icon: 'error',
              title: 'Algo salio mal',
              text: e.status +'. '+ this.comunes.obtenerError(e),
            })
       }
    );
  }

  obtenerParametros() { 
    var orderBy = "descripcionValor";
    var orderDir = "asc";
  
    var tipoParam = new ParametroModelo();
    tipoParam.codigoParametro = "TIPO_INSUMO";
    tipoParam.estado = "A";

    this.parametrosService.buscarParametrosFiltros( tipoParam, orderBy, orderDir )
      .subscribe( (resp: ParametroModelo) => {
        this.listaTipoInsumo = resp;
    });        
  }

  limpiar(){
    this.insumo = new InsumoModelo();
    this.insumoForm.reset();
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
    return this.insumoForm.get('codigo').invalid && this.insumoForm.get('codigo').touched
  }

  get tipoNoValido() {
    return this.insumoForm.get('tipo').invalid && this.insumoForm.get('tipo').touched
  }

  get descripcionNoValido() {
    return this.insumoForm.get('descripcion').invalid && this.insumoForm.get('descripcion').touched
  }

  crearFormulario() {

    this.insumoForm = this.fb.group({
      insumoId  : [null, [] ],
      codigo  : [null, [ Validators.required ]  ],
      descripcion  : [null, [ Validators.required]  ],
      tipo  : [null, [ Validators.required]  ],
      fechaVencimiento: [null, [] ],
      fechaCreacion: [null, [] ],
      fechaModificacion: [null, [] ],
      usuarioCreacion: [null, [] ],
      usuarioModificacion: [null, [] ],     
    });

    this.insumoForm.get('insumoId').disable();
    this.insumoForm.get('fechaCreacion').disable();
    this.insumoForm.get('fechaModificacion').disable();
    this.insumoForm.get('usuarioCreacion').disable();
    this.insumoForm.get('usuarioModificacion').disable();
  }
  cerrarAlertGuardar(){
    this.alertGuardar=false;
  }
}
