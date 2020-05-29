import { Component, OnInit } from '@angular/core';
import { FuncionariosService } from '../../../servicios/funcionarios.service';
import { FuncionarioModelo } from '../../../modelos/funcionario.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.css']
})
export class FuncionariosComponent implements OnInit {

  funcionarios: FuncionarioModelo[] = [];
  persona: PersonaModelo = new PersonaModelo();
  buscador: FuncionarioModelo = new FuncionarioModelo();
  cargando = false;


  constructor( private funcionariosService: FuncionariosService) { }

  ngOnInit() {

    this.cargando = true;
    this.funcionariosService.buscarFuncionariosFiltros(null)
      .subscribe( resp => {
        this.funcionarios = resp;
        this.cargando = false;
      });

  }

  buscadorFuncionarios() {
    this.buscador.personas = this.persona;
    this.funcionariosService.buscarFuncionariosFiltros(this.buscador)
    .subscribe( resp => {
      this.funcionarios = resp;
      this.cargando = false;
    }, e => {
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.error.mensaje,
      })
    });
  }

  limpiar() {
    this.buscador = new FuncionarioModelo();
    this.persona = new PersonaModelo();   
    this.buscadorFuncionarios();
  }

  borrarFuncionario( funcionario: FuncionarioModelo ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ funcionario.personas.nombres }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        let peticion: Observable<any>;
        peticion = this.funcionariosService.borrarFuncionario( funcionario.funcionarioId );

        peticion.subscribe( resp => {
          Swal.fire({
                    icon: 'info',
                    title: funcionario.personas.nombres,
                    text: resp.mensaje,
                  }).then( resp => {
            if ( resp.value ) {
              this.ngOnInit();
            }
          });
        }, e => {
                Swal.fire({
                  icon: 'error',
                  title: 'Algo salio mal',
                  text: e.status +'. '+e.error.errors[0],
                })
            }
        );
      }

    });
  }
}
