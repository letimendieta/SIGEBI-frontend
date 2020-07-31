import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { PersonaModelo } from '../../../modelos/persona.modelo';
import { ParametroModelo } from '../../../modelos/parametro.modelo';
import { CarreraModelo } from '../../../modelos/carrera.modelo';
import { DepartamentoModelo } from '../../../modelos/departamento.modelo';
import { DependenciaModelo } from '../../../modelos/dependencia.modelo';
import { EstamentoModelo } from '../../../modelos/estamento.modelo';

import { PersonasService } from '../../../servicios/personas.service';
import { ParametrosService } from '../../../servicios/parametros.service';
import { CarrerasService } from '../../../servicios/carreras.service';
import { DepartamentosService } from '../../../servicios/departamentos.service';
import { DependenciasService } from '../../../servicios/dependencias.service';
import { EstamentosService } from '../../../servicios/estamentos.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {
  crear = false;
  personaForm: FormGroup;

  persona: PersonaModelo = new PersonaModelo();
  listaEstadoCivil: ParametroModelo;
  listaSexo: ParametroModelo;
  listaNacionalidad: ParametroModelo;
  listaCarreras: CarreraModelo;
  listaDepartamentos: DepartamentoModelo;
  listaDependencias: DependenciaModelo;
  listaEstamentos: EstamentoModelo;

  constructor( private personasService: PersonasService,
               private parametrosService: ParametrosService,
               private carrerasService: CarrerasService,
               private departamentosService: DepartamentosService,
               private dependenciasService: DependenciasService,
               private estamentosService: EstamentosService,
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
      
      this.personasService.getPersona( Number(id) )
        .subscribe( (resp: PersonaModelo) => {
          this.personaForm.patchValue(resp);
        });
    }else{
      this.crear = true;
    }
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

  guardar( ) {

    if ( this.personaForm.invalid ) {

      return Object.values( this.personaForm.controls ).forEach( control => {

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
    this.persona = this.personaForm.getRawValue();

    if ( this.persona.personaId ) {
      //Modificar
      this.persona.usuarioModificacion = 'admin';
      peticion = this.personasService.actualizarPersona( this.persona );
    } else {
      //Agregar
      this.persona.usuarioCreacion = 'admin';
      peticion = this.personasService.crearPersona( this.persona );
    }

    peticion.subscribe( resp => {

      Swal.fire({
                icon: 'success',
                title: this.persona.nombres,
                text: resp.mensaje,
              }).then( resp => {

        if ( resp.value ) {
          if ( this.persona.personaId ) {
            //volver a la lista de personas
          }else{
            this.limpiar();
          }
        }
      });
    }, e => {Swal.fire({
              icon: 'error',
              title: 'Algo salio mal',
              text: e.status +'. ',
            })
       }
    );
  }

  limpiar(){
    this.persona = new PersonaModelo();
    this.personaForm.reset();
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

  get cedulaNoValido() {
    return this.personaForm.get('cedula').invalid && this.personaForm.get('cedula').touched
  }

  get nombreNoValido() {
    return this.personaForm.get('nombres').invalid && this.personaForm.get('nombres').touched
  }

  get apellidoNoValido() {
    return this.personaForm.get('apellidos').invalid && this.personaForm.get('apellidos').touched
  }

  get correoNoValido() {
    return this.personaForm.get('email').invalid && this.personaForm.get('email').touched
  }

  crearFormulario() {

    this.personaForm = this.fb.group({
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
      usuarioModificacion: [null, [] ],   
    });

    this.personaForm.get('personaId').disable();

    this.personaForm.get('fechaCreacion').disable();
    this.personaForm.get('fechaModificacion').disable();
    this.personaForm.get('usuarioCreacion').disable();
    this.personaForm.get('usuarioModificacion').disable();    
  }

}
