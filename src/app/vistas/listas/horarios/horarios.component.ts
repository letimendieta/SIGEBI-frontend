import { Component, OnInit } from '@angular/core';
import { HorariosService } from '../../../servicios/horarios.service';
import { HorarioModelo } from '../../../modelos/horario.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import { FuncionarioModelo } from '../../../modelos/funcionario.modelo';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { GlobalConstants } from '../../../common/global-constants';
import { ComunesService } from 'src/app/servicios/comunes.service';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css']
})
export class HorariosComponent implements OnInit {

  dtOptions: any = {};

  horarios: HorarioModelo[] = [];
  buscador: HorarioModelo = new HorarioModelo();
  buscadorForm: FormGroup;
  cargando = false;  
  funcionario: FuncionarioModelo = new FuncionarioModelo();
  funcionarioPersona: PersonaModelo = new PersonaModelo();

  constructor( private horariosService: HorariosService,
               private comunes: ComunesService,
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
        {data:'horarioDisponibleId'}, {data:'fecha'}, {data:'horaInicio'},
        {data:'horaFin'}, {data:'funcionarios.funcionarioId'}, 
        {data:'funcionarios.personas.cedula'},
        {data:'funcionarios.personas.nombres'}, 
        {data:'funcionarios.personas.apellidos'},
        {data:'estado'},{data:'fechaCreacion'},
        {data:'usuarioCreacion'},{data:'fechaModificacion'},
        {data:'usuarioModificacion'},
        {data:'Editar'},
        {data:'Borrar'},
      ],
      dom: 'lBfrtip',
      buttons: [
        {
          extend:    'copy',
          text:      '<i class="far fa-copy"></i>',
          titleAttr: 'Copiar',
          className: 'btn btn-light',
          title:     'Listado de horarios',
          messageTop: 'Usuario:  <br>Fecha: '+ new Date().toLocaleString(),
          exportOptions: {
            columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ]
          },
        },
        {
          extend:    'csv',
          title:     'Listado de horarios',
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
          title:     'Listado de horarios',
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
          title:     'Listado de horarios',
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

  buscadorHorarios(event) {
    event.preventDefault();
    this.cargando = true;
    this.horarios = [];
    this.funcionario = new FuncionarioModelo();
    this.funcionarioPersona = new PersonaModelo();

    this.buscador = this.buscadorForm.getRawValue();

    this.funcionarioPersona.cedula = this.buscadorForm.get('funcionarios').get('cedula').value;
    this.funcionarioPersona.nombres = this.buscadorForm.get('funcionarios').get('nombres').value;
    this.funcionarioPersona.apellidos = this.buscadorForm.get('funcionarios').get('apellidos').value;

    if(!this.funcionarioPersona.cedula && !this.funcionarioPersona.nombres && !this.funcionarioPersona.apellidos){
      this.funcionario.personas = null;
    }else{
      this.funcionario.personas = this.funcionarioPersona;
    }
    this.funcionario.funcionarioId = this.buscadorForm.get('funcionarios').get('funcionarioId').value;
    if(this.funcionario.personas == null && !this.funcionario.funcionarioId){
      this.funcionario = null;
    }
    this.buscador.funcionarios = this.funcionario;
    
    this.horariosService.buscarHorariosFiltrosTabla(this.buscador)
    .subscribe( resp => {      
      this.horarios = resp;
      this.cargando = false;
    }, e => {
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e),
      })
    });
  }

  limpiar(event) {
    event.preventDefault();
    this.buscadorForm.reset();
    this.buscador = new HorarioModelo();
    this.horarios = [];
  }

  borrarHorario(event, horario: HorarioModelo ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar ${ horario.horarioDisponibleId }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        let peticion: Observable<any>;
        peticion = this.horariosService.borrarHorario( horario.horarioDisponibleId );

        peticion.subscribe( resp => {
          Swal.fire({
                    icon: 'success',
                    title: horario.horarioDisponibleId.toString(),
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
      horarioDisponibleId  : ['', [] ],
      fecha  : [null, [] ],
      estado: [null, [] ],
      funcionarios : this.fb.group({
        funcionarioId  : ['', [] ],
        cedula  : ['', [] ],
        nombres  : ['', [] ],
        apellidos  : ['', [] ]        
      })        
    });
  }
}
