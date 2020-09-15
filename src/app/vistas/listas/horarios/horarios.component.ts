import { Component, OnInit } from '@angular/core';
import { HorariosService } from '../../../servicios/horarios.service';
import { HorarioModelo } from '../../../modelos/horario.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import { FuncionarioModelo } from '../../../modelos/funcionario.modelo';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css']
})
export class HorariosComponent implements OnInit {

  dtOptions: DataTables.Settings = {};

  horarios: HorarioModelo[] = [];
  buscador: HorarioModelo = new HorarioModelo();
  buscadorForm: FormGroup;
  cargando = false;  
  funcionario: FuncionarioModelo = new FuncionarioModelo();
  funcionarioPersona: PersonaModelo = new PersonaModelo();

  constructor( private horariosService: HorariosService,
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
        {data:'horarioDisponibleId'}, {data:'fecha'}, {data:'horaInicio'},
        {data:'horaFin'}, {data:'funcionarios.funcionarioId'}, 
        {data:'funcionarios.personas.cedula'},
        {data:'funcionarios.personas.nombres'}, 
        {data:'funcionarios.personas.apellidos'},
        {data:'estado'},{data:'fechaCreacion'},
        {data:'usuarioCreacion'},{data:'fechaModificacion'},
        {data:'usuarioModificacion'},
        {data:'Editar'},
        {data:'Borrar'},
      ]
    };
  }

  buscadorHorarios(event) {
    event.preventDefault();
    this.funcionario = new FuncionarioModelo();
    this.funcionarioPersona = new PersonaModelo();

    this.buscador = this.buscadorForm.getRawValue();

    this.funcionarioPersona.cedula = this.buscadorForm.get('funcionarios').get('cedula').value;
    this.funcionarioPersona.nombres = this.buscadorForm.get('funcionarios').get('nombres').value;
    this.funcionarioPersona.apellidos = this.buscadorForm.get('funcionarios').get('apellidos').value;

    if(!this.funcionarioPersona.cedula && !this.funcionarioPersona.nombres && !this.funcionarioPersona.apellidos){
      this.funcionario.personas = null;
    }else{
      this.funcionario.personas = this.funcionarioPersona;
    }
    this.funcionario.funcionarioId = this.buscadorForm.get('funcionarios').get('funcionarioId').value;
    if(this.funcionario.personas == null && !this.funcionario.funcionarioId){
      this.funcionario = null;
    }
    this.buscador.funcionarios = this.funcionario;
    
    this.horariosService.buscarHorariosFiltrosTabla(this.buscador)
    .subscribe( resp => {
      this.horarios = resp;
      this.cargando = false;
    }, e => {
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.obtenerError(e),
      })
    });
  }

  limpiar(event) {
    event.preventDefault();
    this.buscadorForm.reset();
    this.buscador = new HorarioModelo();
    this.horarios = [];
  }

  borrarHorario(event, horario: HorarioModelo ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar ${ horario.horarioDisponibleId }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        let peticion: Observable<any>;
        peticion = this.horariosService.borrarHorario( horario.horarioDisponibleId );

        peticion.subscribe( resp => {
          Swal.fire({
                    icon: 'success',
                    title: horario.horarioDisponibleId.toString(),
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
      horarioDisponibleId  : ['', [] ],
      fecha  : [null, [] ],
      estado: [null, [] ],
      funcionarios : this.fb.group({
        funcionarioId  : ['', [] ],
        cedula  : ['', [] ],
        nombres  : ['', [] ],
        apellidos  : ['', [] ]        
      })        
    });
  }
}
