import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { FuncionarioModelo } from '../../../modelos/funcionario.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import { ParametroModelo } from '../../../modelos/parametro.modelo';

import { FuncionariosService } from '../../../servicios/funcionarios.service';
import { ParametrosService } from '../../../servicios/parametros.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.css']
})
export class FuncionarioComponent implements OnInit {
  crear = false;
  funcionario: FuncionarioModelo = new FuncionarioModelo();
  listaEstadoCivil: ParametroModelo;
  listaSexo: ParametroModelo;
  listaNacionalidad: ParametroModelo;

  funcionarioForm: FormGroup;

  constructor( private funcionariosService: FuncionariosService,
               private parametrosService: ParametrosService,
               private route: ActivatedRoute,
               private fb: FormBuilder ) { 
    this.crearFormulario();
  } 

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');
    this.obtenerParametros();

    if ( id !== 'nuevo' ) {
      this.funcionariosService.getFuncionario( Number(id) )
        .subscribe( (resp: FuncionarioModelo) => {
          this.funcionarioForm.patchValue(resp);
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

  obtenerPersona( ){
    var id = this.funcionarioForm.get('personas').get('personaId').value;
    this.funcionariosService.getPersona( id )
      .subscribe( (resp: PersonaModelo) => {
        this.funcionarioForm.get('personas').patchValue(resp);
      }, e => {
          Swal.fire({
            icon: 'info',
            text: e.status +'. '+ this.obtenerError(e),
          })
          this.funcionarioForm.get('personas').get('personaId').setValue(null);
        }
      );
  }
  
  guardar( ) {

    if ( this.funcionarioForm.invalid ){
      return Object.values( this.funcionarioForm.controls ).forEach( control => {
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
    
    this.funcionario = this.funcionarioForm.getRawValue();

    if ( this.funcionario.funcionarioId ) {
      this.funcionario.personas.usuarioModificacion = 'admin';
      this.funcionario.usuarioModificacion = 'admin';
      peticion = this.funcionariosService.actualizarFuncionario( this.funcionario );
    } else {
      if(!this.funcionario.personas.personaId){
        this.funcionario.personas.usuarioCreacion = 'admin';
      }
      this.funcionario.usuarioCreacion = 'admin';
      peticion = this.funcionariosService.crearFuncionario( this.funcionario );
    }

    peticion.subscribe( resp => {

      Swal.fire({
                icon: 'success',
                title: this.funcionario.personas.nombres,
                text: resp.mensaje,
              }).then( resp => {

        if ( resp.value ) {
          if ( this.funcionario.funcionarioId ) {
            //volver a la lista de funcionarios
          }else{
            this.limpiar();
          }
        }
      });
    }, e => {
        Swal.fire({
          icon: 'error',
          title: 'Algo salio mal',
          text: e.status +'. '+ this.obtenerError(e),
        })          
       }
    );
  }

  limpiar(){
    this.funcionario = new FuncionarioModelo();
    this.funcionarioForm.reset();
    this.funcionarioForm.get('estado').setValue('A');
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

  get personaIdNoValido() {
    return this.funcionarioForm.get('personas').get('personaId').invalid 
      && this.funcionarioForm.get('personas').get('personaId').touched
  }

  get areaNoValido() {
    return this.funcionarioForm.get('areaId').invalid && this.funcionarioForm.get('areaId').touched
  }

  crearFormulario() {
    this.funcionarioForm = this.fb.group({
      funcionarioId  : [null, [] ],
      personas : this.fb.group({
        personaId  : [null, [] ],
        cedula  : [null, [ Validators.required, Validators.minLength(6) ]  ],
        nombres  : [null, [ Validators.required, Validators.minLength(5) ]  ],
        apellidos: [null, [Validators.required] ]       
      }),
      areaId  : [null, [ Validators.required] ],
      estado  : [null, [] ],
      fechaIngreso  : [null, [] ],
      fechaEgreso  : [null, [] ],
      fechaCreacion: [null, [] ],
      fechaModificacion: [null, [] ],
      usuarioCreacion: [null, [] ],
      usuarioModificacion: [null, [] ],             
    });

    this.funcionarioForm.get('funcionarioId').disable();
    this.funcionarioForm.get('personas').get('cedula').disable();
    this.funcionarioForm.get('personas').get('nombres').disable();
    this.funcionarioForm.get('personas').get('apellidos').disable();

    this.funcionarioForm.get('fechaCreacion').disable();
    this.funcionarioForm.get('fechaModificacion').disable();
    this.funcionarioForm.get('usuarioCreacion').disable();
    this.funcionarioForm.get('usuarioModificacion').disable();
  }
}
