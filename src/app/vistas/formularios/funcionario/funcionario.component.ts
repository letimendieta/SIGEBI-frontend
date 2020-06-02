import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

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
  persona: PersonaModelo = new PersonaModelo();
  listaEstadoCivil: ParametroModelo;
  listaSexo: ParametroModelo;
  listaNacionalidad: ParametroModelo;

  constructor( private funcionariosService: FuncionariosService,
               private parametrosService: ParametrosService,
               private route: ActivatedRoute ) { }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');
    this.obtenerParametros();

    if ( id !== 'nuevo' ) {
      this.funcionariosService.getFuncionario( Number(id) )
        .subscribe( (resp: FuncionarioModelo) => {
          this.funcionario = resp;
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

    this.funcionariosService.getPersona( id )
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

    if ( this.funcionario.funcionarioId ) {
      this.persona.usuarioModificacion = 'admin';
      this.funcionario.personas = this.persona;
      this.funcionario.usuarioModificacion = 'admin';
      peticion = this.funcionariosService.actualizarFuncionario( this.funcionario );
    } else {
      this.persona.usuarioCreacion = 'admin';
      this.funcionario.personas = this.persona;
      this.funcionario.usuarioCreacion = 'admin';
      peticion = this.funcionariosService.crearFuncionario( this.funcionario );
    }

    peticion.subscribe( resp => {

      Swal.fire({
                icon: 'info',
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
    this.funcionario = new FuncionarioModelo();
    this.persona = new PersonaModelo();
  }
}
