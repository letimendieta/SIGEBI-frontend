import { Component, OnInit } from '@angular/core';
import { HistorialesClinicosService } from '../../../servicios/historialesClinicos.service';
import { HistorialClinicoModelo } from '../../../modelos/historialClinico.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import { PacienteModelo } from '../../../modelos/paciente.modelo';
import { AreaModelo } from '../../../modelos/area.modelo';
import { AreasService } from '../../../servicios/areas.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { GlobalConstants } from '../../../common/global-constants';
import { ComunesService } from 'src/app/servicios/comunes.service';

@Component({
  selector: 'app-historialesClinicos',
  templateUrl: './historialesClinicos.component.html',
  styleUrls: ['./historialesClinicos.component.css']
})
export class HistorialesClinicosComponent implements OnInit {

  dtOptions: any = {};

  historialClinicos: HistorialClinicoModelo[] = [];
  paciente : PacienteModelo = new PacienteModelo();
  pacientePersona: PersonaModelo = new PersonaModelo();
  listaAreas: AreaModelo;

  buscadorForm: FormGroup;
  buscador: HistorialClinicoModelo = new HistorialClinicoModelo();
  cargando = false;


  constructor( private historialClinicosService: HistorialesClinicosService,
               private comunes: ComunesService,
               private areasService: AreasService,
               private fb: FormBuilder) {    
  }

  ngOnInit() {

    this.crearFormulario();
    this.crearTabla();
    this.listarAreas();
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
        {data:'historialClinicoId'}, {data:'pacientes.pacienteId'}, 
        {data:'pacientes.personas.cedula'},
        {data:'pacientes.personas.nombres'}, 
        {data:'pacientes.personas.apellido'}, {data:'areaId'},
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
          title:     'Listado de historiales clinicos',
          messageTop: 'Usuario:  <br>Fecha: '+ new Date().toLocaleString(),
          exportOptions: {
            columns: [ 0, 1, 2, 3, 4, 5, 6, 7]
          },
        },
        {
          extend:    'csv',
          title:     'Listado de historiales clinicos',
          text:      '<i class="fas fa-file-csv"></i>',
          titleAttr: 'Exportar a CSV',
          className: 'btn btn-secondary',
          messageTop: 'Usuario:  <br>Fecha: '+ new Date().toLocaleString(),
          exportOptions: {
            columns: [ 0, 1, 2, 3, 4, 5, 6, 7]
          },
        },
        {
          extend:    'excelHtml5',
          title:     'Listado de historiales clinicos',
          text:      '<i class="fas fa-file-excel"></i> ',
          titleAttr: 'Exportar a Excel',
          className: 'btn btn-success',
          autoFilter: true,
          messageTop: 'Usuario:  <br>Fecha: '+ new Date().toLocaleString(),
          exportOptions: {
            columns: [ 0, 1, 2, 3, 4, 5, 6, 7]
          }
        },          
        {
          extend:    'print',
          title:     'Listado de historiales clinicos',
          text:      '<i class="fa fa-print"></i> ',
          titleAttr: 'Imprimir',
          className: 'btn btn-info',
          messageTop: 'Usuario:  <br>Fecha: '+ new Date().toLocaleString(),
          exportOptions: {
            columns: [ 0, 1, 2, 3, 4, 5, 6, 7]
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

  listarAreas() {
    var orderBy = "descripcion";
    var orderDir = "asc";
    var area = new AreaModelo();
    area.estado = "A";

    this.areasService.buscarAreasFiltros(area, orderBy, orderDir )
      .subscribe( (resp: AreaModelo) => {
        this.listaAreas = resp;
    });
  }

  buscadorHistorialClinicos(event) {   
    event.preventDefault();
    this.cargando = true;
    this.historialClinicos = [];
    this.paciente = new PacienteModelo();
    this.pacientePersona = new PersonaModelo();

    this.buscador = this.buscadorForm.getRawValue();

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
 
    this.buscador.pacientes = this.paciente;

    this.historialClinicosService.buscarHistorialClinicosFiltros(this.buscador)
    .subscribe( resp => {      
      this.historialClinicos = resp;
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
    this.buscadorForm.reset();
    this.buscador = new HistorialClinicoModelo();    
    this.historialClinicos = [];
  }

  borrarHistorialClinico(event, historialClinico: HistorialClinicoModelo ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea historialClinico id ${ historialClinico.historialClinicoId }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        let peticion: Observable<any>;
        peticion = this.historialClinicosService.borrarHistorialClinico( historialClinico.historialClinicoId );

        peticion.subscribe( resp => {
          Swal.fire({
                    icon: 'success',
                    title: historialClinico.historialClinicoId.toString(),
                    text: resp.mensaje,
                  }).then( resp => {
            if ( resp.value ) {
              this.buscadorHistorialClinicos(event);
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
      historialClinicoId  : ['', [] ],
      areaId  : [null, [] ],
      pacientes : this.fb.group({
        pacienteId  : ['', [] ],
        pacienteCedula  : ['', [] ],
        pacienteNombres  : ['', [] ],
        pacienteApellidos  : ['', [] ]        
      })   
    });
  }
}
