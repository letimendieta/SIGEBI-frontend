import { Component, OnInit } from '@angular/core';
import { ProcedimientosService } from '../../../servicios/procedimientos.service';
import { ProcedimientoModelo } from '../../../modelos/procedimiento.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import { PacienteModelo } from '../../../modelos/paciente.modelo';
import { FuncionarioModelo } from '../../../modelos/funcionario.modelo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { GlobalConstants } from '../../../common/global-constants';
import { ComunesService } from 'src/app/servicios/comunes.service';

@Component({
  selector: 'app-procedimientos',
  templateUrl: './procedimientos.component.html',
  styleUrls: ['./procedimientos.component.css']
})
export class ProcedimientosComponent implements OnInit {

  dtOptions: any = {};

  procedimientos: ProcedimientoModelo[] = [];
  paciente : PacienteModelo = new PacienteModelo();
  pacientePersona: PersonaModelo = new PersonaModelo();

  funcionario: FuncionarioModelo = new FuncionarioModelo();
  funcionarioPersona: PersonaModelo = new PersonaModelo();

  buscadorForm: FormGroup;
  buscador: ProcedimientoModelo = new ProcedimientoModelo();
  cargando = false;


  constructor( private procedimientosService: ProcedimientosService,
              private comunes: ComunesService,
              private fb: FormBuilder) {    
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
        "lengthMenu": "Mostrar _MENU_ registros",
        "zeroRecords": "No se encontraron resultados",
        "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "infoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sSearch": "Buscar:",
        "oPaginate": {
          "sFirst": "Primero",
          "sLast":"Último",
          "sNext":"Siguiente",
          "sPrevious": "Anterior"
        },
        "sProcessing":"Procesando...",
      },
      processing: true,
      columns: [
        {data:'#'},
        {data:'procedimientoId'}, {data:'pacientes.pacienteId'}, 
        {data:'pacientes.personas.cedula'},
        {data:'pacientes.personas.nombres'}, {data:'pacientes.personas.apellidos'}, 
        {data:'funcionarios.funcionarioId'},
        {data:'funcionarios.personas.cedula'}, {data:'funcionarios.personas.nombres'},
        {data:'funcionarios.personas.apellidos'},{data:'insumoId'},{data:'fecha'},
        {data:'Editar'},
        {data:'Borrar'}
      ],
      dom: 'lBfrtip',
      buttons: [
        {
          extend:    'copy',
          text:      '<i class="far fa-copy"></i>',
          titleAttr: 'Copiar',
          className: 'btn btn-light',
          title:     'Listado de procedimientos',
          messageTop: 'Usuario:  <br>Fecha: '+ new Date().toLocaleString(),
          exportOptions: {
            columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ]
          },
        },
        {
          extend:    'csv',
          title:     'Listado de procedimientos',
          text:      '<i class="fas fa-file-csv"></i>',
          titleAttr: 'Exportar a CSV',
          className: 'btn btn-secondary',
          messageTop: 'Usuario:  <br>Fecha: '+ new Date().toLocaleString(),
          exportOptions: {
            columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ]
          },
        },
        {
          extend:    'excelHtml5',
          title:     'Listado de procedimientos',
          text:      '<i class="fas fa-file-excel"></i> ',
          titleAttr: 'Exportar a Excel',
          className: 'btn btn-success',
          autoFilter: true,
          messageTop: 'Usuario:  <br>Fecha: '+ new Date().toLocaleString(),
          exportOptions: {
            columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ]
          }
        },          
        {
          extend:    'print',
          title:     'Listado de procedimientos',
          text:      '<i class="fa fa-print"></i> ',
          titleAttr: 'Imprimir',
          className: 'btn btn-info',
          messageTop: 'Usuario:  <br>Fecha: '+ new Date().toLocaleString(),
          exportOptions: {
            columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ]
          },
          customize: function ( win ) {
            $(win.document.body)
                .css( 'font-size', '10pt' )
                .prepend(
                    '<img src= ' + GlobalConstants.imagenReporteListas + ' style="position:absolute; top:400; left:400;" />'
                );

            $(win.document.body).find( 'table' )
                .addClass( 'compact' )
                .css( 'font-size', 'inherit' );
          }              
        }
      ]
    };
  }

  buscadorProcedimientos(event) {   
    event.preventDefault();
    this.cargando = true;
    this.procedimientos = [];
    this.paciente = new PacienteModelo();
    this.funcionario = new FuncionarioModelo();
    this.pacientePersona = new PersonaModelo();
    this.funcionarioPersona = new PersonaModelo();

    this.pacientePersona.cedula = this.buscadorForm.get('pacientes').get('pacienteCedula').value;
    this.pacientePersona.nombres = this.buscadorForm.get('pacientes').get('pacienteNombres').value;
    this.pacientePersona.apellidos = this.buscadorForm.get('pacientes').get('pacienteApellidos').value;
    if(!this.pacientePersona.cedula && !this.pacientePersona.nombres && !this.pacientePersona.apellidos){
      this.paciente.personas = null;
    }else{
      this.paciente.personas = this.pacientePersona;
    }
    this.paciente.pacienteId = this.buscadorForm.get('pacientes').get('pacienteId').value; 
    if(this.paciente.personas == null && !this.paciente.pacienteId){
      this.paciente = null;
    }      
    
    this.funcionarioPersona.cedula = this.buscadorForm.get('funcionarios').get('funcionarioCedula').value;
    this.funcionarioPersona.nombres = this.buscadorForm.get('funcionarios').get('funcionarioNombres').value;
    this.funcionarioPersona.apellidos = this.buscadorForm.get('funcionarios').get('funcionarioApellidos').value;

    if(!this.funcionarioPersona.cedula && !this.funcionarioPersona.nombres && !this.funcionarioPersona.apellidos){
      this.funcionario.personas = null;
    }else{
      this.funcionario.personas = this.funcionarioPersona;
    }

    this.funcionario.funcionarioId = this.buscadorForm.get('funcionarios').get('funcionarioId').value;
    if(this.funcionario.personas == null && !this.funcionario.funcionarioId){
      this.funcionario = null;
    } 

    this.buscador.pacientes = this.paciente;
    this.buscador.funcionarios = this.funcionario;

    this.buscador.procedimientoId = this.buscadorForm.get('procedimientoId').value;
    this.buscador.fecha =  this.buscadorForm.get('fecha').value;
    this.procedimientosService.buscarProcedimientosFiltros(this.buscador)
    .subscribe( resp => {      
      this.procedimientos = resp;
      this.cargando = false;
    }, e => {      
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
      this.cargando = false;
    });
  }

  limpiar(event) {
    event.preventDefault();
    this.buscadorForm.reset();
    this.buscador = new ProcedimientoModelo();  
    this.procedimientos = [];
  }

  borrarProcedimiento(event, procedimiento: ProcedimientoModelo ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea procedimiento id ${ procedimiento.procedimientoId }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        let peticion: Observable<any>;
        peticion = this.procedimientosService.borrarProcedimiento( procedimiento.procedimientoId );

        peticion.subscribe( resp => {
          Swal.fire({
                    icon: 'success',
                    title: procedimiento.procedimientoId.toString(),
                    text: resp.mensaje,
                  }).then( resp => {
            if ( resp.value ) {
              this.ngOnInit();
            }
          });
        }, e => {            
            Swal.fire({
              icon: 'error',
              title: 'Algo salio mal',
              text: e.status +'. '+ this.comunes.obtenerError(e),
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
      procedimientoId  : ['', [] ],
      fecha : [null, [] ],
      pacientes : this.fb.group({
        pacienteId  : ['', [] ],
        pacienteCedula  : ['', [] ],
        pacienteNombres  : ['', [] ],
        pacienteApellidos  : ['', [] ]        
      }),
      funcionarios : this.fb.group({
        funcionarioId  : ['', [] ],
        funcionarioCedula  : ['', [] ],
        funcionarioNombres  : ['', [] ],
        funcionarioApellidos  : ['', [] ]        
      })      
    });
  }
}
