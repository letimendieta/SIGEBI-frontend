import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FuncionarioModelo } from '../../../modelos/funcionario.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import { PersonasService } from '../../../servicios/personas.service';
import { AreaModelo } from '../../../modelos/area.modelo';
import { FuncionariosService } from '../../../servicios/funcionarios.service';
import { AreasService } from '../../../servicios/areas.service';
import { PacientesService } from '../../../servicios/pacientes.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.css']
})
export class FuncionarioComponent implements OnInit {
  crear = false;
  personas: PersonaModelo[] = [];
  funcionario: FuncionarioModelo = new FuncionarioModelo();
  listaAreas: AreaModelo;
  funcionarioForm: FormGroup;
  buscadorForm: FormGroup;
  alert:boolean=false;
  cargando = false;
  dtOptions: any = {};

  constructor( private funcionariosService: FuncionariosService,
               private areasService: AreasService,
               private personasService: PersonasService,
               private pacientesService: PacientesService,
               private route: ActivatedRoute,
               private router: Router,
               private fb: FormBuilder,
               private fb2: FormBuilder,
               private modalService: NgbModal ) { 
    this.crearFormulario();
  } 

  ngOnInit() {
    this.listarAreas();
    const id = this.route.snapshot.paramMap.get('id');    
    
    if ( id !== 'nuevo' ) {      
      this.funcionariosService.getFuncionario( Number(id) )
        .subscribe( (resp: FuncionarioModelo) => {
          this.funcionarioForm.patchValue(resp);
        });
    }else{
      this.crear = true;
    }
    this.crearTablaModel();
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

  obtenerPersona(event){
    event.preventDefault();
    var id = this.funcionarioForm.get('personas').get('personaId').value;
    this.funcionariosService.getPersona( id )
      .subscribe( (resp: PersonaModelo) => {
        this.funcionarioForm.get('personas').patchValue(resp);
      }, e => {
          Swal.fire({
            icon: 'info',
            text: e.status +'. '+ this.obtenerError(e),
          })
          this.funcionarioForm.get('personas').get('personaId').setValue(null);
        }
      );
  }
  
  guardar( ) {

    if ( this.funcionarioForm.invalid ){
      return Object.values( this.funcionarioForm.controls ).forEach( control => {
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
    
    this.funcionario = this.funcionarioForm.getRawValue();

    if ( this.funcionario.funcionarioId ) {
      this.funcionario.personas.usuarioModificacion = 'admin';
      this.funcionario.usuarioModificacion = 'admin';
      peticion = this.funcionariosService.actualizarFuncionario( this.funcionario );
    } else {
      if(!this.funcionario.personas.personaId){
        this.funcionario.personas.usuarioCreacion = 'admin';
      }
      this.funcionario.usuarioCreacion = 'admin';
      peticion = this.funcionariosService.crearFuncionario( this.funcionario );
    }

    peticion.subscribe( resp => {

      Swal.fire({
                icon: 'success',
                title: this.funcionario.personas.nombres,
                text: resp.mensaje,
              }).then( resp => {

        if ( resp.value ) {
          if ( this.funcionario.funcionarioId ) {
            this.router.navigate(['/funcionarios']);
          }else{
            this.limpiar();
          }
        }
      });
    }, e => {
        Swal.fire({
          icon: 'error',
          title: 'Algo salio mal',
          text: e.status +'. '+ this.obtenerError(e),
        })          
       }
    );
  }

  limpiar(){
    this.funcionario = new FuncionarioModelo();
    this.funcionarioForm.reset();
    this.funcionarioForm.get('estado').setValue('A');
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
    return this.funcionarioForm.get('personas').get('personaId').invalid 
      && this.funcionarioForm.get('personas').get('personaId').touched
  }

  get areaNoValido() {
    return this.funcionarioForm.get('areaId').invalid && this.funcionarioForm.get('areaId').touched
  }

  crearFormulario() {
    this.funcionarioForm = this.fb.group({
      funcionarioId  : [null, [] ],
      personas : this.fb.group({
        personaId  : [null, [] ],
        cedula  : [null, [ Validators.required, Validators.minLength(6) ]  ],
        nombres  : [null, [ Validators.required, Validators.minLength(5) ]  ],
        apellidos: [null, [Validators.required] ]       
      }),
      areaId  : [null, [ Validators.required] ],
      estado  : [null, [] ],
      fechaIngreso  : [null, [] ],
      fechaEgreso  : [null, [] ],
      fechaCreacion: [null, [] ],
      fechaModificacion: [null, [] ],
      usuarioCreacion: [null, [] ],
      usuarioModificacion: [null, [] ],             
    });

    this.funcionarioForm.get('funcionarioId').disable();
    this.funcionarioForm.get('personas').get('cedula').disable();
    this.funcionarioForm.get('personas').get('nombres').disable();
    this.funcionarioForm.get('personas').get('apellidos').disable();

    this.funcionarioForm.get('fechaCreacion').disable();
    this.funcionarioForm.get('fechaModificacion').disable();
    this.funcionarioForm.get('usuarioCreacion').disable();
    this.funcionarioForm.get('usuarioModificacion').disable();

    this.buscadorForm = this.fb2.group({
      cedula  : ['', [] ],
      nombres  : ['', [] ],
      apellidos: ['', [] ]   
    });
  }

  buscadorPersonas(event) {
    event.preventDefault();
    
    var buscador = new PersonaModelo();
    buscador.cedula = this.buscadorForm.get('cedula').value;
    buscador.nombres = this.buscadorForm.get('nombres').value;
    buscador.apellidos = this.buscadorForm.get('apellidos').value;
    
    if(!buscador.cedula && !buscador.nombres
      && !buscador.apellidos){
      this.alert=true;
      return;
    }
    this.cargando = true;
    this.personasService.buscarPersonasFiltros(buscador)
    .subscribe( resp => {
      this.personas = resp;
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

  limpiarModal(event) {
    event.preventDefault();
    this.buscadorForm.reset();
    this.personas = [];
  }

  cerrarAlert(){
    this.alert=false;
  }

  crearTablaModel(){
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

  openModal(targetModal) {
    this.modalService.open(targetModal, {
     centered: true,
     backdrop: 'static',
     size: 'lg'
    });
   
    this.buscadorForm.patchValue({
      cedula: '',
      nombres: '',
      apellidos: ''
    });
    this.personas = [];
    this.alert=false;
  }

  selectPersona(event, persona: PersonaModelo){
    this.modalService.dismissAll();
    if(persona.personaId){
      this.funcionarioForm.get('personas').get('personaId').setValue(persona.personaId);
    }
    this.pacientesService.getPersona( persona.personaId )
      .subscribe( (resp: PersonaModelo) => {
        this.funcionarioForm.get('personas').patchValue(resp);
      }, e => {
          Swal.fire({
            icon: 'info',
            text: e.status +'. '+ this.obtenerError(e),
          })
          this.funcionarioForm.get('personas').get('personaId').setValue(null);
        }
      );
  }

  onSubmit() {
    this.modalService.dismissAll();
   }
}
