import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario2Modelo } from '../../../modelos/usuario2.modelo';
import { ParametroModelo } from '../../../modelos/parametro.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import { FuncionarioModelo } from '../../../modelos/funcionario.modelo';
import { AreaModelo } from '../../../modelos/area.modelo';
import { AreasService } from '../../../servicios/areas.service';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { FuncionariosService } from '../../../servicios/funcionarios.service';
import { PersonasService } from '../../../servicios/personas.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComunesService } from 'src/app/servicios/comunes.service';
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
  personas: PersonaModelo[] = [];
  funcionarios: FuncionarioModelo[] = [];
  listaEstadoCivil: ParametroModelo;
  listaSexo: ParametroModelo;
  listaNacionalidad: ParametroModelo;
  listaAreas: AreaModelo;
  usuarioForm: FormGroup;
  buscadorPersonasForm: FormGroup;
  buscadorFuncionariosForm: FormGroup;
  alert:boolean=false;
  alertGuardar:boolean=false;
  dtOptions: any = {};
  cargando = false;

  constructor( private usuariosService: UsuariosService,
               private funcionariosService: FuncionariosService,
               private personasService: PersonasService,
               private areasService: AreasService,
               private route: ActivatedRoute,
               private router: Router,
               private comunes: ComunesService,
               private fb: FormBuilder,
               private fb2: FormBuilder,
               private fb3: FormBuilder,
               private modalService: NgbModal  ) { 
    this.crearFormulario();
  }              

  ngOnInit() {
    this.listarAreas();
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

  listarAreas() {
    var orderBy = "descripcion";
    var orderDir = "asc";
    var area = new AreaModelo();
    area.estado = "A";

    this.areasService.buscarAreasFiltros(area, orderBy, orderDir )
      .subscribe( (resp: AreaModelo) => {
        this.listaAreas = resp;
    });
  }

  obtenerFuncionario( event ){
    event.preventDefault();
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
              text: e.status +'. '+ this.comunes.obtenerError(e),
            })
          }
        );
  }

  obtenerPersona( event ){
    event.preventDefault();
    var id = this.usuarioForm.get('personas').get('personaId').value;
    this.usuariosService.getPersona( id )
      .subscribe( (resp: PersonaModelo) => {
        this.usuarioForm.get('personas').patchValue(resp);
      }, e => {
          Swal.fire({
            icon: 'info',
            text: e.status +'. '+ this.comunes.obtenerError(e),
          })
          this.usuarioForm.get('personas').get('personaId').setValue(null);
        }
      );
  }
  
  guardar( ) {

    if ( this.usuarioForm.invalid ){
      this.alertGuardar = true;
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

    if ( this.usuario.id ) {
      this.usuario.usuarioModificacion = 'admin';
      peticion = this.usuariosService.actualizarUsuario( this.usuario );
    } else {
      this.usuario.usuarioCreacion = 'admin';
      peticion = this.usuariosService.crearUsuario( this.usuario );
    }

    peticion.subscribe( resp => {

      Swal.fire({
                icon: 'success',
                title: this.usuario.nombreUsuario ? this.usuario.nombreUsuario.toString() : '',
                text: resp.mensaje,
              }).then( resp => {

        if ( resp.value ) {
          if ( this.usuario.id ) {
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
          text: e.status +'. '+ this.comunes.obtenerError(e),
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

    this.buscadorPersonasForm = this.fb2.group({
      personaId  : ['', [] ],
      cedula  : ['', [] ],
      nombres  : ['', [] ],
      apellidos: ['', [] ]   
    });

    this.buscadorFuncionariosForm = this.fb3.group({
      funcionarioId  : ['', [] ],
      cedula  : ['', [] ],
      nombres  : ['', [] ],
      apellidos: ['', [] ]   
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



  buscadorPersonas(event) {
    event.preventDefault();
    
    var persona: PersonaModelo = new PersonaModelo();

    persona.cedula = this.buscadorPersonasForm.get('cedula').value;
    persona.nombres = this.buscadorPersonasForm.get('nombres').value;
    persona.apellidos = this.buscadorPersonasForm.get('apellidos').value;

    if(!persona.cedula 
      && !persona.nombres && !persona.apellidos){
      this.alert=true;
      return;
    }
    this.cargando = true;
    this.personasService.buscarPersonasFiltros(persona)
    .subscribe( resp => {
      this.personas = resp;
      this.cargando = false;
    }, e => {
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
      this.cargando = false;
    });
  }

  buscadorFuncionarios(event) {
    event.preventDefault();
    var persona: PersonaModelo = new PersonaModelo();
    var buscador: FuncionarioModelo = new FuncionarioModelo();

    persona.cedula = this.buscadorFuncionariosForm.get('cedula').value;
    persona.nombres = this.buscadorFuncionariosForm.get('nombres').value;
    persona.apellidos = this.buscadorFuncionariosForm.get('apellidos').value;
    buscador.personas = persona;
    buscador.funcionarioId = this.buscadorFuncionariosForm.get('funcionarioId').value;    
    this.funcionariosService.buscarFuncionariosFiltros(buscador)
    .subscribe( resp => {
      this.funcionarios = resp;
      this.cargando = false;
    }, e => {
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
      this.cargando = false;
    });
  }

  limpiarModalPersonas(event) {
    event.preventDefault();
    this.buscadorPersonasForm.reset();
    this.personas = [];
  }

  limpiarModalFuncionarios(event) {
    event.preventDefault();
    this.buscadorFuncionariosForm.reset();
    this.funcionarios = [];
  }

  cerrarAlert(){
    this.alert=false;
  }

  crearTablaModelpersonas(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [[5,10,15,20,50,-1],[5,10,15,20,50,"Todos"]],
      language: {
        "lengthMenu": "Mostrar _MENU_ registros",
        "zeroRecords": "No se encontraron resultados",
        "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "infoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sSearch": "Buscar:",
        "oPaginate": {
          "sFirst": "Primero",
          "sLast":"Último",
          "sNext":"Siguiente",
          "sPrevious": "Anterior"
        },
        "sProcessing":"Procesando...",
      },     
      searching: false,
      processing: true,
      columns: [ { data: 'personaId' }, { data: 'cedula' }, 
      { data: 'nombres' }, { data: 'apellidos' }]      
    };
  }

  crearTablaModelFuncionarios(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [[5,10,15,20,50,-1],[5,10,15,20,50,"Todos"]],
      language: {
        "lengthMenu": "Mostrar _MENU_ registros",
        "zeroRecords": "No se encontraron resultados",
        "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "infoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sSearch": "Buscar:",
        "oPaginate": {
          "sFirst": "Primero",
          "sLast":"Último",
          "sNext":"Siguiente",
          "sPrevious": "Anterior"
        },
        "sProcessing":"Procesando...",
      },     
      searching: false,
      processing: true,
      columns: [ { data: 'funcionarioId' }, { data: 'cedula' }, 
      { data: 'nombres' }, { data: 'apellidos' }]      
    };
  }

  openModalPersonas(targetModal) {
    this.modalService.open(targetModal, {
     centered: true,
     backdrop: 'static',
     size: 'lg'
    });
   
    this.buscadorPersonasForm.patchValue({
      personaId: '',
      cedula: '',
      nombres: '',
      apellidos: ''
    });
    this.personas = [];
    this.alert=false;
  }

  openModalFuncionarios(targetModal) {
    this.modalService.open(targetModal, {
     centered: true,
     backdrop: 'static',
     size: 'lg'
    });
   
    this.buscadorFuncionariosForm.patchValue({
      funcionarioId: '',
      cedula: '',
      nombres: '',
      apellidos: ''
    });
    this.funcionarios = [];
    this.alert=false;
  }

  selectPersona(event, persona: PersonaModelo){
    this.modalService.dismissAll();
    if(persona.personaId){
      this.usuarioForm.get('personas').get('personaId').setValue(persona.personaId);
    }
    this.personasService.getPersona( persona.personaId )
      .subscribe( (resp: PersonaModelo) => {         
        this.usuarioForm.get('personas').patchValue(resp);
      }, e => {
          Swal.fire({
            icon: 'info',
            text: e.status +'. '+ this.comunes.obtenerError(e)
          })
          this.usuarioForm.get('personas').get('personaId').setValue(null);
        }
      );
  }

  selectFuncionario(event, funcionario: FuncionarioModelo){
    this.modalService.dismissAll();
    if(funcionario.funcionarioId){
      this.usuarioForm.get('funcionarios').get('funcionarioId').setValue(funcionario.funcionarioId);
    }
    this.funcionariosService.getFuncionario( funcionario.funcionarioId )
      .subscribe( (resp: FuncionarioModelo) => {         
        this.usuarioForm.get('funcionarios').patchValue(resp);
      }, e => {
          Swal.fire({
            icon: 'info',
            text: e.status +'. '+ this.comunes.obtenerError(e)
          })
          this.usuarioForm.get('funcionarios').get('funcionarioId').setValue(null);
        }
      );
  }

  onSubmit() {
    this.modalService.dismissAll();
  }

  cerrarAlertGuardar(){
    this.alertGuardar=false;
  }
}
