import { Component, OnInit } from '@angular/core';
import { DepartamentosService } from '../../../servicios/departamentos.service';
import { DepartamentoModelo } from '../../../modelos/departamento.modelo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.css']
})
export class DepartamentosComponent implements OnInit {

  dtOptions: DataTables.Settings = {};

  departamentos: DepartamentoModelo[] = [];
  buscador: DepartamentoModelo = new DepartamentoModelo();
  buscadorForm: FormGroup;
  cargando = false;  

  constructor( private departamentosService: DepartamentosService,
               private fb: FormBuilder ) { 
    this.crearFormulario();
    this.crearTabla(); 
  }

  ngOnInit() {    
    this.cargando = true;
    this.departamentosService.buscarDepartamentosFiltrosTabla(null)
      .subscribe( resp => {
        this.departamentos = resp;
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

  buscadorDepartamentos(event) {
    this.buscador = this.buscadorForm.getRawValue();
    this.departamentosService.buscarDepartamentosFiltrosTabla(this.buscador)
    .subscribe( resp => {
      this.departamentos = resp;
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
        {data:'departamentoId'}, {data:'codigo'}, {data:'descripcion'},
        {data:'estado'}, {data:'fechaCreacion'}, {data:'usuarioCreacion'},
        {data:'fechaModificacion'}, {data:'usuarioModificacion'},
        {data:'Editar'},
        {data:'Borrar'},
      ]
    };
  }

  limpiar() {
    this.buscadorForm.reset();
    this.buscador = new DepartamentoModelo();
    this.departamentos = [];
  }

  borrarDepartamento(event, departamento: DepartamentoModelo ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar ${ departamento.codigo }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        let peticion: Observable<any>;
        peticion = this.departamentosService.borrarDepartamento( departamento.departamentoId );

        peticion.subscribe( resp => {
          Swal.fire({
                    icon: 'success',
                    title: departamento.codigo,
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
      departamentoId  : ['', [] ],
      codigo  : ['', [] ],
      descripcion  : ['', [] ],
      estado: [null, [] ]
    });
  }
}
