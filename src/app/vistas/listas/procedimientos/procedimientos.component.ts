import { Component, OnInit } from '@angular/core';
import { ProcedimientosService } from '../../../servicios/procedimientos.service';
import { ProcedimientoModelo } from '../../../modelos/procedimiento.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import { PacienteModelo } from '../../../modelos/paciente.modelo';
import { FuncionarioModelo } from '../../../modelos/funcionario.modelo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-procedimientos',
  templateUrl: './procedimientos.component.html',
  styleUrls: ['./procedimientos.component.css']
})
export class ProcedimientosComponent implements OnInit {

  dtOptions: DataTables.Settings = {};

  procedimientos: ProcedimientoModelo[] = [];
  paciente : PacienteModelo = new PacienteModelo();
  pacientePersona: PersonaModelo = new PersonaModelo();

  funcionario: FuncionarioModelo = new FuncionarioModelo();
  funcionarioPersona: PersonaModelo = new PersonaModelo();

  buscadorForm: FormGroup;
  buscador: ProcedimientoModelo = new ProcedimientoModelo();
  cargando = false;


  constructor( private procedimientosService: ProcedimientosService,
              private fb: FormBuilder) { 
    this.crearFormulario();
    this.crearTabla();
  }

  ngOnInit() {

    this.cargando = true;
    this.procedimientosService.buscarProcedimientosFiltros(null)
      .subscribe( resp => {
        this.procedimientos = resp;
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

  crearTabla(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      searching: false,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
      },
      processing: true,
      columns: [
        {data:'#'},
        {data:'procedimientoId'}, {data:'pacientes.pacienteId'}, 
        {data:'pacientes.personas.cedula'},
        {data:'pacientes.personas.nombres'}, {data:'pacientes.personas.apellidos'}, 
        {data:'funcionarios.funcionarioId'},
        {data:'funcionarios.personas.cedula'}, {data:'funcionarios.personas.nombres'},
        {data:'funcionarios.personas.apellidos'},{data:'insumoId'},{data:'fecha'},
        {data:'Editar'},
        {data:'Borrar'}
      ]
    };
  }

  buscadorProcedimientos(event) {   
    event.preventDefault();
    this.paciente = new PacienteModelo();
    this.funcionario = new FuncionarioModelo();
    this.pacientePersona = new PersonaModelo();
    this.funcionarioPersona = new PersonaModelo();

    this.pacientePersona.cedula = this.buscadorForm.get('pacientes').get('pacienteCedula').value;
    this.pacientePersona.nombres = this.buscadorForm.get('pacientes').get('pacienteNombres').value;
    this.pacientePersona.apellidos = this.buscadorForm.get('pacientes').get('pacienteApellidos').value;
    if(!this.pacientePersona.cedula && !this.pacientePersona.nombres && !this.pacientePersona.apellidos){
      this.paciente.personas = null;
    }else{
      this.paciente.personas = this.pacientePersona;
    }
    this.paciente.pacienteId = this.buscadorForm.get('pacientes').get('pacienteId').value; 
    if(this.paciente.personas == null && !this.paciente.pacienteId){
      this.paciente = null;
    }      
    
    this.funcionarioPersona.cedula = this.buscadorForm.get('funcionarios').get('funcionarioCedula').value;
    this.funcionarioPersona.nombres = this.buscadorForm.get('funcionarios').get('funcionarioNombres').value;
    this.funcionarioPersona.apellidos = this.buscadorForm.get('funcionarios').get('funcionarioApellidos').value;

    if(!this.funcionarioPersona.cedula && !this.funcionarioPersona.nombres && !this.funcionarioPersona.apellidos){
      this.funcionario.personas = null;
    }else{
      this.funcionario.personas = this.funcionarioPersona;
    }

    this.funcionario.funcionarioId = this.buscadorForm.get('funcionarios').get('funcionarioId').value;
    if(this.funcionario.personas == null && !this.funcionario.funcionarioId){
      this.funcionario = null;
    } 

    this.buscador.pacientes = this.paciente;
    this.buscador.funcionarios = this.funcionario;

    this.buscador.procedimientoId = this.buscadorForm.get('procedimientoId').value;
    this.buscador.fecha =  this.buscadorForm.get('fecha').value;
    this.procedimientosService.buscarProcedimientosFiltros(this.buscador)
    .subscribe( resp => {
      this.procedimientos = resp;
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
    this.buscador = new ProcedimientoModelo();  
    this.procedimientos = [];
  }

  borrarProcedimiento(event, procedimiento: ProcedimientoModelo ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea procedimiento id ${ procedimiento.procedimientoId }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        let peticion: Observable<any>;
        peticion = this.procedimientosService.borrarProcedimiento( procedimiento.procedimientoId );

        peticion.subscribe( resp => {
          Swal.fire({
                    icon: 'success',
                    title: procedimiento.procedimientoId.toString(),
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
      procedimientoId  : ['', [] ],
      fecha : [null, [] ],
      pacientes : this.fb.group({
        pacienteId  : ['', [] ],
        pacienteCedula  : ['', [] ],
        pacienteNombres  : ['', [] ],
        pacienteApellidos  : ['', [] ]        
      }),
      funcionarios : this.fb.group({
        funcionarioId  : ['', [] ],
        funcionarioCedula  : ['', [] ],
        funcionarioNombres  : ['', [] ],
        funcionarioApellidos  : ['', [] ]        
      })      
    });
  }
}
