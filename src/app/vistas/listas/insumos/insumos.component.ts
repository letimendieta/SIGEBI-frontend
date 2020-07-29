import { Component, OnInit } from '@angular/core';
import { InsumosService } from '../../../servicios/insumos.service';
import { InsumoModelo } from '../../../modelos/insumo.modelo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-insumos',
  templateUrl: './insumos.component.html',
  styleUrls: ['./insumos.component.css']
})
export class InsumosComponent implements OnInit {

  insumos: InsumoModelo[] = [];
  buscador: InsumoModelo = new InsumoModelo();
  buscadorForm: FormGroup;
  cargando = false;  

  constructor( private insumosService: InsumosService,
               private fb: FormBuilder ) { 
    this.crearFormulario();
  }

  ngOnInit() {    
    this.cargando = true;
    this.insumosService.buscarInsumosFiltrosTabla(null)
      .subscribe( resp => {
        this.insumos = resp;
        this.cargando = false;
      }, e => {      
        Swal.fire({
          icon: 'info',
          title: 'Algo salio mal',
          text: e.status +'. '+ this.obtenerError(e),
        })
        this.cargando = false;
      });
  }

  buscadorInsumos() {
    this.buscador = this.buscadorForm.getRawValue();
    this.insumosService.buscarInsumosFiltrosTabla(this.buscador)
    .subscribe( resp => {
      this.insumos = resp;
      this.cargando = false;
    }, e => {
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.obtenerError(e),
      })
    });
  }

  limpiar() {
    this.buscadorForm.reset();
    this.buscador = new InsumoModelo();
    this.buscadorInsumos();
  }

  borrarInsumo( insumo: InsumoModelo ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar ${ insumo.codigo }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        let peticion: Observable<any>;
        peticion = this.insumosService.borrarInsumo( insumo.insumoId );

        peticion.subscribe( resp => {
          Swal.fire({
                    icon: 'success',
                    title: insumo.codigo,
                    text: resp.mensaje,
                  }).then( resp => {
            if ( resp.value ) {
              this.ngOnInit();
            }
          });
        }, e => {            
            Swal.fire({
              icon: 'info',
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
      insumoId  : [null, [] ],
      codigo  : [null, [] ],
      descripcion  : [null, [] ],
      fechaVencimiento: [null, [] ]
    });
  }
}
