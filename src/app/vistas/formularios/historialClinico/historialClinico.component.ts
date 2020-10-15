import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HistorialClinicoModelo } from '../../../modelos/historialClinico.modelo';
import { FuncionarioModelo } from '../../../modelos/funcionario.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import { AreaModelo } from '../../../modelos/area.modelo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ComunesService } from 'src/app/servicios/comunes.service';
import { HistorialesClinicosService } from '../../../servicios/historialesClinicos.service';
import { PacientesService } from '../../../servicios/pacientes.service';
import { FuncionariosService } from '../../../servicios/funcionarios.service';
import { AreasService } from '../../../servicios/areas.service';
import { UploadFileService } from 'src/app/servicios/upload-file.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PacienteModelo } from 'src/app/modelos/paciente.modelo';

@Component({
  selector: 'app-historialClinico',
  templateUrl: './historialClinico.component.html',
  styleUrls: ['./historialClinico.component.css']
})
export class HistorialClinicoComponent implements OnInit {
  crear = false;
  pacientes: PacienteModelo[] = [];
  historialClinico: HistorialClinicoModelo = new HistorialClinicoModelo();
  pacientePersona: PersonaModelo = new PersonaModelo();  
  paciente: PacienteModelo = new PacienteModelo();  
  listaAreas: AreaModelo;
  historialClinicoForm: FormGroup;
  buscadorForm: FormGroup;
  modificar: boolean = false;
  hcid = 0;
  selectedFiles: FileList;
  currentFile: File;
  progress = 0;
  message = '';  
  fileInfos: Observable<any>;
  cargando = false;
  alert:boolean=false;
  dtOptions: any = {};

  constructor( private historialClinicosService: HistorialesClinicosService,
               private pacientesService: PacientesService,
               private funcionariosService: FuncionariosService,
               private comunes: ComunesService,
               private areasService: AreasService,
               private route: ActivatedRoute,
               private router: Router,
               private uploadService: UploadFileService,
               private fb: FormBuilder,
               private fb2: FormBuilder,
               private modalService: NgbModal) { 
    this.crearFormulario();
  }

  ngOnInit() {
    this.listarAreas();
    const id = this.route.snapshot.paramMap.get('id');

    if ( id !== 'nuevo' ) {
      this.historialClinicosService.getHistorialClinico( Number(id) )
        .subscribe( (resp: HistorialClinicoModelo) => {         
          this.historialClinicoForm.patchValue(resp);
          this.hcid = this.historialClinicoForm.get('historialClinicoId').value;
          var cedula = this.historialClinicoForm.get('pacientes').get('personas').get('cedula').value;
          var areaId = this.historialClinicoForm.get('areaId').value;
          this.fileInfos = this.uploadService.getFilesName(cedula + '_' + areaId + '_', "H");
        });
    }else{
      this.crear = true;
    }
  } 

  selectFile(event) {
    this.progress = 0;
    this.selectedFiles = event.target.files;
  }

  obtenerPaciente(event){
    event.preventDefault();
    var id = this.historialClinicoForm.get('pacientes').get('pacienteId').value;
    if(!id){
      return null;
    }
    this.pacientesService.getPaciente( id )
      .subscribe( (resp: PacienteModelo) => {         
        this.historialClinicoForm.get('pacientes').patchValue(resp);
      }, e => {
          Swal.fire({
            icon: 'info',
            text: e.status +'. '+ this.comunes.obtenerError(e)
          })
          this.historialClinicoForm.get('pacientes').get('pacienteId').setValue(null);
        }
      );
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

  obtenerFuncionario( ){
    var id = this.historialClinicoForm.get('funcionarios').get('funcionarioId').value;
    this.funcionariosService.getFuncionario( id )
      .subscribe( (resp: FuncionarioModelo) => {          
        this.historialClinicoForm.get('funcionarios').patchValue(resp);
      }, e => {
          Swal.fire({
            icon: 'info',
            //title: 'Algo salio mal',
            text: e.status +'. '+ this.comunes.obtenerError(e),
          })
        }
      );
  }
  
  guardar( ) {

    if ( this.historialClinicoForm.invalid ){
      return Object.values( this.historialClinicoForm.controls ).forEach( control => {
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

    this.historialClinico = this.historialClinicoForm.getRawValue(); 

    if ( this.historialClinico.historialClinicoId ) {
      this.historialClinico.usuarioModificacion = 'admin';
      peticion = this.historialClinicosService.actualizarHistorialClinico( this.historialClinico );
    } else {
      this.historialClinico.usuarioCreacion = 'admin';
      peticion = this.historialClinicosService.crearHistorialClinico( this.historialClinico);
    }

    peticion.subscribe( resp => {
      var mensajeUpload = '';
      if(this.selectedFiles){
        var cedula = resp.historialClinico.pacientes.personas.cedula;
        var areaId = resp.historialClinico.areaId;
        this.currentFile = this.selectedFiles.item(0);
        var filename = cedula + '_' + areaId + '_' 
                    + this.currentFile.name.split(".")[0] + this.currentFile.name.split(".")[1];
        var renameFile = new File([this.currentFile], filename, {type:this.currentFile.type});

        this.uploadService.upload2(renameFile, "H").subscribe(
          event => {
            mensajeUpload
          },
          err => {
            mensajeUpload = 'No se pudo subir el archivo!' + err.status +'. '+ this.comunes.obtenerError(err);
            console.log(mensajeUpload);
        });

        this.selectedFiles = undefined;
      }
      Swal.fire({
                icon: 'success',
                title: this.historialClinico.historialClinicoId.toString(),
                text: resp.mensaje + '. '+ mensajeUpload
              }).then( resp => {

        if ( resp.value ) {
          if ( this.historialClinico.historialClinicoId ) {
            this.router.navigate(['/historialesClinicos']);
          }else{
            this.limpiar();
          }
        }
      });
    }, e => {
            Swal.fire({
              icon: 'error',
              title: 'Algo salio mal',
              text: e.status +'. '+ this.comunes.obtenerError(e)
            })          
       }
    );
  }

  limpiar(){
    this.historialClinicoForm.reset();
    this.historialClinico = new HistorialClinicoModelo();
    this.paciente = new PacienteModelo();
  }

  obtenerError(e : any){
    var mensaje = "Error indefinido ";
      if(e.error){
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
      }
      if(e.message){
        mensaje = mensaje + ' ' + e.message;
      }
    return mensaje;  
  }

  get areaNoValido() {
    return this.historialClinicoForm.get('areaId').invalid 
    && this.historialClinicoForm.get('areaId').touched
  }
  
  crearFormulario() {
    this.historialClinicoForm = this.fb.group({
      historialClinicoId  : [null, [] ],
      pacientes : this.fb.group({
        pacienteId  : [null, [] ],
        personas : this.fb.group({
          cedula  : [null, [] ],
          nombres  : [null, [] ],
          apellidos  : [null, [] ]
        })
      }),      
      areaId  : [null, [Validators.required] ],     
      fechaCreacion: [null, [] ],
      fechaModificacion: [null, [] ],
      usuarioCreacion: [null, [] ],
      usuarioModificacion: [null, [] ],             
    });

    this.buscadorForm = this.fb2.group({
      pacienteId  : ['', [] ],
      cedula  : ['', [] ],
      nombres  : ['', [] ],
      apellidos: ['', [] ]   
    });

    this.historialClinicoForm.get('historialClinicoId').disable();
    this.historialClinicoForm.get('pacientes').get('personas').get('cedula').disable();
    this.historialClinicoForm.get('pacientes').get('personas').get('nombres').disable();
    this.historialClinicoForm.get('pacientes').get('personas').get('apellidos').disable();

    this.historialClinicoForm.get('fechaCreacion').disable();
    this.historialClinicoForm.get('fechaModificacion').disable();
    this.historialClinicoForm.get('usuarioCreacion').disable();
    this.historialClinicoForm.get('usuarioModificacion').disable();
  }

  buscadorPacientes(event) {
    event.preventDefault();
    
    var persona: PersonaModelo = new PersonaModelo();
    var buscadorPaciente: PacienteModelo = new PacienteModelo();

    persona.cedula = this.buscadorForm.get('cedula').value;
    persona.nombres = this.buscadorForm.get('nombres').value;
    persona.apellidos = this.buscadorForm.get('apellidos').value;
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

  limpiarModal(event) {
    event.preventDefault();
    this.buscadorForm.reset();
    this.pacientes = [];
  }

  cerrarAlert(){
    this.alert=false;
  }

  crearTablaModel(){
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

  openModal(targetModal) {
    this.modalService.open(targetModal, {
     centered: true,
     backdrop: 'static',
     size: 'lg'
    });
   
    this.buscadorForm.patchValue({
      pacienteId: '',
      cedula: '',
      nombres: '',
      apellidos: ''
    });
    this.pacientes = [];
    this.alert=false;
  }

  selectPaciente(event, paciente: PacienteModelo){
    this.modalService.dismissAll();
    if(paciente.pacienteId){
      this.historialClinicoForm.get('pacientes').get('pacienteId').setValue(paciente.pacienteId);
    }
    this.pacientesService.getPaciente( paciente.pacienteId )
      .subscribe( (resp: PacienteModelo) => {         
        this.historialClinicoForm.get('pacientes').patchValue(resp);
      }, e => {
          Swal.fire({
            icon: 'info',
            text: e.status +'. '+ this.comunes.obtenerError(e)
          })
          this.historialClinicoForm.get('pacientes').get('pacienteId').setValue(null);
        }
      );
  }

  onSubmit() {
    this.modalService.dismissAll();
   }
}
