import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteModelo } from '../../../modelos/paciente.modelo';
import { ParametroModelo } from '../../../modelos/parametro.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import { CarreraModelo } from '../../../modelos/carrera.modelo';
import { DepartamentoModelo } from '../../../modelos/departamento.modelo';
import { DependenciaModelo } from '../../../modelos/dependencia.modelo';
import { EstamentoModelo } from '../../../modelos/estamento.modelo';
import { PacientesService } from '../../../servicios/pacientes.service';
import { ParametrosService } from '../../../servicios/parametros.service';
import { CarrerasService } from '../../../servicios/carreras.service';
import { DepartamentosService } from '../../../servicios/departamentos.service';
import { DependenciasService } from '../../../servicios/dependencias.service';
import { EstamentosService } from '../../../servicios/estamentos.service';
import { UploadFileService } from 'src/app/servicios/upload-file.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {
  crear = false;
  paciente: PacienteModelo = new PacienteModelo();
  listaEstadoCivil: ParametroModelo;
  listaSexo: ParametroModelo;
  listaNacionalidad: ParametroModelo;
  listaCarreras: CarreraModelo;
  listaDepartamentos: DepartamentoModelo;
  listaDependencias: DependenciaModelo;
  listaEstamentos: EstamentoModelo;

  pacienteForm: FormGroup;
  selectedFiles: FileList;
  currentFile: File;
  progress = 0;
  message = '';  
  fileInfos: Observable<any>;

  constructor( private pacientesService: PacientesService,
               private parametrosService: ParametrosService,
               private carrerasService: CarrerasService,
               private departamentosService: DepartamentosService,
               private dependenciasService: DependenciasService,
               private estamentosService: EstamentosService,
               private uploadService: UploadFileService,
               private router: Router,
               private route: ActivatedRoute,
               private fb: FormBuilder ) { 
    this.crearFormulario();
  }              

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');
    this.obtenerParametros();
    this.listarCarreras();
    this.listarDepartamentos();
    this.listarDependencias();
    this.listarEstamentos();

    if ( id !== 'nuevo' ) {

      this.pacientesService.getPaciente( Number(id) )
        .subscribe( (resp: PacienteModelo) => {  
          this.pacienteForm.patchValue(resp);
          var cedula = this.pacienteForm.get('personas').get('cedula').value;
          this.fileInfos = this.uploadService.getFilesName(cedula + '_', "I");
        });
    }else{
      this.crear = true;
    }
  }

  selectFile(event) {
    this.progress = 0;
    this.selectedFiles = event.target.files;
  }

  obtenerParametros() {
    var estadoCivilParam = new ParametroModelo();
    estadoCivilParam.codigoParametro = "EST_CIVIL";
    estadoCivilParam.estado = "A";
    var orderBy = "descripcionValor";
    var orderDir = "asc";

    this.parametrosService.buscarParametrosFiltros( estadoCivilParam, orderBy, orderDir )
      .subscribe( (resp: ParametroModelo) => {
        this.listaEstadoCivil = resp;
    });

    var sexoParam = new ParametroModelo();
    sexoParam.codigoParametro = "SEXO";
    sexoParam.estado = "A";

    this.parametrosService.buscarParametrosFiltros( sexoParam, orderBy, orderDir )
      .subscribe( (resp: ParametroModelo) => {
        this.listaSexo = resp;
    });

    var nacionalidadParam = new ParametroModelo();
    nacionalidadParam.codigoParametro = "NACIONALIDAD";
    nacionalidadParam.estado = "A";

    this.parametrosService.buscarParametrosFiltros( nacionalidadParam, orderBy, orderDir )
      .subscribe( (resp: ParametroModelo) => {
        this.listaNacionalidad = resp;
    });    
  }

  obtenerPersona(event){
    event.preventDefault();
    var id = this.pacienteForm.get('personas').get('personaId').value;
    this.pacientesService.getPersona( id )
      .subscribe( (resp: PersonaModelo) => {
        this.pacienteForm.get('personas').patchValue(resp);
      }, e => {
          Swal.fire({
            icon: 'info',
            text: e.status +'. '+ this.obtenerError(e),
          })
          this.pacienteForm.get('personas').get('personaId').setValue(null);
        }
      );
  }
  
  listarCarreras() {
    var orderBy = "descripcion";
    var orderDir = "asc";

    this.carrerasService.buscarCarrerasFiltros(null, orderBy, orderDir )
      .subscribe( (resp: CarreraModelo) => {
        this.listaCarreras = resp;
    });
  }

  listarDepartamentos() {
    var orderBy = "descripcion";
    var orderDir = "asc";

    this.departamentosService.buscarDepartamentosFiltros(null, orderBy, orderDir )
      .subscribe( (resp: DepartamentoModelo) => {
        this.listaDepartamentos = resp;
    });
  }

  listarDependencias() {
    var orderBy = "descripcion";
    var orderDir = "asc";

    this.dependenciasService.buscarDependenciasFiltros(null, orderBy, orderDir )
      .subscribe( (resp: DependenciaModelo) => {
        this.listaDependencias = resp;
    });
  }

  listarEstamentos() {
    var orderBy = "descripcion";
    var orderDir = "asc";

    this.estamentosService.buscarEstamentosFiltros(null, orderBy, orderDir )
      .subscribe( (resp: EstamentoModelo) => {
        this.listaEstamentos = resp;
    });
  }

  guardar(  ) {

    if ( this.pacienteForm.invalid ){
      return Object.values( this.pacienteForm.controls ).forEach( control => {
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
    
    this.paciente = this.pacienteForm.getRawValue();

    if ( this.paciente.pacienteId ) {
      this.paciente.personas.usuarioModificacion = 'admin';
      this.paciente.usuarioModificacion = 'admin';
      peticion = this.pacientesService.actualizarPaciente( this.paciente );
    } else {
      if(!this.paciente.personas.personaId){
        this.paciente.personas.usuarioCreacion = 'admin';
      }
      this.paciente.usuarioCreacion = 'admin';    
      peticion = this.pacientesService.crearPaciente( this.paciente );
    }

    peticion.subscribe( resp => {
      
      var mensajeUpload = '';
      if(this.selectedFiles){
        var cedula = resp.paciente.personas.cedula;
        this.currentFile = this.selectedFiles.item(0);
        var filename = cedula + '_'
                      + this.currentFile.name.split(".")[0] + this.currentFile.name.split(".")[1];
        var renameFile = new File([this.currentFile], filename, {type:this.currentFile.type});

        this.uploadService.upload2(renameFile, "I").subscribe(
          event => {
            mensajeUpload
          },
          err => {
            mensajeUpload = 'No se pudo subir el archivo!' + err.status +'. '+ this.obtenerError(err);
        });

        this.selectedFiles = undefined;
      }

      Swal.fire({
                icon: 'success',
                title: this.paciente.personas.nombres,
                text: resp.mensaje + '. '+ mensajeUpload
              }).then( resp => {

        if ( resp.value ) {
          if ( this.paciente.pacienteId ) {
            this.router.navigate(['/pacientes']);
          }else{
            this.limpiar();
          }
        }
      });
    }, e => {
          Swal.fire({
            icon: 'error',
            title: 'Algo salio mal',
            text:e.status +'. '+ this.obtenerError(e)
          })          
       }
    );
  }

  limpiar(){
    this.paciente = new PacienteModelo();
    this.pacienteForm.reset();
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

  get personaIdNoValido() {
    return this.pacienteForm.get('personas').get('personaId').invalid 
      && this.pacienteForm.get('personas').get('personaId').touched
  }

  get cedulaNoValido() {
    return this.pacienteForm.get('personas').get('cedula').invalid 
    && this.pacienteForm.get('personas').get('cedula').touched
  }

  get nombreNoValido() {
    return this.pacienteForm.get('personas').get('nombres').invalid 
    && this.pacienteForm.get('personas').get('nombres').touched
  }

  get apellidoNoValido() {
    return this.pacienteForm.get('personas').get('apellidos').invalid 
    && this.pacienteForm.get('personas').get('apellidos').touched
  }

  get correoNoValido() {
    return this.pacienteForm.get('personas').get('email').invalid 
    && this.pacienteForm.get('personas').get('email').touched
  }

  get grupoSanguineoNoValido() {
    return this.pacienteForm.get('grupoSanguineo').invalid 
    && this.pacienteForm.get('grupoSanguineo').touched
  }

  crearFormulario() {
    this.pacienteForm = this.fb.group({
      pacienteId  : [null, [] ],
      personas : this.fb.group({
        personaId  : [null, [] ],
        cedula  : [null, [ Validators.required, Validators.minLength(6) ]  ],
        nombres  : [null, [ Validators.required, Validators.minLength(5) ]  ],
        apellidos: [null, [Validators.required] ],
        fechaNacimiento: [null, [] ],
        edad: [null, [] ],
        direccion: [null, [] ],
        sexo: [null, [] ],
        estadoCivil: [null, [] ],
        nacionalidad: [null, [] ],
        telefono: [null, [] ],
        email  : [null, [ Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')] ],
        celular: [null, [] ],
        carreraId: [null, [] ],
        departamentoId: [null, [] ],
        dependenciaId: [null, [] ],
        estamentoId: [null, [] ], 
        fechaCreacion: [null, [] ],
        fechaModificacion: [null, [] ],
        usuarioCreacion: [null, [] ],
        usuarioModificacion: [null, [] ]   
      }),
      grupoSanguineo  : [null, [Validators.required] ],
      seguroMedico  : [null, [] ],
      fechaCreacion: [null, [] ],
      fechaModificacion: [null, [] ],
      usuarioCreacion: [null, [] ],
      usuarioModificacion: [null, [] ]            
    });

    this.pacienteForm.get('pacienteId').disable();
    this.pacienteForm.get('personas').get('fechaCreacion').disable();
    this.pacienteForm.get('personas').get('fechaModificacion').disable();
    this.pacienteForm.get('personas').get('usuarioCreacion').disable();
    this.pacienteForm.get('personas').get('usuarioModificacion').disable();

    this.pacienteForm.get('fechaCreacion').disable();
    this.pacienteForm.get('fechaModificacion').disable();
    this.pacienteForm.get('usuarioCreacion').disable();
    this.pacienteForm.get('usuarioModificacion').disable();
  }
}
