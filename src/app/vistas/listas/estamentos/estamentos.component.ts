import { Component, OnInit } from '@angular/core';
import { EstamentosService } from '../../../servicios/estamentos.service';
import { EstamentoModelo } from '../../../modelos/estamento.modelo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-estamentos',
  templateUrl: './estamentos.component.html',
  styleUrls: ['./estamentos.component.css']
})
export class EstamentosComponent implements OnInit {

  dtOptions: DataTables.Settings = {};

  estamentos: EstamentoModelo[] = [];
  buscador: EstamentoModelo = new EstamentoModelo();
  buscadorForm: FormGroup;
  cargando = false;  

  constructor( private estamentosService: EstamentosService,
               private fb: FormBuilder ) { 
    this.crearFormulario();
    this.crearTabla();    
  }

  ngOnInit() {    
    this.cargando = true;
    this.estamentosService.buscarEstamentosFiltrosTabla(null)
      .subscribe( resp => {
        this.estamentos = resp;
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

  buscadorEstamentos(event) {
    event.preventDefault();
    this.buscador = this.buscadorForm.getRawValue();
    this.estamentosService.buscarEstamentosFiltrosTabla(this.buscador)
    .subscribe( resp => {
      this.estamentos = resp;
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
    this.buscador = new EstamentoModelo();
    this.estamentos = [];
  }

  borrarEstamento(event, estamento: EstamentoModelo ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar ${ estamento.codigo }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        let peticion: Observable<any>;
        peticion = this.estamentosService.borrarEstamento( estamento.estamentoId );

        peticion.subscribe( resp => {
          Swal.fire({
                    icon: 'success',
                    title: estamento.codigo,
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
      estamentoId  : ['', [] ],
      codigo  : ['', [] ],
      descripcion  : ['', [] ],
      estado: [null, [] ]
    });
  }
}
