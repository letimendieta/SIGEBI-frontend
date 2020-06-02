import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

import { PersonaModelo } from '../../../modelos/persona.modelo';
import { ParametroModelo } from '../../../modelos/parametro.modelo';

import { PersonasService } from '../../../servicios/personas.service';
import { ParametrosService } from '../../../servicios/parametros.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {
  crear = false;
  persona: PersonaModelo = new PersonaModelo();
  listaEstadoCivil: ParametroModelo;
  listaSexo: ParametroModelo;
  listaNacionalidad: ParametroModelo;

  constructor( private personasService: PersonasService,
               private parametrosService: ParametrosService,
               private route: ActivatedRoute 
               ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.obtenerParametros();

    if ( id !== 'nuevo' ) {
      
      this.personasService.getPersona( Number(id) )
        .subscribe( (resp: PersonaModelo) => {
          this.persona = resp;
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
                icon: 'info',
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
              text: e.status +'. '+e.error.errors[0],
            })
       }
    );
  }

  limpiar(){
    this.persona = new PersonaModelo();
  }
}
