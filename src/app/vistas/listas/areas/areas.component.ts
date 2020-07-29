import { Component, OnInit } from '@angular/core';
import { AreasService } from '../../../servicios/areas.service';
import { AreaModelo } from '../../../modelos/area.modelo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.css']
})
export class AreasComponent implements OnInit {

  areas: AreaModelo[] = [];
  buscador: AreaModelo = new AreaModelo();
  buscadorForm: FormGroup;
  cargando = false;  

  constructor( private areasService: AreasService,
               private fb: FormBuilder ) { 
    this.crearFormulario();
  }

  ngOnInit() {    
    this.cargando = true;
    this.areasService.buscarAreasFiltrosTabla(null)
      .subscribe( resp => {
        this.areas = resp;
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

  buscadorAreas() {
    this.buscador = this.buscadorForm.getRawValue();
    this.areasService.buscarAreasFiltrosTabla(this.buscador)
    .subscribe( resp => {
      this.areas = resp;
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
    this.buscador = new AreaModelo();
    this.buscadorAreas();
  }

  borrarArea( area: AreaModelo ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar ${ area.codigo }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        let peticion: Observable<any>;
        peticion = this.areasService.borrarArea( area.areaId );

        peticion.subscribe( resp => {
          Swal.fire({
                    icon: 'success',
                    title: area.codigo,
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
      areaId  : ['', [] ],
      codigo  : ['', [] ],
      descripcion  : ['', [] ],
      estado: [null, [] ]
    });
  }
}
