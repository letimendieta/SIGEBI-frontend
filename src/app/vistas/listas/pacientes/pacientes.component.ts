import { Component, OnInit } from '@angular/core';
import { PacientesService } from '../../../servicios/pacientes.service';
import { PacienteModelo } from '../../../modelos/paciente.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {

  dtOptions: DataTables.Settings = {};

  pacientes: PacienteModelo[] = [];
  persona: PersonaModelo = new PersonaModelo();
  buscador: PacienteModelo = new PacienteModelo();
  buscadorForm: FormGroup;
  cargando = false;



  constructor( private pacientesService: PacientesService,
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
        {data:'pacienteId'}, {data:'personas.cedula'}, {data:'personas.nombres'},
        {data:'personas.apellidos'}, {data:'grupoSanguineo'}, {data:'personas.edad'},
        {data:'personas.direccion'}, {data:'personas.email'},
        {data:'personas.estadoCivil'},{data:'personas.fechaNacimiento'},{data:'personas.nacionalidad'},
        {data:'personas.sexo'},{data:'personas.telefono'},{data:'personas.celular'},
        {data:'Editar'},
        {data:'Borrar'},
      ]
    };
  }

  buscadorPacientes(event) {
    event.preventDefault();
    this.persona.cedula = this.buscadorForm.get('cedula').value;
    this.persona.nombres = this.buscadorForm.get('nombres').value;
    this.persona.apellidos = this.buscadorForm.get('apellidos').value;
    this.buscador.personas = this.persona;
    this.buscador.pacienteId = this.buscadorForm.get('pacienteId').value;
    this.pacientesService.buscarPacientesFiltros(this.buscador)
    .subscribe( resp => {
      this.pacientes = resp;
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
    this.buscador = new PacienteModelo();
    this.persona = new PersonaModelo();
    this.pacientes = [];
  }

  borrarPaciente(event, paciente: PacienteModelo ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ paciente.personas.nombres }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        let peticion: Observable<any>;
        peticion = this.pacientesService.borrarPaciente( paciente.pacienteId );

        peticion.subscribe( resp => {
          Swal.fire({
                    icon: 'success',
                    title: paciente.personas.nombres,
                    text: resp.mensaje
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
      pacienteId  : ['', [] ],
      cedula  : ['', [] ],
      nombres  : ['', [] ],
      apellidos: ['', [] ]
    });
  }
}
