import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

import { FuncionarioModelo } from '../../../modelos/funcionario.modelo';
import { FuncionariosService } from '../../../servicios/funcionarios.service';

import { PersonaModelo } from '../../../modelos/persona.modelo';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.css']
})
export class FuncionarioComponent implements OnInit {

  funcionario: FuncionarioModelo = new FuncionarioModelo();
  persona: PersonaModelo = new PersonaModelo();

  modificar: boolean = false;


  constructor( private funcionariosService: FuncionariosService,
               private route: ActivatedRoute ) { }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    if ( id !== 'nuevo' ) {
      //this.modificar = true;
      this.funcionariosService.getFuncionario( Number(id) )
        .subscribe( (resp: FuncionarioModelo) => {
          this.funcionario = resp;
          this.persona = resp.personas;
        });
    }
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
