import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

import { UsuarioModelo } from '../../../modelos/usuario.modelo';
import { ParametroModelo } from '../../../modelos/parametro.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';

import { UsuariosService } from '../../../servicios/usuarios.service';
import { ParametrosService } from '../../../servicios/parametros.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  crear = false;
  usuario: UsuarioModelo = new UsuarioModelo();
  persona: PersonaModelo = new PersonaModelo();
  listaEstadoCivil: ParametroModelo;
  listaSexo: ParametroModelo;
  listaNacionalidad: ParametroModelo;

  modificar: boolean = false;


  constructor( private usuariosService: UsuariosService,
               private parametrosService: ParametrosService,
               private route: ActivatedRoute ) { }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');
    this.obtenerParametros();

    if ( id !== 'nuevo' ) {
      this.usuariosService.getUsuario( Number(id) )
        .subscribe( (resp: UsuarioModelo) => {
          this.usuario = resp;
          this.persona = resp.personas;
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

  obtenerPersona( id : number ){

    this.usuariosService.getPersona( id )
        .subscribe( (resp: PersonaModelo) => {
          this.persona = resp;
        }, e => {
            Swal.fire({
              icon: 'info',
              //title: 'Algo salio mal',
              text: e.status +'. '+e.error.mensaje,
            })
          }
        );

  }
  
  guardar( form: NgForm ) {

    if ( form.invalid ) {
      console.log('Formulario no válido');
      return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    let peticion: Observable<any>;       

    if ( this.usuario.usuarioId ) {
      this.persona.usuarioModificacion = 'admin';
      this.usuario.personas = this.persona;
      this.usuario.usuarioModificacion = 'admin';
      peticion = this.usuariosService.actualizarUsuario( this.usuario );
    } else {
      this.persona.usuarioCreacion = 'admin';
      this.usuario.personas = this.persona;
      this.usuario.usuarioCreacion = 'admin';
      peticion = this.usuariosService.crearUsuario( this.usuario );
    }

    peticion.subscribe( resp => {

      Swal.fire({
                icon: 'success',
                title: this.usuario.personas.nombres,
                text: resp.mensaje,
              }).then( resp => {

        if ( resp.value ) {
          if ( this.usuario.usuarioId ) {
            //volver a la lista de usuarios
          }else{
            this.limpiar();
          }
        }

      });
    }, e => {
          var mensaje = "";
          if(e.status != 500){
            mensaje = e.status +'. '+e.error.errors[0];
          }else{
            mensaje = e.status +'. '+ e.error.mensaje +'. '+ e.error.error;
          }
            Swal.fire({
              icon: 'error',
              title: 'Algo salio mal',
              text: mensaje,
            })
          
       }
    );
  }

  limpiar(){
    this.usuario = new UsuarioModelo();
    this.persona = new PersonaModelo();
  }
}
