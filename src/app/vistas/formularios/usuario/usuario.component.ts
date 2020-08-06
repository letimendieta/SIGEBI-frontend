import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario2Modelo } from '../../../modelos/usuario2.modelo';
import { ParametroModelo } from '../../../modelos/parametro.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import { FuncionarioModelo } from '../../../modelos/funcionario.modelo';

import { UsuariosService } from '../../../servicios/usuarios.service';
import { FuncionariosService } from '../../../servicios/funcionarios.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  crear = false;
  usuario: Usuario2Modelo = new Usuario2Modelo();
  persona: PersonaModelo = new PersonaModelo();
  listaEstadoCivil: ParametroModelo;
  listaSexo: ParametroModelo;
  listaNacionalidad: ParametroModelo;
  
  usuarioForm: FormGroup;

  constructor( private usuariosService: UsuariosService,
               private funcionariosService: FuncionariosService,
               private route: ActivatedRoute,
               private router: Router,
               private fb: FormBuilder ) { 
    this.crearFormulario();
  }              

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    if ( id !== 'nuevo' ) {
      this.usuariosService.getUsuario( Number(id) )
        .subscribe( (resp: Usuario2Modelo) => {
          this.usuarioForm.patchValue(resp);
        });
    }else{
      this.crear = true;
    }
  }

  obtenerFuncionario( ){
    var id = this.usuarioForm.get('funcionarios').get('funcionarioId').value;
    this.funcionariosService.getFuncionario( id )
        .subscribe( (resp: FuncionarioModelo) => {
          this.usuarioForm.get('funcionarios').patchValue(resp);
          this.usuarioForm.get('personas').patchValue(resp.personas);
          if(resp.funcionarioId){
            this.usuarioForm.get('personas').get('personaId').disable();
          }
        }, e => {
            Swal.fire({
              icon: 'info',
              text: e.status +'. '+ this.obtenerError(e),
            })
          }
        );
  }

  obtenerPersona( ){
    var id = this.usuarioForm.get('personas').get('personaId').value;
    this.usuariosService.getPersona( id )
      .subscribe( (resp: PersonaModelo) => {
        this.usuarioForm.get('personas').patchValue(resp);
      }, e => {
          Swal.fire({
            icon: 'info',
            text: e.status +'. '+ this.obtenerError(e),
          })
          this.usuarioForm.get('personas').get('personaId').setValue(null);
        }
      );
  }
  
  guardar( ) {

    if ( this.usuarioForm.invalid ){
      return Object.values( this.usuarioForm.controls ).forEach( control => {
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
    
    this.usuario = this.usuarioForm.getRawValue();

    if ( this.usuario.usuarioId ) {
      this.usuario.usuarioModificacion = 'admin';
      peticion = this.usuariosService.actualizarUsuario( this.usuario );
    } else {
      this.usuario.usuarioCreacion = 'admin';
      peticion = this.usuariosService.crearUsuario( this.usuario );
    }

    peticion.subscribe( resp => {

      Swal.fire({
                icon: 'success',
                title: this.usuario.codigoUsuario,
                text: resp.mensaje,
              }).then( resp => {

        if ( resp.value ) {
          if ( this.usuario.usuarioId ) {
            this.router.navigate(['/usuarios']);
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
    this.usuarioForm.reset();
    this.usuarioForm.get('personas').get('personaId').enable();
    this.usuario = new Usuario2Modelo();
    this.usuarioForm.get('estado').setValue('A');
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
    return this.usuarioForm.get('personas').get('personaId').invalid 
      && this.usuarioForm.get('personas').get('personaId').touched
  }

  get usuarioNoValido() {
    return this.usuarioForm.get('codigoUsuario').invalid 
      && this.usuarioForm.get('codigoUsuario').touched
  }

  get passNoValido() {
    return this.usuarioForm.get('password').invalid 
      && this.usuarioForm.get('password').touched
  }

  get estadoNoValido() {
    return this.usuarioForm.get('estado').invalid 
      && this.usuarioForm.get('estado').touched
  }

  crearFormulario() {
    this.usuarioForm = this.fb.group({
      usuarioId  : [null, [] ],
      funcionarios : this.fb.group({
        funcionarioId  : [null, [] ],
        areaId : [null, [] ],
        estado : [null, [] ]
      }),
      personas : this.fb.group({
        personaId : [null, [Validators.required] ],
        cedula : [null, [] ],
        nombres : [null, [] ],
        apellidos : [null, [] ]
      }),      
      codigoUsuario : [null, [Validators.required] ],
      password : [null, [Validators.required] ],
      estado : [null, [Validators.required] ],
      fechaCreacion: [null, [] ],
      fechaModificacion: [null, [] ],
      usuarioCreacion: [null, [] ],
      usuarioModificacion: [null, [] ],             
    });

    this.usuarioForm.get('usuarioId').disable();
    this.usuarioForm.get('funcionarios').get('areaId').disable();
    this.usuarioForm.get('funcionarios').get('estado').disable();

    this.usuarioForm.get('personas').get('cedula').disable();
    this.usuarioForm.get('personas').get('nombres').disable();
    this.usuarioForm.get('personas').get('apellidos').disable();

    this.usuarioForm.get('fechaCreacion').disable();
    this.usuarioForm.get('fechaModificacion').disable();
    this.usuarioForm.get('usuarioCreacion').disable();
    this.usuarioForm.get('usuarioModificacion').disable();
  }
}
