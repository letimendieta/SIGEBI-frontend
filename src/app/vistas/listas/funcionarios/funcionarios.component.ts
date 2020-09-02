import { Component, OnInit } from '@angular/core';
import { FuncionariosService } from '../../../servicios/funcionarios.service';
import { FuncionarioModelo } from '../../../modelos/funcionario.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.css']
})
export class FuncionariosComponent implements OnInit {

  dtOptions: DataTables.Settings = {};

  funcionarios: FuncionarioModelo[] = [];
  persona: PersonaModelo = new PersonaModelo();
  buscador: FuncionarioModelo = new FuncionarioModelo();
  buscadorForm: FormGroup;
  cargando = false;


  constructor( private funcionariosService: FuncionariosService,
              private fb: FormBuilder ) { 
    this.crearFormulario();
    this.crearTabla();
  }

  ngOnInit() {

    this.cargando = true;
    this.funcionariosService.buscarFuncionariosFiltros(null)
      .subscribe( resp => {
        this.funcionarios = resp;
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
        {data:'funcionarioId'}, {data:'personas.cedula'}, {data:'personas.nombres'},
        {data:'personas.apellidos'}, {data:'areaId'}, {data:'estado'},
        {data:'personas.edad'}, {data:'personas.direccion'},
        {data:'personas.email'},{data:'personas.estadoCivil'},{data:'personas.fechaNacimiento'},
        {data:'personas.nacionalidad'},{data:'personas.sexo'},{data:'personas.telefono'},
        {data:'personas.celular'},
        {data:'Editar'},
        {data:'Borrar'},
      ]
    };
  }

  buscadorFuncionarios(event) {
    event.preventDefault();
    this.persona.cedula = this.buscadorForm.get('cedula').value;
    this.persona.nombres = this.buscadorForm.get('nombres').value;
    this.persona.apellidos = this.buscadorForm.get('apellidos').value;
    this.buscador.personas = this.persona;
    this.buscador.funcionarioId = this.buscadorForm.get('funcionarioId').value;    
    this.funcionariosService.buscarFuncionariosFiltros(this.buscador)
    .subscribe( resp => {
      this.funcionarios = resp;
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
    this.buscador = new FuncionarioModelo();
    this.persona = new PersonaModelo();
    this.funcionarios = [];
  }

  borrarFuncionario(event, funcionario: FuncionarioModelo ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ funcionario.personas.nombres }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        let peticion: Observable<any>;
        peticion = this.funcionariosService.borrarFuncionario( funcionario.funcionarioId );

        peticion.subscribe( resp => {
          Swal.fire({
                    icon: 'success',
                    title: funcionario.personas.nombres,
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
      funcionarioId  : ['', [] ],
      cedula  : ['', [] ],
      nombres  : ['', [] ],
      apellidos: ['', [] ],
      estado:  [null, [] ]
    });
  }
}
