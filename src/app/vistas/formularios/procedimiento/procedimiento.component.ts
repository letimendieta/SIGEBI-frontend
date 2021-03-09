import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ProcedimientoModelo } from '../../../modelos/procedimiento.modelo';
import { FuncionarioModelo } from '../../../modelos/funcionario.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ComunesService } from 'src/app/servicios/comunes.service';
import { ProcedimientosService } from '../../../servicios/procedimientos.service';
import { PacientesService } from '../../../servicios/pacientes.service';
import { FuncionariosService } from '../../../servicios/funcionarios.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PacienteModelo } from 'src/app/modelos/paciente.modelo';
import { StockModelo } from 'src/app/modelos/stock.modelo';
import { InsumoModelo } from 'src/app/modelos/insumo.modelo';
import { StocksService } from 'src/app/servicios/stocks.service';
import { TratamientoInsumoModelo } from 'src/app/modelos/tratamientoInsumo.modelo';
import { InsumosService } from 'src/app/servicios/insumos.service';
import { ProcedimientoInsumoModelo } from 'src/app/modelos/procedimientoInsumo.modelo';
import { ProcesoProcedimientoModelo } from 'src/app/modelos/procesoProcedimiento.modelo';
import { ParametroModelo } from 'src/app/modelos/parametro.modelo';
import { ParametrosService } from 'src/app/servicios/parametros.service';

@Component({
  selector: 'app-procedimiento',
  templateUrl: './procedimiento.component.html',
  styleUrls: ['./procedimiento.component.css']
})
export class ProcedimientoComponent implements OnInit {
  crear = false;  
  pacientePersona: PersonaModelo = new PersonaModelo();  
  funcionarioPersona: PersonaModelo = new PersonaModelo();
  pacientes: PacienteModelo[] = [];
  funcionarios: FuncionarioModelo[] = [];
  stocks: StockModelo[] = [];
  procedimientosInsumos: ProcedimientoInsumoModelo[] = [];
  paciente: PacienteModelo = new PacienteModelo();
  funcionario: FuncionarioModelo = new FuncionarioModelo();
  listaEstadosProcedimientos: ParametroModelo;
  buscadorPacientesForm: FormGroup;
  buscadorFuncionariosForm: FormGroup;
  procedimientoForm: FormGroup;
  buscadorStockForm: FormGroup;
  alert:boolean=false;
  alertPacientes:boolean=false;
  alertMedicamentos:boolean=false;
  alertFuncionarios:boolean=false;
  alertGuardar:boolean=false;
  dtOptions: any = {};
  dtOptionsStock: any = {};  
  dtOptionsMedicamentos: any = {};
  dtTriggerMedicamentos : Subject<any> = new Subject<any>();
  modificar: boolean = false;
  cargando = false;

  constructor( private procedimientosService: ProcedimientosService,
               private pacientesService: PacientesService,
               private funcionariosService: FuncionariosService,
               private stockService: StocksService,
               private insumosService: InsumosService,
               private parametrosService: ParametrosService,
               private router: Router,
               private comunes: ComunesService,
               private route: ActivatedRoute,
               private fb: FormBuilder,
               private fb2: FormBuilder,
               private fb3: FormBuilder,
               private fb4: FormBuilder,
               private modalService: NgbModal ) { 
    this.crearFormulario();
  }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    if ( id !== 'nuevo' ) {
      this.procedimientosService.getProcedimiento( Number(id) )
        .subscribe( (resp: ProcedimientoModelo) => {         
          this.procedimientoForm.patchValue(resp);
          this.listarEstadosProcedimientos();
          this.obtenerProcedimientosInsumos();          
        });
    }else{
      this.crear = true;
      this.listarEstadosProcedimientos();
    }
  }  

  obtenerPaciente(event ){
    event.preventDefault();
    var id = this.procedimientoForm.get('pacientes').get('pacienteId').value;
    this.pacientesService.getPaciente( id )
        .subscribe( (resp: PacienteModelo) => {         
          this.procedimientoForm.get('pacientes').patchValue(resp);
        }, e => {
            Swal.fire({
              icon: 'info',
              text: e.status +'. '+ this.comunes.obtenerError(e),
            })
          }
        );
  }

  obtenerFuncionario(event ){
    event.preventDefault();

    var id = this.procedimientoForm.get('funcionarios').get('funcionarioId').value;
    this.funcionariosService.getFuncionario( id )
      .subscribe( (resp: FuncionarioModelo) => {          
        this.procedimientoForm.get('funcionarios').patchValue(resp);
      }, e => {
          Swal.fire({
            icon: 'info',
            text: e.status +'. '+ this.comunes.obtenerError(e),
          })
        }
      );
  }

  obtenerProcedimientosInsumos() {
    var procedimientoInsumo = new ProcedimientoInsumoModelo();
    var procedimiento = new ProcedimientoModelo();

    procedimiento.procedimientoId = this.procedimientoForm.get('procedimientoId').value;
    procedimientoInsumo.procedimientos = procedimiento;    

    this.procedimientosService.obtenerProcedimientosInsumos(procedimientoInsumo)
    .subscribe( resp => {
      this.procedimientosInsumos = resp;     
    }, e => {      
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
    });
  }

  listarEstadosProcedimientos() {
    var orderBy = "descripcion";
    var orderDir = "asc";

    var sexoParam = new ParametroModelo();
    sexoParam.codigoParametro = "EST_PROCE";
    sexoParam.estado = "A";

    this.parametrosService.buscarParametrosFiltros( sexoParam, orderBy, orderDir )
      .subscribe( (resp: ParametroModelo) => {
        this.listaEstadosProcedimientos = resp;
    });
  }
  
  guardar( ) {

    if ( this.procedimientoForm.invalid ){
      this.alertGuardar = true;
      return Object.values( this.procedimientoForm.controls ).forEach( control => {
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
    var procesoProcedimientoInsumo: ProcesoProcedimientoModelo = new ProcesoProcedimientoModelo();
    var procedimiento: ProcedimientoModelo = new ProcedimientoModelo();

    procedimiento = this.procedimientoForm.getRawValue();
    var rows =  $('#tableMedicamentos').DataTable().rows().data();  
    var cantidades = rows.$('input').serializeArray();
    var estados = rows.$('select').serializeArray();

    for (let i = 0; i < estados.length; i++) {
      this.procedimientosInsumos[i].estado = estados[i].value;
      this.procedimientosInsumos[i].cantidad = Number(cantidades[i].value);
    }   

    procesoProcedimientoInsumo.procedimiento = procedimiento;
    procesoProcedimientoInsumo.procedimientoInsumoList = this.procedimientosInsumos;
  
    if ( procedimiento.procedimientoId ) {
      procedimiento.usuarioModificacion = 'admin';
      peticion = this.procedimientosService.actualizarProcedimiento( procesoProcedimientoInsumo );
    } else {
      procedimiento.usuarioCreacion = 'admin';
      peticion = this.procedimientosService.crearProcedimiento( procesoProcedimientoInsumo );
    }

    peticion.subscribe( resp => {

      Swal.fire({
                icon: 'success',
                title: procedimiento.procedimientoId ? procedimiento.procedimientoId.toString() : '',
                text: resp.mensaje,
              }).then( resp => {

        if ( resp.value ) {
          if ( procedimiento.procedimientoId ) {
            this.router.navigate(['/procedimientos']);
          }else{
            this.limpiar();
          }
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

  limpiar(){
    this.procedimientoForm.reset();
    this.paciente = new PacienteModelo();
    this.funcionario = new FuncionarioModelo();
    this.procedimientosInsumos = [];
    $('#tableMedicamentos').DataTable().destroy();
    this.dtTriggerMedicamentos.next();
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
  
  get notaNoValido() {
    return this.procedimientoForm.get('notas').invalid && this.procedimientoForm.get('notas').touched
  }

  crearFormulario() {
    this.procedimientoForm = this.fb.group({
      procedimientoId  : [null, [] ],
      pacientes : this.fb.group({
        pacienteId  : [null, [] ],
        personas : this.fb.group({
          cedula  : [null, [] ],
          nombres  : [null, [] ],
          apellidos  : [null, [] ]
        })
      }),
      funcionarios : this.fb.group({
        funcionarioId  : [null, [] ],
        personas : this.fb.group({
          cedula  : [null, [] ],
          nombres  : [null, [] ],
          apellidos  : [null, [] ]
        })
      }),
      insumoId  : [null, [] ],
      fecha  : [null, [] ],
      notas  : [null, [Validators.required] ],
      fechaCreacion: [null, [] ],
      fechaModificacion: [null, [] ],
      usuarioCreacion: [null, [] ],
      usuarioModificacion: [null, [] ],             
    });

    this.buscadorPacientesForm = this.fb2.group({
      pacienteId  : ['', [] ],
      cedula  : ['', [] ],
      nombres  : ['', [] ],
      apellidos: ['', [] ]   
    });

    this.buscadorFuncionariosForm = this.fb3.group({
      funcionarioId  : ['', [] ],
      cedula  : ['', [] ],
      nombres  : ['', [] ],
      apellidos: ['', [] ]   
    });

    this.buscadorStockForm = this.fb4.group({
      insumoId  : [null, [] ],
      codigo  : [null, [] ],
      descripcion  : [null, [] ],
      fechaVencimiento: [null, [] ]
    });

    this.procedimientoForm.get('procedimientoId').disable();
    this.procedimientoForm.get('pacientes').get('personas').get('cedula').disable();
    this.procedimientoForm.get('pacientes').get('personas').get('nombres').disable();
    this.procedimientoForm.get('pacientes').get('personas').get('apellidos').disable();

    this.procedimientoForm.get('funcionarios').get('personas').get('cedula').disable();
    this.procedimientoForm.get('funcionarios').get('personas').get('nombres').disable();
    this.procedimientoForm.get('funcionarios').get('personas').get('apellidos').disable();

    this.procedimientoForm.get('fechaCreacion').disable();
    this.procedimientoForm.get('fechaModificacion').disable();
    this.procedimientoForm.get('usuarioCreacion').disable();
    this.procedimientoForm.get('usuarioModificacion').disable();
  }

  buscadorPacientes(event) {
    event.preventDefault();
    
    var persona: PersonaModelo = new PersonaModelo();
    var buscadorPaciente: PacienteModelo = new PacienteModelo();

    persona.cedula = this.buscadorPacientesForm.get('cedula').value;
    persona.nombres = this.buscadorPacientesForm.get('nombres').value;
    persona.apellidos = this.buscadorPacientesForm.get('apellidos').value;
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

  buscadorFuncionarios(event) {
    event.preventDefault();
    var persona: PersonaModelo = new PersonaModelo();
    var buscador: FuncionarioModelo = new FuncionarioModelo();

    persona.cedula = this.buscadorFuncionariosForm.get('cedula').value;
    persona.nombres = this.buscadorFuncionariosForm.get('nombres').value;
    persona.apellidos = this.buscadorFuncionariosForm.get('apellidos').value;
    buscador.personas = persona;
    buscador.funcionarioId = this.buscadorFuncionariosForm.get('funcionarioId').value;    
    this.funcionariosService.buscarFuncionariosFiltros(buscador)
    .subscribe( resp => {
      this.funcionarios = resp;
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

  limpiarModalPacientes(event) {
    event.preventDefault();
    this.buscadorPacientesForm.reset();
    this.pacientes = [];
  }

  limpiarModalFuncionarios(event) {
    event.preventDefault();
    this.buscadorFuncionariosForm.reset();
    this.funcionarios = [];
  }

  limpiarModalStock(event) {
    event.preventDefault();
    this.buscadorStockForm.reset();
  }

  cerrarAlert(){
    this.alert=false;
  }
  cerrarAlertMedicamento(){
    this.alertMedicamentos=false;
  }
  cerrarAlertPaciente(){
    this.alertPacientes=false;
  }
  cerrarAlertFuncionarios(){
    this.alertFuncionarios=false;
  }
  crearTablaModelPacientes(){
    this.dtOptions = {
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

  crearTablaModelFuncionarios(){
    this.dtOptions = {
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
      columns: [ { data: 'funcionarioId' }, { data: 'cedula' }, 
      { data: 'nombres' }, { data: 'apellidos' }]      
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
      {data:'cantidad'}, {data:'estado'}, {data:'insumo.fechaVencimiento'}, 
      {data:'unidadMedida'}]      
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

  quitarMedicamento(event, procedimientoInsumo: ProcedimientoInsumoModelo ) {

    for (let i = 0; i < this.procedimientosInsumos.length; i++) {
      if( this.procedimientosInsumos[i].insumos.insumoId == procedimientoInsumo.insumos.insumoId ){
        $('#tableMedicamentos').DataTable().destroy();
        this.procedimientosInsumos.splice(i, 1);        
        this.dtTriggerMedicamentos.next();
        break;
      }
    }
  }

  openModalPacientes(targetModal) {
    this.modalService.open(targetModal, {
     centered: true,
     backdrop: 'static',
     size: 'lg'
    });
   
    this.buscadorPacientesForm.patchValue({
      pacienteId: '',
      cedula: '',
      nombres: '',
      apellidos: ''
    });
    this.pacientes = [];
    this.alert=false;
  }

  openModalFuncionarios(targetModal) {
    this.modalService.open(targetModal, {
     centered: true,
     backdrop: 'static',
     size: 'lg'
    });
   
    this.buscadorFuncionariosForm.patchValue({
      funcionarioId: '',
      cedula: '',
      nombres: '',
      apellidos: ''
    });
    this.funcionarios = [];
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

  selectPaciente(event, paciente: PacienteModelo){
    this.modalService.dismissAll();
    if(paciente.pacienteId){
      this.procedimientoForm.get('pacientes').get('pacienteId').setValue(paciente.pacienteId);
    }
    this.pacientesService.getPaciente( paciente.pacienteId )
      .subscribe( (resp: PacienteModelo) => {         
        this.procedimientoForm.get('pacientes').patchValue(resp);
      }, e => {
          Swal.fire({
            icon: 'info',
            text: e.status +'. '+ this.comunes.obtenerError(e)
          })
          this.procedimientoForm.get('pacientes').get('pacienteId').setValue(null);
        }
      );
  }

  selectFuncionario(event, funcionario: FuncionarioModelo){
    this.modalService.dismissAll();
    if(funcionario.funcionarioId){
      this.procedimientoForm.get('funcionarios').get('funcionarioId').setValue(funcionario.funcionarioId);
    }
    this.funcionariosService.getFuncionario( funcionario.funcionarioId )
      .subscribe( (resp: FuncionarioModelo) => {         
        this.procedimientoForm.get('funcionarios').patchValue(resp);
      }, e => {
          Swal.fire({
            icon: 'info',
            text: e.status +'. '+ this.comunes.obtenerError(e)
          })
          this.procedimientoForm.get('funcionarios').get('funcionarioId').setValue(null);
        }
      );
  }

  selectStock(event, stock: StockModelo){
    this.modalService.dismissAll();
   
    this.insumosService.getInsumo( stock.insumos.insumoId )
      .subscribe( (resp: InsumoModelo) => {

        var procedimientoInsumo: ProcedimientoInsumoModelo  = new ProcedimientoInsumoModelo();
        procedimientoInsumo.insumos = resp;

        if(this.procedimientosInsumos.length > 0){
          for (let i = 0; i < this.procedimientosInsumos.length; i++) {
            if(this.procedimientosInsumos[i].insumos.insumoId == resp.insumoId){
              this.alertMedicamentos=true;
              return null;
            }
          }
          $('#tableMedicamentos').DataTable().destroy();
          this.procedimientosInsumos.push(procedimientoInsumo);
          this.dtTriggerMedicamentos.next();
        }else{
          $('#tableMedicamentos').DataTable().destroy();
          this.procedimientosInsumos.push(procedimientoInsumo);
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

  onSubmit() {
    this.modalService.dismissAll();
  }

  cerrarAlertGuardar(){
    this.alertGuardar=false;
  }
}
