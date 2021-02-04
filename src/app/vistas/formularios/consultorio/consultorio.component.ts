import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Observable, Subject } from 'rxjs';
import { DiagnosticoModelo } from 'src/app/modelos/diagnostico.modelo';
import { TratamientoModelo } from 'src/app/modelos/tratamiento.modelo';
import { ProcesoDiagnosticoTratamientoModelo } from 'src/app/modelos/procesoDiagnosticoTratamiento.modelo';
import { ProcesoDiagnosticoTratamientosService } from 'src/app/servicios/procesoDiagnosticoTratamiento.service';
import { TratamientoInsumoModelo } from 'src/app/modelos/tratamientoInsumo.modelo';
import { ConsultaModelo } from 'src/app/modelos/consulta.modelo';
import { ConsultasService } from 'src/app/servicios/consultas.service';
import { DataTableDirective } from 'angular-datatables';
import { UploadFileService } from 'src/app/servicios/upload-file.service';
import { HistorialClinicoPacienteModelo } from 'src/app/modelos/HistorialClinicoPaciente.modelo';

@Component({
  selector: 'app-consultorio',
  templateUrl: './consultorio.component.html',
  styleUrls: ['./consultorio.component.css']
})
export class ConsultorioComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
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
  listaEstadoCivil: ParametroModelo[] = [];
  listaSexo: ParametroModelo[] = [];
  listaNacionalidad: ParametroModelo[] = [];
  stocks: StockModelo[] = [];
  consultas: ConsultaModelo[] = new Array();
  terminosEstandar: TerminoEstandarModelo[] = [];
  terminoEstandarPrincipalSeleccionado: TerminoEstandarModelo = new TerminoEstandarModelo();
  terminoEstandarSecundarioSeleccionado: TerminoEstandarModelo = new TerminoEstandarModelo();
  tratamientosInsumos: TratamientoInsumoModelo[] = [];
  cargando = false;
  alert:boolean=false;
  alertMedicamentos:boolean=false;
  alertGeneral:boolean=false;
  tipoDiagnostico: String = null;
  mensajeGeneral: String = null;
  historialClinicoId: any = null;
  dtOptionsBuscadorStock: any = {};
  dtOptionsBuscador: any = {};
  dtOptionsPatologias: any = {};  
  dtOptionsAntecedentes: any = {};
  dtOptionsAntecedentesFamiliares: any = {};
  dtOptionsAlergias: any = {};
  dtOptionsStock: any = {};  
  dtOptionsTerminoEstandar: any = {};
  dtOptionsConsultas: any = {};
  dtOptionsMedicamentos: any = {};
  dtTriggerMedicamentos : Subject<any> = new Subject<any>();
  dtTriggerStock : Subject<any> = new Subject<any>();
  dtTriggerConsultas : Subject<any> = new Subject<any>();
  dtTriggerAlergias : Subject<any> = new Subject<any>();
  dtTriggerAntecedentes : Subject<any> = new Subject<any>();
  dtTriggerAntecedentesFamiliares : Subject<any> = new Subject<any>();
  dtTriggerPatologias : Subject<any> = new Subject<any>();
  hcid = 0;
  fileInfos: Observable<any>;

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
               private consultasService: ConsultasService,
               private uploadService: UploadFileService,
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
    this.ngOnInit();
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
    this.crearTablaConsultas();
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

    var cedula = this.buscadorForm.get('cedulaBusqueda').value;

    if( cedula ){
      persona.cedula = cedula;
      paciente.personas = persona;
    }else{
      paciente.personas = null;
    }
    
    paciente.pacienteId = this.buscadorForm.get('pacienteIdBusqueda').value;
    this.limpiar(event);

    Swal.fire({
      title: 'Espere',
      text: 'Buscando...',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    this.pacientesService.buscarPacientesFiltros(paciente)
    .subscribe( resp => { 
      if(resp.length <= 0){
        Swal.fire({
          icon: 'info',
          title: 'No se encontró paciente',
        })
      }else{
        Swal.close();
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
        this.paciente = resp[0];
        
        this.pacienteForm.patchValue(this.paciente);
        this.buscadorForm.get('pacienteIdBusqueda').setValue(this.paciente.pacienteId);
        this.buscadorForm.get('cedulaBusqueda').setValue(this.paciente.personas.cedula);

        this.historialClinicoId = this.pacienteForm.get('historialClinico').get('historialClinicoId').value;
        this.ageCalculator();
        if( this.paciente.pacienteId ){
          this.obtenerHistorialClinico();          
          this.obtenerAntecedentes();
          this.obtenerAntecedentesFamiliares();
          this.obtenerAlergias();
          this.obtenerAnamnesis();
          this.obtenerConsultas();
        }else{
          this.alertGeneral = true;
          this.mensajeGeneral = "El paciente aun no cuenta con Historial Clinico definido";
        }
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

  ageCalculator(){
    var fechaNacimiento = this.pacienteForm.get('personas').get('fechaNacimiento').value;//toString();
    if( fechaNacimiento ){
      const convertAge = new Date(fechaNacimiento);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());

      this.pacienteForm.get('personas').get('edad').setValue(Math.floor((timeDiff / (1000 * 3600 * 24))/365));
    }
  }

  obtenerHistorialClinico() {   
    var historialClinico = new HistorialClinicoModelo();

    historialClinico.pacientes.pacienteId = this.paciente.pacienteId;
    
    this.historialClinicosService.buscarHistorialClinicosFiltros(historialClinico)
    .subscribe( resp => {
      if(resp.length > 0){
        this.historialClinicoForm.patchValue(resp[0]);
        if ( resp[0].historialClinicoId != null ){
          this.hcid = this.historialClinicoForm.get('historialClinicoId').value;
          var cedula = this.pacienteForm.get('personas').get('cedula').value;
          var areaId = this.historialClinicoForm.get('areas').get('areaId').value;
          this.fileInfos = this.uploadService.getFilesName(cedula + '_' + areaId + '_', "H");
        }
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

    antecedente.pacienteId = this.paciente.pacienteId;
    antecedente.tipo = "P";//antecedentes personales
    this.antecedentesService.buscarAntecedentesFiltros(antecedente)
    .subscribe( resp => {

      this.antecedentes = resp;
      this.dtTriggerAntecedentes.next();
     
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

    antecedente.pacienteId = this.paciente.pacienteId;
    antecedente.tipo = "F";//antecedentes familiares
    this.antecedentesService.buscarAntecedentesFiltros(antecedente)
    .subscribe( resp => {

      this.antecedentesFamiliares = resp;
      this.dtTriggerAntecedentesFamiliares.next();
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

    alergias.pacienteId = this.paciente.pacienteId;

    this.alergiaService.buscarAlergiasFiltros(alergias)
    .subscribe( resp => {

      this.alergias = resp;
      this.dtTriggerAlergias.next();
    }, e => {      
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
      this.cargando = false;
    });
  }

  obtenerAnamnesis() {
    var anamnesis = new AnamnesisModelo();
    anamnesis.pacienteId = this.paciente.pacienteId;

    this.anamnesisService.buscarAnamnesisFiltrosTabla(anamnesis)
    .subscribe( resp => {     

      if(resp != null && resp.length > 0){
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

  obtenerConsultas() {
    var consultas = new ConsultaModelo();
    consultas.pacienteId = this.paciente.pacienteId;

    this.consultas = [];
    $('#tableConsultas').DataTable().destroy();

    this.consultasService.buscarConsultasFiltrosTabla(consultas)
    .subscribe( resp => {     

      this.consultas = resp;
      this.dtTriggerConsultas.next();
      
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
        observacion: [null, [] ],
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
  
  crearTablaConsultas(){
    this.dtOptionsConsultas = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [[5,10,15,20,50,-1],[5,10,15,20,50,"Todos"]],
      searching: false,
      order: [0,"desc"],
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
      columns: [ {data:'consultaId'}, {data:'fecha', width: "30%"}, 
      {data:'diagnosticos.diagnosticoId'},
      {data:'diagnosticos.terminoEstandarPrincipal'},{data:'diagnosticos.terminoEstandarSecundario'},
      {data:'tratamientos.tratamientoId'}, {data:'areas.codigo'}, {data:'editar'}]      
    };
  }

  crearTablaMedicamentos(){
    this.dtOptionsMedicamentos = {
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
        "emptyTable":" "
      },
      processing: true,
      columns: [
        {data:'#'},
        {data:'insumoId'}, {data:'codigo'}, {data:'descripcion'},
        {data:'fechaVencimiento'}, 
        {data:'cantidad'}, 
        {data:'quitar'}
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
        $('#tableMedicamentos').DataTable().destroy();
        this.tratamientosInsumos.splice(i, 1);        
        this.dtTriggerMedicamentos.next();
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

        if(this.tratamientosInsumos.length > 0){
          for (let i = 0; i < this.tratamientosInsumos.length; i++) {
            if(this.tratamientosInsumos[i].insumos.insumoId == resp.insumoId){
              this.alertMedicamentos=true;
              return null;
            }
          }
          $('#tableMedicamentos').DataTable().destroy();
          this.tratamientosInsumos.push(tratamientoInsumo);
          this.dtTriggerMedicamentos.next();
        }else{
          $('#tableMedicamentos').DataTable().destroy();
          this.tratamientosInsumos.push(tratamientoInsumo);
          this.dtTriggerMedicamentos.next();
         
        }
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
    $('#tableAntecedentes').DataTable().destroy();
    this.antecedentesFamiliares = [];
    $('#tableAntecedentesFamiliares').DataTable().destroy();
    this.alergias = [];
    $('#tableAlergias').DataTable().destroy();
    this.consultas = [];
    $('#tableConsultas').DataTable().destroy();
    this.diagnosticoPrimarioForm.reset();
    this.diagnosticoSecundarioForm.reset();
    this.tratamientoFarmacologicoForm.reset();
    this.tratamientoNoFarmacologicoForm.reset();
    this.terminoEstandarPrincipalSeleccionado = new TerminoEstandarModelo();
    this.terminoEstandarSecundarioSeleccionado = new TerminoEstandarModelo();
    this.alertGeneral=false;
  }

  limpiarDiagnosticoTratamiento() {
    this.diagnosticoPrimarioForm.reset();
    this.diagnosticoSecundarioForm.reset();
    this.tratamientoFarmacologicoForm.reset();
    this.tratamientoNoFarmacologicoForm.reset();
    this.tratamientosInsumos = [];
    $('#tableMedicamentos').DataTable().destroy();
    this.dtTriggerMedicamentos.next();
  }

  cerrarAlert(){
    this.alert=false;
  }
  cerrarAlertMedicamento(){
    this.alertMedicamentos=false;
  }
  cerrarAlertGeneral(){
    this.alertGeneral=false;
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
      anamnesis.pacienteId = this.paciente.pacienteId;
      anamnesis.usuarioModificacion = 'admin';
      peticion = this.anamnesisService.actualizarAnamnesis( anamnesis );
    } else {
      //Agregar
      anamnesis.pacienteId = this.paciente.pacienteId;
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
    
    var rows =  $('#tableMedicamentos').DataTable().rows().data();  
    var cantidades = rows.$('input').serializeArray();

    for (let i = 0; i < cantidades.length; i++) {
      this.tratamientosInsumos[i].cantidad = Number(cantidades[i].value);
    }    

    tratamientoInsumoList = this.tratamientosInsumos;

    consulta.pacienteId = this.paciente.pacienteId;
    consulta.areas.areaId = 83;//cambiar por el area del funcionario

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
                this.limpiarDiagnosticoTratamiento();
                this.obtenerConsultas();
      });

    }, e => {Swal.fire({
              icon: 'error',
              title: 'Algo salio mal',
              text: e.status +'. '+ this.comunes.obtenerError(e),
            })
       }
    );
  }

  get antecedentesNoValido() {
    return this.anamnesisForm.get('antecedentes').invalid 
    && this.anamnesisForm.get('antecedentes').touched
  }

  get antecedentesRemotosNoValido() {
    return this.anamnesisForm.get('antecedentesRemotos').invalid 
    && this.anamnesisForm.get('antecedentesRemotos').touched
  }

}
