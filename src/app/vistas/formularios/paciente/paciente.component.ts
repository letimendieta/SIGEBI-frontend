import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

import { PacienteModelo } from '../../../modelos/paciente.modelo';
import { ParametroModelo } from '../../../modelos/parametro.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';

import { PacientesService } from '../../../servicios/pacientes.service';
import { ParametrosService } from '../../../servicios/parametros.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {
  crear = false;
  paciente: PacienteModelo = new PacienteModelo();
  persona: PersonaModelo = new PersonaModelo();
  listaEstadoCivil: ParametroModelo;
  listaSexo: ParametroModelo;
  listaNacionalidad: ParametroModelo;

  modificar: boolean = false;


  constructor( private pacientesService: PacientesService,
               private parametrosService: ParametrosService,
               private route: ActivatedRoute ) { }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');
    this.obtenerParametros();

    if ( id !== 'nuevo' ) {
      this.pacientesService.getPaciente( Number(id) )
        .subscribe( (resp: PacienteModelo) => {
          this.paciente = resp;
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

    this.pacientesService.getPersona( id )
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

    if ( this.paciente.pacienteId ) {
      this.persona.usuarioModificacion = 'admin';
      this.paciente.personas = this.persona;
      this.paciente.usuarioModificacion = 'admin';
      peticion = this.pacientesService.actualizarPaciente( this.paciente );
    } else {
      this.persona.usuarioCreacion = 'admin';
      this.paciente.personas = this.persona;
      this.paciente.usuarioCreacion = 'admin';
      peticion = this.pacientesService.crearPaciente( this.paciente );
    }

    peticion.subscribe( resp => {

      Swal.fire({
                icon: 'info',
                title: this.paciente.personas.nombres,
                text: resp.mensaje,
              }).then( resp => {

        if ( resp.value ) {
          if ( this.paciente.pacienteId ) {
            //volver a la lista de pacientes
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
    this.paciente = new PacienteModelo();
    this.persona = new PersonaModelo();
  }
}
