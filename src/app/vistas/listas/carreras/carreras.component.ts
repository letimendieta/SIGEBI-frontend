import { Component, OnInit } from '@angular/core';
import { CarrerasService } from '../../../servicios/carreras.service';
import { CarreraModelo } from '../../../modelos/carrera.modelo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carreras',
  templateUrl: './carreras.component.html',
  styleUrls: ['./carreras.component.css']
})
export class CarrerasComponent implements OnInit {

  dtOptions: DataTables.Settings = {};

  carreras: CarreraModelo[] = [];
  buscador: CarreraModelo = new CarreraModelo();
  buscadorForm: FormGroup;
  cargando = false;  

  constructor( private carrerasService: CarrerasService,
               private fb: FormBuilder ) {    
  }

  ngOnInit() {    
    this.crearFormulario();
    this.crearTabla();
  }

  crearTabla(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [[5,10,15,20,50,-1],[5,10,15,20,50,"Todos"]],
      searching: false,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
      },
      processing: true,
      columns: [
        {data:'#'},
        {data:'carreraId'}, {data:'codigo'}, {data:'descripcion'},
        {data:'estado'}, {data:'fechaCreacion'}, {data:'usuarioCreacion'},
        {data:'fechaModificacion'}, {data:'usuarioModificacion'},
        {data:'Editar'},
        {data:'Borrar'},
      ]
    };
    }

  buscadorCarreras(event) {
    event.preventDefault();
    this.cargando = true;
    this.buscador = this.buscadorForm.getRawValue();

    this.carrerasService.buscarCarrerasFiltrosTabla(this.buscador)
    .subscribe( resp => {
      this.carreras = resp;
      this.cargando = false;
    }, e => {
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.obtenerError(e)
      })
      this.cargando = false;
    });
  }

  limpiar(event) {
    event.preventDefault();
    this.buscadorForm.reset();
    this.buscador = new CarreraModelo();
    this.carreras = [];
  }

  borrarCarrera(event, carrera: CarreraModelo ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar ${ carrera.codigo }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        let peticion: Observable<any>;
        peticion = this.carrerasService.borrarCarrera( carrera.carreraId );

        peticion.subscribe( resp => {
          Swal.fire({
                    icon: 'success',
                    title: carrera.codigo,
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
      carreraId  : ['', [] ],
      codigo  : ['', [] ],
      descripcion  : ['', [] ],
      estado: [null, [] ]
    });
  }
}
