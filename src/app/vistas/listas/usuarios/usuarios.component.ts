import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { UsuarioModelo } from '../../../modelos/usuario.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: UsuarioModelo[] = [];
  persona: PersonaModelo = new PersonaModelo();
  buscador: UsuarioModelo = new UsuarioModelo();
  cargando = false;


  constructor( private usuariosService: UsuariosService) { }

  ngOnInit() {

    this.cargando = true;
    this.usuariosService.buscarUsuariosFiltros(null)
      .subscribe( resp => {
        this.usuarios = resp;
        this.cargando = false;
      });

  }

  buscadorUsuarios() {
    this.buscador.personas = this.persona;
    this.usuariosService.buscarUsuariosFiltros(this.buscador)
    .subscribe( resp => {
      this.usuarios = resp;
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
    this.buscador = new UsuarioModelo();
    this.persona = new PersonaModelo();   
    this.buscadorUsuarios();
  }

  borrarUsuario( usuario: UsuarioModelo ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ usuario.personas.nombres }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        let peticion: Observable<any>;
        peticion = this.usuariosService.borrarUsuario( usuario.usuarioId );

        peticion.subscribe( resp => {
          Swal.fire({
                    icon: 'success',
                    title: usuario.personas.nombres,
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
