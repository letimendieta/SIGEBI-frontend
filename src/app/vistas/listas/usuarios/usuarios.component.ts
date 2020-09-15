import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { Usuario2Modelo } from '../../../modelos/usuario2.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  dtOptions: DataTables.Settings = {};

  usuarios: Usuario2Modelo[] = [];
  persona: PersonaModelo = new PersonaModelo();
  buscador: Usuario2Modelo = new Usuario2Modelo();
  buscadorForm: FormGroup;
  cargando = false;


  constructor( private usuariosService: UsuariosService,
    private fb: FormBuilder ) {    
  }
  ngOnInit() {
    this.crearFormulario();
    this.crearTabla();
  }

  crearTabla(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [[5,10,15,20,50,-1],[5,10,15,20,50,"Todos"]],
      searching: false,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
      },
      processing: true,
      columns: [
        {data:'#'},
        {data:'usuarioId'}, {data:'codigoUsuario'}, {data:'personas.personaId'},
        {data:'funcionarios.funcionarioId'}, {data:'personas.cedula'}, {data:'personas.nombres'},
        {data:'personas.apellido'}, {data:'estado'},
        {data:'Editar'},
        {data:'Borrar'}
      ]
    };
  }

  buscadorUsuarios(event) {
    event.preventDefault();
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
        text: e.status +'. '+ this.obtenerError(e)
      })
      this.cargando = false;
    });
  }

  limpiar(event) {
    event.preventDefault();
    this.buscadorForm.reset();
    this.buscador = new Usuario2Modelo();
    this.persona = new PersonaModelo();   
    this.usuarios = [];
  }

  borrarUsuario(event, usuario: Usuario2Modelo ) {

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
              text: e.status +'. '+ this.obtenerError(e)
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
