import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { Usuario2Modelo } from '../../../modelos/usuario2.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario2Modelo[] = [];
  persona: PersonaModelo = new PersonaModelo();
  buscador: Usuario2Modelo = new Usuario2Modelo();
  buscadorForm: FormGroup;
  cargando = false;


  constructor( private usuariosService: UsuariosService,
    private fb: FormBuilder ) { 
  this.crearFormulario();
  }
  ngOnInit() {

    this.cargando = true;
    this.usuariosService.buscarUsuariosFiltros(null)
      .subscribe( resp => {
        this.usuarios = resp;
        this.cargando = false;
      }, e => {      
        Swal.fire({
          icon: 'info',
          title: 'Algo salio mal',
          text: e.status +'. '+ this.obtenerError(e),
        })
        this.cargando = false;
      });
  }

  buscadorUsuarios() {
    this.persona.cedula = this.buscadorForm.get('cedula').value;
    this.persona.nombres = this.buscadorForm.get('nombres').value;
    this.persona.apellidos = this.buscadorForm.get('apellidos').value;
    this.buscador.personas = this.persona;
    this.buscador.usuarioId = this.buscadorForm.get('usuarioId').value;
    this.buscador.codigoUsuario = this.buscadorForm.get('codigoUsuario').value;
    this.usuariosService.buscarUsuariosFiltros(this.buscador)
    .subscribe( resp => {
      this.usuarios = resp;
      this.cargando = false;
    }, e => {
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.obtenerError(e),
      })
    });
  }

  limpiar() {
    this.buscadorForm.reset();
    this.buscador = new Usuario2Modelo();
    this.persona = new PersonaModelo();   
    this.buscadorUsuarios();
  }

  borrarUsuario( usuario: Usuario2Modelo ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ usuario.codigoUsuario }`,
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
                    title: usuario.codigoUsuario,
                    text: resp.mensaje,
                  }).then( resp => {
            if ( resp.value ) {
              this.ngOnInit();
            }
          });
        }, e => {            
            Swal.fire({
              icon: 'info',
              title: 'Algo salio mal',
              text: e.status +'. '+ this.obtenerError(e),
            })
          }
        );
      }
    });
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

  crearFormulario() {

    this.buscadorForm = this.fb.group({
      usuarioId  : ['', [] ],
      codigoUsuario  : ['', [] ],
      cedula  : ['', [] ],
      nombres  : ['', [] ],
      apellidos: ['', [] ],
      estado: [null, [] ]
    });
  }
}
