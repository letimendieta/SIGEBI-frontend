import { Component, OnInit } from '@angular/core';
import { ParametrosService } from '../../../servicios/parametros.service';
import { ParametroModelo } from '../../../modelos/parametro.modelo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css']
})
export class ParametrosComponent implements OnInit {

  dtOptions: DataTables.Settings = {};

  parametros: ParametroModelo[] = [];
  buscador: ParametroModelo = new ParametroModelo();
  buscadorForm: FormGroup;
  cargando = false;  

  constructor( private parametrosService: ParametrosService,
    private fb: FormBuilder ) {     
  }

  ngOnInit() {    
    this.crearFormulario();
    this.crearTabla();
  }

  buscadorParametros(event) {
    event.preventDefault();
    this.buscador = this.buscadorForm.getRawValue();
    this.parametrosService.buscarParametrosFiltrosTabla(this.buscador)
    .subscribe( resp => {
      this.parametros = resp;
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
      pageLength: 5,
      lengthMenu: [[5,10,15,20,50,-1],[5,10,15,20,50,"Todos"]],
      searching: false,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
      },
      processing: true,
      columns: [
        {data:'#'},
        {data:'parametroId'}, {data:'codigoParametro'}, {data:'descripcion'},
        {data:'nombre'}, {data:'valor'}, {data:'descripcionValor'},
        {data:'estado'},
        {data:'Editar'},
        {data:'Borrar'},
      ]
    };
  }

  limpiar(event) {
    event.preventDefault();
    this.buscadorForm.reset();
    this.buscador = new ParametroModelo();
    this.parametros = [];
  }

  borrarParametro(event, parametro: ParametroModelo ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ parametro.codigoParametro }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        let peticion: Observable<any>;
        peticion = this.parametrosService.borrarParametro( parametro.parametroId );

        peticion.subscribe( resp => {
          Swal.fire({
                    icon: 'success',
                    title: parametro.codigoParametro,
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
      parametroId  : ['', [] ],
      codigoParametro  : ['', [] ],
      descripcion  : ['', [] ],
      valor: ['', [] ],
      descripcionValor: ['', [] ],
      estado:  [null, [] ]
    });
  }
}
