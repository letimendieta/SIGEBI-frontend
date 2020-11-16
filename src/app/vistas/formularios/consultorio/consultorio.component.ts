import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ParametroModelo } from '../../../modelos/parametro.modelo';
import { ParametrosService } from '../../../servicios/parametros.service';
import { ComunesService } from 'src/app/servicios/comunes.service';
import { PacienteModelo } from '../../../modelos/paciente.modelo';
import { PatologiaProcedimientoModelo } from '../../../modelos/patologiaProcedimiento.modelo';
import { PacientesService } from '../../../servicios/pacientes.service';
import { AntecedentesService } from '../../../servicios/antecedentes.service';
import { AlergiasService } from '../../../servicios/alergias.service';
import { HistorialesClinicosService } from '../../../servicios/historialesClinicos.service';
import { InsumosService } from '../../../servicios/insumos.service';
import { StocksService } from '../../../servicios/stocks.service';
import { TerminoEstandarService } from '../../../servicios/terminoEstandar.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonaModelo } from 'src/app/modelos/persona.modelo';
import { AntecedenteModelo } from 'src/app/modelos/antecedente.modelo';
import { AlergiaModelo } from 'src/app/modelos/alergia.modelo';
import { HistorialClinicoModelo } from 'src/app/modelos/historialClinico.modelo';
import { InsumoModelo } from 'src/app/modelos/insumo.modelo';
import { TerminoEstandarModelo } from 'src/app/modelos/terminoEstandar.modelo';
import { StockModelo } from 'src/app/modelos/stock.modelo';
import { AnamnesisModelo } from 'src/app/modelos/anamnesis.modelo';
import { AnamnesisService } from 'src/app/servicios/anamnesis.service';
import { Observable } from 'rxjs';
import { DiagnosticoModelo } from 'src/app/modelos/diagnostico.modelo';
import { TratamientoModelo } from 'src/app/modelos/tratamiento.modelo';
import { ProcesoDiagnosticoTratamientoModelo } from 'src/app/modelos/procesoDiagnosticoTratamiento.modelo';
import { ProcesoDiagnosticoTratamientosService } from 'src/app/servicios/procesoDiagnosticoTratamiento.service';
import { TratamientoInsumoModelo } from 'src/app/modelos/tratamientoInsumo.modelo';
import { ConsultaModelo } from 'src/app/modelos/consulta.modelo';

@Component({
  selector: 'app-consultorio',
  templateUrl: './consultorio.component.html',
  styleUrls: ['./consultorio.component.css']
})
export class ConsultorioComponent implements OnInit {
  
  crear = false;
  personaForm: FormGroup;
  pacienteForm: FormGroup;
  buscadorForm: FormGroup;
  historialClinicoForm: FormGroup;
  buscadorModalForm: FormGroup;
  stockForm: FormGroup;
  buscadorStockForm: FormGroup;
  buscadorTerminoEstandarForm: FormGroup;
  anamnesisForm: FormGroup;
  diagnosticoPrimarioForm: FormGroup;
  diagnosticoSecundarioForm: FormGroup;
  tratamientoFarmacologicoForm: FormGroup;
  tratamientoNoFarmacologicoForm: FormGroup;
  pacientes: PacienteModelo[] = [];
  patologiasProcedimientos: PatologiaProcedimientoModelo[] = [];
  antecedentes: AntecedenteModelo[] = [];
  antecedentesFamiliares: AntecedenteModelo[] = [];
  alergias: AlergiaModelo[] = [];
  paciente: PacienteModelo = new PacienteModelo();
  listaEstadoCivil: ParametroModelo[];
  listaSexo: ParametroModelo[];
  listaNacionalidad: ParametroModelo[];
  stocks: StockModelo[] = [];
  terminosEstandar: TerminoEstandarModelo[] = [];
  terminoEstandarPrincipalSeleccionado: TerminoEstandarModelo = new TerminoEstandarModelo();
  terminoEstandarSecundarioSeleccionado: TerminoEstandarModelo = new TerminoEstandarModelo();
  //medicamentos: InsumoModelo[] = new Array();
  tratamientosInsumos: TratamientoInsumoModelo[]  = new Array();
  cargando = false;
  alert:boolean=false;
  tipoDiagnostico: String = null;
  dtOptionsBuscadorStock: any = {};
  dtOptionsBuscador: any = {};
  dtOptionsPatologias: any = {};  
  dtOptionsAntecedentes: any = {};
  dtOptionsAntecedentesFamiliares: any = {};
  dtOptionsAlergias: any = {};
  dtOptionsStock: any = {};
  dtOptionsTerminoEstandar: any = {};
  dtOptionsMedicamentos: any = {};

  constructor( private historialClinicosService: HistorialesClinicosService,
               private parametrosService: ParametrosService,
               private comunes: ComunesService,
               private pacientesService: PacientesService,
               private antecedentesService: AntecedentesService,
               private alergiaService: AlergiasService,
               private modalService: NgbModal,
               private insumosService: InsumosService,
               private stockService: StocksService,
               private terminoEstandarService: TerminoEstandarService,
               private anamnesisService: AnamnesisService,
               private procesoDiagnosticoTratamientoService: ProcesoDiagnosticoTratamientosService,
               private fb: FormBuilder,
               private fb2: FormBuilder,
               private fb3: FormBuilder,
               private fb4: FormBuilder,
               private fb5: FormBuilder,
               private fb6: FormBuilder,
               private fb7: FormBuilder,
               private fb8: FormBuilder,
               private fb9: FormBuilder,
               private fb10: FormBuilder,
               private fb11: FormBuilder,
               private fb12: FormBuilder) { 
    this.crearFormulario();
  }              

  ngOnInit() {
    this.obtenerParametros();
    this.crearTablaPatologias();
    this.crearTablaAntecedentes();
    this.crearTablaAlergias();
    this.crearTablaAntecedentesFamiliares();
    this.crearTablaMedicamentos();
    this.crearTablaModel();
    this.crearTablaModelStock();
    this.crearTablaModelTerminoEstandar();
  }  


  obtenerParametros() {
    var estadoCivilParam = new ParametroModelo();
    estadoCivilParam.codigoParametro = "EST_CIVIL";
    estadoCivilParam.estado = "A";
    var orderBy = "descripcionValor";
    var orderDir = "asc";

    this.parametrosService.buscarParametrosFiltros( estadoCivilParam, orderBy, orderDir )
      .subscribe( (resp: ParametroModelo[]) => {
        this.listaEstadoCivil = resp;
    });

    var sexoParam = new ParametroModelo();
    sexoParam.codigoParametro = "SEXO";
    sexoParam.estado = "A";

    this.parametrosService.buscarParametrosFiltros( sexoParam, orderBy, orderDir )
      .subscribe( (resp: ParametroModelo[]) => {
        this.listaSexo = resp;
    });

    var nacionalidadParam = new ParametroModelo();
    nacionalidadParam.codigoParametro = "NACIONALIDAD";
    nacionalidadParam.estado = "A";

    this.parametrosService.buscarParametrosFiltros( nacionalidadParam, orderBy, orderDir )
      .subscribe( (resp: ParametroModelo[]) => {
        this.listaNacionalidad = resp;
    });
    
  }

  buscarPaciente(event) {
    event.preventDefault();    
    var paciente = new PacienteModelo();
    var persona = new PersonaModelo();
    persona.cedula = this.buscadorForm.get('cedulaBusqueda').value;
    if( persona.cedula ) paciente.personas = persona;
    
    paciente.pacienteId = this.buscadorForm.get('pacienteIdBusqueda').value;
    this.limpiar(event);
    this.pacientesService.buscarPacientesFiltros(paciente)
    .subscribe( resp => {   
      if(resp.length <= 0){
        Swal.fire({
          icon: 'info',
          title: 'No se encontro paciente',
          text: 'No se encontro paciente'
        })
      }else{

        for (let i = 0; i < this.listaSexo.length; i++) {
          if( this.listaSexo[i].valor == resp[0].personas.sexo ){
            resp[0].personas.sexo = this.listaSexo[i].descripcionValor;
            break;
          }
        }
        for (let i = 0; i < this.listaEstadoCivil.length; i++) {
          if( this.listaEstadoCivil[i].valor == resp[0].personas.estadoCivil ){
            resp[0].personas.estadoCivil = this.listaEstadoCivil[i].descripcionValor;
            break;
          }
        }
        for (let i = 0; i < this.listaNacionalidad.length; i++) {
          if( this.listaNacionalidad[i].valor == resp[0].personas.nacionalidad ){
            resp[0].personas.nacionalidad = this.listaNacionalidad[i].descripcionValor;
            break;
          }
        }

        this.pacienteForm.patchValue(resp[0]);
        this.buscadorForm.get('pacienteIdBusqueda').setValue(resp[0].pacienteId);
        this.buscadorForm.get('cedulaBusqueda').setValue(resp[0].personas.cedula);
        this.obtenerHistorialClinico();
        this.obtenerAntecedentes();
        this.obtenerAntecedentesFamiliares();
        this.obtenerAlergias();       

      }
    }, e => {
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
      //this.cargando = false;
    });



    /*this.pacientesService.buscarPacientesFiltros( Number(id) )
        .subscribe( (resp: PacienteModelo) => {  
          this.pacienteForm.patchValue(resp);
          var cedula = this.pacienteForm.get('personas').get('cedula').value;
          this.fileInfos = this.uploadService.getFilesName(cedula + '_', "I");
        });*/
  }

  obtenerHistorialClinico() {   
    var buscador = new HistorialClinicoModelo();

    buscador.historialClinicoId = this.pacienteForm.get('historialClinico').get('historialClinicoId').value;
    this.historialClinicosService.buscarHistorialClinicosFiltros(buscador)
    .subscribe( resp => {
      
      this.historialClinicoForm.patchValue(resp[0]);
      if ( resp[0].historialClinicoId != null )
        this.obtenerAnamnesis(resp[0].historialClinicoId);      
      
    }, e => {      
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
      this.cargando = false;
    });
  }

  obtenerPatologiasProcedimientosActual() {   
    var patologiaProcedimiento = new PatologiaProcedimientoModelo();

    /*patologiaProcedimiento. = this.buscadorForm.get('cedulaBusqueda').value;
    if(!pacientePersona.cedula){
      paciente.personas = null;
    }else{
      paciente.personas = pacientePersona;
    }
    paciente.pacienteId = this.buscadorForm.get('pacienteIdBusqueda').value;
    if(paciente.personas == null && !paciente.pacienteId){
      paciente = null;
    }      
 
    buscador.pacientes = this.paciente;

    this.historialClinicosService.buscarHistorialClinicosFiltros(buscador)
    .subscribe( resp => {     

      if(resp.length <= 0){
        Swal.fire({
          icon: 'info',
          title: 'No se encontro paciente',
          text: 'No se encontro paciente'
        })
      }else{
        this.historialClinicoForm.patchValue(resp[0]);
        //this.buscadorForm.get('pacienteIdBusqueda').setValue(resp[0].pacienteId);
        //this.buscadorForm.get('cedulaBusqueda').setValue(resp[0].personas.cedula);
      }
    }, e => {      
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
      this.cargando = false;
    });*/
  }

  obtenerAntecedentes() {
    var antecedente = new AntecedenteModelo();

    antecedente.historialClinicoId = this.pacienteForm.get('historialClinico').get('historialClinicoId').value;
    antecedente.tipo = "P";
    this.antecedentesService.buscarAntecedentesFiltros(antecedente)
    .subscribe( resp => {     

      if(resp.length <= 0){
        Swal.fire({
          icon: 'info',
          title: 'No se encontro antecedentes',
          text: 'No se encontro antecedentes'
        })
      }else{
        this.antecedentes = resp;
        //this.buscadorForm.get('pacienteIdBusqueda').setValue(resp[0].pacienteId);
        //this.buscadorForm.get('cedulaBusqueda').setValue(resp[0].personas.cedula);
      }
    }, e => {      
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
    });
  }

  obtenerAntecedentesFamiliares() {
    var antecedente = new AntecedenteModelo();

    antecedente.historialClinicoId = this.pacienteForm.get('historialClinico').get('historialClinicoId').value;
    antecedente.tipo = "F";
    this.antecedentesService.buscarAntecedentesFiltros(antecedente)
    .subscribe( resp => {

      this.antecedentesFamiliares = resp;

    }, e => {      
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
    });
  }

  obtenerAlergias() {
    var alergias = new AlergiaModelo();

    alergias.historialClinicoId = this.pacienteForm.get('historialClinico').get('historialClinicoId').value;

    this.alergiaService.buscarAlergiasFiltros(alergias)
    .subscribe( resp => {     

      if(resp.length <= 0){
        Swal.fire({
          icon: 'info',
          title: 'No se encontro alergias',
          text: 'No se encontro alergias'
        })
      }else{
        this.alergias = resp;
      }
    }, e => {      
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
      this.cargando = false;
    });
  }

  obtenerAnamnesis(historialClinicoId) {
    var anamnesis = new AnamnesisModelo();
    anamnesis.historialClinicoId = historialClinicoId;

    this.anamnesisService.buscarAnamnesisFiltrosTabla(anamnesis)
    .subscribe( resp => {     

      if(resp != null){
        this.anamnesisForm.patchValue(resp[0]);
      }
    }, e => {      
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
      this.cargando = false;
    });
  }

  obtenerInsumo(event) {
    event.preventDefault();
    var id = this.stockForm.get('insumos').get('insumoId').value;
    this.insumosService.getInsumo( id )
    .subscribe( (resp: InsumoModelo) => {

        //this.stockForm.get('insumos').patchValue(resp);

      }, e => {
          Swal.fire({
            icon: 'info',
            text: e.status +'. '+ this.comunes.obtenerError(e),
          })
          this.stockForm.get('insumos').get('insumoId').setValue(null);
        }
      );
  }

  crearFormulario() {
    this.pacienteForm = this.fb.group({
      pacienteId  : [null, [] ],
      historialClinico: this.fb.group({
        historialClinicoId: [null, [] ]
      }),
      personas : this.fb.group({
        personaId  : [null, [] ],
        cedula  : [null, [] ],
        nombres  : [null, [] ],
        apellidos: [null, [] ],
        fechaNacimiento: [null, [] ],
        edad: [null, [] ],
        direccion: [null, [] ],
        sexo: [null, [] ],
        estadoCivil: [null, [] ],
        nacionalidad: [null, [] ],
        telefono: [null, [] ],
        email  : [null, [] ],
        celular: [null, [] ],
        carreras: this.fb.group({
          carreraId: [null, [] ],
          descripcion: [null, [] ]
        }),
        departamentos: this.fb.group({
          carreraId: [null, [] ],
          descripcion: [null, [] ]
        }),
        dependencias: this.fb.group({
          carreraId: [null, [] ],
          descripcion: [null, [] ]
        }),
        estamentos: this.fb.group({
          carreraId: [null, [] ],
          descripcion: [null, [] ]
        }),
        fechaCreacion: [null, [] ],
        fechaModificacion: [null, [] ],
        usuarioCreacion: [null, [] ],
        usuarioModificacion: [null, [] ]   
      }),
      grupoSanguineo  : [null, [] ],
      seguroMedico  : [null, [] ]        
    });

    this.historialClinicoForm = this.fb2.group({
      historialClinicoId  : [null, [] ],
      pacientes : this.fb2.group({
        pacienteId  : [null, [] ],
        personas : this.fb2.group({
          cedula  : [null, [] ],
          nombres  : [null, [] ],
          apellidos  : [null, [] ]
        })
      }),      
      areas  : this.fb2.group({
        areaId: [null, [] ],
        descripcion: [null, [] ]
      }),     
      fechaCreacion: [null, [] ],
      fechaModificacion: [null, [] ],
      usuarioCreacion: [null, [] ],
      usuarioModificacion: [null, [] ],             
    });
    
    this.buscadorModalForm = this.fb3.group({
      cedula  : ['', [] ],
      nombres  : ['', [] ],
      apellidos: ['', [] ]   
    });

    this.buscadorForm = this.fb4.group({
      pacienteIdBusqueda  : ['', [] ],
      cedulaBusqueda  : ['', [] ]
    });

    //this.pacienteForm.get('pacienteId').disable();

    this.stockForm = this.fb5.group({
      insumos : this.fb5.group({
        insumoId  : [null, [ Validators.required] ]
      }),
    });

    this.buscadorStockForm = this.fb6.group({
      insumoId  : [null, [] ],
      codigo  : [null, [] ],
      descripcion  : [null, [] ],
      fechaVencimiento: [null, [] ]
    });
    
    this.buscadorTerminoEstandarForm = this.fb7.group({
      id  : [null, [] ],
      codigoUnico  : [null, [] ],
      termino  : [null, [] ]
    });
    
    this.anamnesisForm = this.fb8.group({
      anamnesisId  : [null, [] ],
      antecedentes  : [null, [] ],
      antecedentesRemotos  : [null, [] ]
    });

    this.diagnosticoPrimarioForm = this.fb9.group({
      diagnosticoPrincipal  : [null, [] ],
      terminoEstandarPrincipal  : [null, [] ]
    });

    this.diagnosticoSecundarioForm = this.fb10.group({
      diagnosticoSecundario  : [null, [] ],
      terminoEstandarSecundario  : [null, [] ]
    });

    this.tratamientoFarmacologicoForm = this.fb11.group({
      prescripcionFarm  : [null, [] ]
    });

    this.tratamientoNoFarmacologicoForm = this.fb12.group({
      descripcionTratamiento  : [null, [] ]
    });
  }

  crearTablaModel(){
    this.dtOptionsBuscador = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [[5,10,15,20,50,-1],[5,10,15,20,50,"Todos"]],
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
      searching: false,
      processing: true,
      columns: [ { data: 'pacienteId' }, { data: 'cedula' }, 
      { data: 'nombres' }, { data: 'apellidos' }]      
    };
  }

  crearTablaPatologias(){
    this.dtOptionsPatologias = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [[5,10,15,20,50,-1],[5,10,15,20,50,"Todos"]],
      searching: false, 
      info : false,     
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
        "sLengthMenu":     "Mostrar _MENU_ registros",
        "sEmptyTable":     "Ningún dato disponible en esta tabla",
        "sLoadingRecords": "Cargando..."
      },
      processing: true,
      columns: [
        {data:'#'},
        {data:'patologiaId'}, {data:'codigo'}, {data:'descripcion'},
        {data:'estado'},
        {data:'Editar'}
      ]
    };
  }

  crearTablaAntecedentes(){
    this.dtOptionsAntecedentes = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [[5,10,15,20,50,-1],[5,10,15,20,50,"Todos"]],
      searching: false,
      info : false,
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
        "sLengthMenu":     "Mostrar _MENU_ registros",
        "sEmptyTable":     "Ningún dato disponible en esta tabla",
        "sLoadingRecords": "Cargando..."
      },
      processing: true,
      columns: [
        {data:'#'},
        {data:'antecedenteId'}, {data:'patologiasProcedimientos.descripcion'} ,
        {data:'tipo'},
      ]
    };
  }

  crearTablaAntecedentesFamiliares(){
    this.dtOptionsAntecedentesFamiliares = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [[5,10,15,20,50,-1],[5,10,15,20,50,"Todos"]],
      searching: false,
      info : false,
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
        "sLengthMenu":     "Mostrar _MENU_ registros",
        "sEmptyTable":     "Ningún dato disponible en esta tabla",
        "sLoadingRecords": "Cargando..."
      },
      processing: true,
      columns: [
        {data:'#'},
        {data:'antecedenteId'}, {data:'patologiasProcedimientos.descripcion'} ,
        {data:'tipo'},
      ]
    };
  }

  crearTablaAlergias(){
    this.dtOptionsAlergias = {
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
        "sLengthMenu":     "Mostrar _MENU_ registros",
        "sEmptyTable":     "Ningún dato disponible en esta tabla",
        "sLoadingRecords": "Cargando..."
      },
      processing: true,
      columns: [
        {data:'#'},
        {data:'alergiaId'},
        {data:'alergenos.descripcion'}
      ]
    };
  }

  crearTablaModelStock(){
    this.dtOptionsStock = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [[5,10,15,20,50,-1],[5,10,15,20,50,"Todos"]],
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
      searching: false,
      processing: true,
      columns: [ {data:'stockId'}, {data:'insumos.codigo'}, 
      {data:'insumos.descripcion'}, {data:'insumos.tipo'},
      {data:'cantidad'}, {data:'insumo.fechaVencimiento'}, 
      {data:'unidadMedida'}]      
    };
  }

  crearTablaModelTerminoEstandar(){
    this.dtOptionsTerminoEstandar = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [[5,10,15,20,50,-1],[5,10,15,20,50,"Todos"]],
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
      searching: false,
      processing: true,
      columns: [ {data:'id'}, {data:'codigoUnico'}, 
      {data:'termino'}]      
    };
  }

  crearTablaMedicamentos(){
    this.dtOptionsMedicamentos = {
      searching: false,
       info: false,
       paging: false,    
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
        "emptyTable":" "
      },
      //processing: true,
      columns: [
        {data:'#'},
        {data:'insumoId'}, {data:'codigo'}, {data:'descripcion'},
        {data:'fechaVencimiento'}, {data:'cantidad', className: 'editable'}, {data:'quitar'}
      ]      
    };
  }

  buscadorPacientes(event) {
    event.preventDefault();
    
    var persona: PersonaModelo = new PersonaModelo();
    var buscadorPaciente: PacienteModelo = new PacienteModelo();

    persona.cedula = this.buscadorModalForm.get('cedula').value;
    persona.nombres = this.buscadorModalForm.get('nombres').value;
    persona.apellidos = this.buscadorModalForm.get('apellidos').value;
    buscadorPaciente.personas = persona;

    if(!buscadorPaciente.personas.cedula 
      && !buscadorPaciente.personas.nombres && !buscadorPaciente.personas.apellidos){
      this.alert=true;
      return;
    }
    this.cargando = true;
    this.pacientesService.buscarPacientesFiltros(buscadorPaciente)
    .subscribe( resp => {
      this.pacientes = resp;
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

  quitarMedicamento(event, tratamientoInsumo: TratamientoInsumoModelo ) {

    for (let i = 0; i < this.tratamientosInsumos.length; i++) {
      if( this.tratamientosInsumos[i].insumos.insumoId == tratamientoInsumo.insumos.insumoId ){
        this.tratamientosInsumos.splice(i, 1);
        break;
      }
    }
  }

  buscadorStock(event) {
    event.preventDefault();
    var buscador = new StockModelo();
    var insumo = new InsumoModelo();
    insumo = this.buscadorStockForm.getRawValue();

    if( !insumo.codigo && !insumo.descripcion ){
      this.alert=true;
      return;
    }
    buscador.insumos = insumo;
    this.stockService.buscarStocksFiltrosTabla(buscador)
    .subscribe( resp => {
      this.stocks = resp;
    }, e => {
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
    });
  }

  buscadorTerminoEstandar(event) {
    event.preventDefault();
    var buscador = new TerminoEstandarModelo();
    buscador = this.buscadorTerminoEstandarForm.getRawValue();

    if( !buscador.id && !buscador.codigoUnico && !buscador.termino ){
      this.alert=true;
      return;
    }
    this.terminoEstandarService.buscarTerminoEstandarFiltrosTabla(buscador)
    .subscribe( resp => {
      this.terminosEstandar = resp;
    }, e => {
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
    });
  }

  selectStock(event, stock: StockModelo){
    this.modalService.dismissAll();
   
    this.insumosService.getInsumo( stock.insumos.insumoId )
      .subscribe( (resp: InsumoModelo) => {

        var tratamientoInsumo: TratamientoInsumoModelo  = new TratamientoInsumoModelo();
        tratamientoInsumo.insumos = resp;

        this.tratamientosInsumos.push(tratamientoInsumo);

        var table = $('tableMedicamentos').DataTable();
        table.clear();
        table.rows.add( this.tratamientosInsumos ).draw();
        //this.medicamentos.push(resp);
      }, e => {
          Swal.fire({
            icon: 'info',
            text: e.status +'. '+ this.comunes.obtenerError(e)
          })
        }
      );
  }

  selectTerminoEstandar(event, terminoEstandar: TerminoEstandarModelo){
    this.modalService.dismissAll();

    this.terminoEstandarService.getTerminoEstandar( terminoEstandar.id )
      .subscribe( (resp: TerminoEstandarModelo) => {
        if ( this.tipoDiagnostico == "P" ){
          this.terminoEstandarPrincipalSeleccionado = resp;
        }else if ( this.tipoDiagnostico == "S" ){
          this.terminoEstandarSecundarioSeleccionado = resp;
        }
        this.tipoDiagnostico = null;
      }, e => {
          Swal.fire({
            icon: 'info',
            text: e.status +'. '+ this.comunes.obtenerError(e)
          })
        }
      );
  }

  limpiarModal(event) {
    event.preventDefault();
    this.buscadorModalForm.reset();
  }

  limpiarModalStock(event) {
    event.preventDefault();
    this.buscadorStockForm.reset();
  }

  limpiarModalTerminoEstandar(event) {
    event.preventDefault();
    this.buscadorTerminoEstandarForm.reset();
    this.terminosEstandar = [];
  }

  limpiar(event){
    event.preventDefault();
    this.pacienteForm.reset();
    this.historialClinicoForm.reset();
    this.buscadorForm.reset();
    this.anamnesisForm.reset();
    this.antecedentes = [];
    this.antecedentesFamiliares = [];
    this.alergias = [];
  }

  cerrarAlert(){
    this.alert=false;
  }

  openModal(targetModal) {
    this.modalService.open(targetModal, {
     centered: true,
     backdrop: 'static',
     size: 'lg'
    });
   
    this.buscadorModalForm.patchValue({
      pacienteId: '',
      cedula: '',
      nombres: '',
      apellidos: ''
    });
    this.pacientes = [];
    this.alert=false;
  }

  openModalStock(targetModal) {
    this.modalService.open(targetModal, {
     centered: true,
     backdrop: 'static',
     size: 'lg'
    });
   
    this.buscadorStockForm.patchValue({
      insumoId: null,
      codigo: null,
      descripcion: null,
      fechaVencimiento: null
    });
    this.stocks = [];
    this.alert=false;
  }

  openModalTerminoEstandar(targetModal, tipo) {
    this.tipoDiagnostico = tipo;
    this.modalService.open(targetModal, {
     centered: true,
     backdrop: 'static',
     size: 'lg'
    });
   
    this.buscadorTerminoEstandarForm.patchValue({
      id  : null,
      codigoUnico  : null,
      termino  : null
    });
    this.terminosEstandar = [];
    this.alert=false;
  }

  selectPaciente(event, paciente: PacienteModelo){
    this.modalService.dismissAll();
    if(paciente.pacienteId){
      this.buscadorForm.get('pacienteIdBusqueda').setValue(paciente.pacienteId);
    }
    this.pacientesService.getPaciente( paciente.pacienteId )
      .subscribe( (resp: PacienteModelo) => {         
        this.pacienteForm.patchValue(resp);
        this.buscadorForm.get('cedulaBusqueda').setValue(resp.personas.cedula);
        this.buscadorForm.get('pacienteIdBusqueda').setValue(resp.pacienteId);
      }, e => {
          Swal.fire({
            icon: 'info',
            text: e.status +'. '+ this.comunes.obtenerError(e)
          })
          this.buscadorForm.get('pacienteIdBusqueda').setValue(null);
        }
      );
  }

  onSubmit() {
    this.modalService.dismissAll();
  }

  guardarAnamnesis(event){
    event.preventDefault();
    if ( this.anamnesisForm.invalid ) {

      return Object.values( this.anamnesisForm.controls ).forEach( control => {

        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
      });
    }
    
    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();


    let peticion: Observable<any>;
    var anamnesis: AnamnesisModelo;
    anamnesis = this.anamnesisForm.getRawValue();

    if ( anamnesis.anamnesisId ) {
      //Modificar
      anamnesis.historialClinicoId = this.historialClinicoForm.get('historialClinicoId').value;
      anamnesis.usuarioModificacion = 'admin';
      peticion = this.anamnesisService.actualizarAnamnesis( anamnesis );
    } else {
      //Agregar
      anamnesis.historialClinicoId = this.historialClinicoForm.get('historialClinicoId').value;
      anamnesis.usuarioCreacion = 'admin';
      peticion = this.anamnesisService.crearAnamnesis( anamnesis );
    }

    peticion.subscribe( resp => {

      Swal.fire({
                icon: 'success',
                title: anamnesis.anamnesisId ? anamnesis.anamnesisId.toString(): null,
                text: resp.mensaje,
              }).then( resp => {       

      });
    }, e => {Swal.fire({
              icon: 'error',
              title: 'Algo salio mal',
              text: e.status +'. '+ this.comunes.obtenerError(e),
            })
       }
    );
  }

  guardarDiagnosticoTratamiento(event){
    event.preventDefault();
    if ( this.diagnosticoPrimarioForm.invalid ) {

      return Object.values( this.diagnosticoPrimarioForm.controls ).forEach( control => {

        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
      });
    }

    if ( this.diagnosticoSecundarioForm.invalid ) {

      return Object.values( this.diagnosticoSecundarioForm.controls ).forEach( control => {

        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
      });
    }

    if ( this.tratamientoFarmacologicoForm.invalid ) {

      return Object.values( this.tratamientoFarmacologicoForm.controls ).forEach( control => {

        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
      });
    }

    if ( this.tratamientoNoFarmacologicoForm.invalid ) {

      return Object.values( this.tratamientoNoFarmacologicoForm.controls ).forEach( control => {

        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
      });
    }
    
    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    let peticion: Observable<any>;
    var diagnostico: DiagnosticoModelo = new DiagnosticoModelo();
    var tratamiento: TratamientoModelo = new TratamientoModelo();
    var procesoDiagnosticoTratamiento: ProcesoDiagnosticoTratamientoModelo = new ProcesoDiagnosticoTratamientoModelo();
    var tratamientoInsumoList: TratamientoInsumoModelo[] = new Array();
    var consulta: ConsultaModelo = new ConsultaModelo();
    
    diagnostico.diagnosticoPrincipal = this.diagnosticoPrimarioForm.get('diagnosticoPrincipal').value;
    diagnostico.terminoEstandarSecundario = this.diagnosticoSecundarioForm.get('diagnosticoSecundario').value;
    diagnostico.terminoEstandarPrincipal = this.terminoEstandarPrincipalSeleccionado.id;
    diagnostico.terminoEstandarSecundario = this.terminoEstandarSecundarioSeleccionado.id;

    tratamiento.prescripcionFarm = this.tratamientoFarmacologicoForm.get('prescripcionFarm').value;
    tratamiento.descripcionTratamiento = this.tratamientoNoFarmacologicoForm.get('descripcionTratamiento').value;
    
    tratamientoInsumoList = this.tratamientosInsumos;

    consulta.historialClinicoId = this.historialClinicoForm.get('historialClinicoId').value;

    procesoDiagnosticoTratamiento.diagnostico = diagnostico;
    procesoDiagnosticoTratamiento.tratamiento = tratamiento;
    procesoDiagnosticoTratamiento.tratamientoInsumoList = tratamientoInsumoList;
    procesoDiagnosticoTratamiento.consulta = consulta;

    peticion = this.procesoDiagnosticoTratamientoService.crearProcesoDiagnosticoTratamiento(procesoDiagnosticoTratamiento);
    
    peticion.subscribe( resp => {

      Swal.fire({
                icon: 'success',
                text: resp.mensaje,
              }).then( resp => {       

      });
    }, e => {Swal.fire({
              icon: 'error',
              title: 'Algo salio mal',
              text: e.status +'. '+ this.comunes.obtenerError(e),
            })
       }
    );
  }


}
