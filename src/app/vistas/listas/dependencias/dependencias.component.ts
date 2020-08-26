import { Component, OnInit } from '@angular/core';
import { DependenciasService } from '../../../servicios/dependencias.service';
import { DependenciaModelo } from '../../../modelos/dependencia.modelo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dependencias',
  templateUrl: './dependencias.component.html',
  styleUrls: ['./dependencias.component.css']
})
export class DependenciasComponent implements OnInit {

  dtOptions: DataTables.Settings = {};

  dependencias: DependenciaModelo[] = [];
  buscador: DependenciaModelo = new DependenciaModelo();
  buscadorForm: FormGroup;
  cargando = false;  

  constructor( private dependenciasService: DependenciasService,
               private fb: FormBuilder ) { 
    this.crearFormulario();
    this.crearTabla();    
  }

  ngOnInit() {    
    this.cargando = true;
    this.dependenciasService.buscarDependenciasFiltrosTabla(null)
      .subscribe( resp => {
        this.dependencias = resp;
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

  buscadorDependencias(event) {
    event.preventDefault();
    this.buscador = this.buscadorForm.getRawValue();
    this.dependenciasService.buscarDependenciasFiltrosTabla(this.buscador)
    .subscribe( resp => {
      this.dependencias = resp;
      this.cargando = false;
    }, e => {
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.obtenerError(e),
      })
    });
  }

  crearTabla(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      searching: false,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
      },
      processing: true,
      columns: [
        {data:'#'},
        {data:'areaId'}, {data:'codigo'}, {data:'descripcion'},
        {data:'estado'}, {data:'fechaCreacion'}, {data:'usuarioCreacion'},
        {data:'fechaModificacion'}, {data:'usuarioModificacion'},
        {data:'Editar'},
        {data:'Borrar'},
      ]
    };
  }

  limpiar() {
    this.buscadorForm.reset();
    this.buscador = new DependenciaModelo();
    this.dependencias = [];
  }

  borrarDependencia(event, dependencia: DependenciaModelo ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar ${ dependencia.codigo }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        let peticion: Observable<any>;
        peticion = this.dependenciasService.borrarDependencia( dependencia.dependenciaId );

        peticion.subscribe( resp => {
          Swal.fire({
                    icon: 'success',
                    title: dependencia.codigo,
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
      dependenciaId  : ['', [] ],
      codigo  : ['', [] ],
      descripcion  : ['', [] ],
      estado: [null, [] ]
    });
  }
}
