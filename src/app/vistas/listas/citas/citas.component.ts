import { Component, OnInit } from '@angular/core';
import { CitasService } from '../../../servicios/citas.service';
import { CitaModelo } from '../../../modelos/cita.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import { PacienteModelo } from '../../../modelos/paciente.modelo';
import { FuncionarioModelo } from '../../../modelos/funcionario.modelo';
import { AreaModelo } from '../../../modelos/area.modelo';
import { AreasService } from '../../../servicios/areas.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {

  dtOptions: DataTables.Settings = {};

  citas: CitaModelo[] = [];
  paciente : PacienteModelo = new PacienteModelo();
  pacientePersona: PersonaModelo = new PersonaModelo();
  listaAreas: AreaModelo;
  funcionario: FuncionarioModelo = new FuncionarioModelo();
  funcionarioPersona: PersonaModelo = new PersonaModelo();

  buscadorForm: FormGroup;
  buscador: CitaModelo = new CitaModelo();
  cargando = false;


  constructor( private citasService: CitasService,
              private areasService: AreasService,
              private fb: FormBuilder) {     
  }

  ngOnInit() {
    this.crearFormulario();
    this.crearTabla();  
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

  buscadorCitas(event) { 
    event.preventDefault(); 
    this.paciente = new PacienteModelo();
    this.funcionario = new FuncionarioModelo();
    this.pacientePersona = new PersonaModelo();
    this.funcionarioPersona = new PersonaModelo();

    this.buscador = this.buscadorForm.getRawValue();

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

    if(!this.buscador.areas.areaId){
      this.buscador.areas = null;
    }

    this.buscador.pacientes = this.paciente;
    this.buscador.funcionarios = this.funcionario;

    this.citasService.buscarCitasFiltros(this.buscador)
    .subscribe( resp => {
      this.citas = resp;
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
        {data:'citaId'}, {data:'pacientes.pacienteId'}, {data:'pacientes.personas.cedula'},
        {data:'pacientes.personas.nombres'}, {data:'pacientes.personas.apellidos'}, 
        {data:'funcionarios.funcionarioId'},
        {data:'funcionarios.personas.cedula'}, {data:'funcionarios.personas.nombres'},
        {data: 'funcionarios.personas.apellidos'}, {data: 'areas.codigo'},
        {data: 'fecha'}, {data: 'hora'},
        {data: 'estado'},
        {data:'Editar'},
        {data:'Borrar'},
      ]
    };
  }

  limpiar(event) {
    event.preventDefault();
    this.buscadorForm.reset();
    this.buscador = new CitaModelo();    
    this.citas = [];
  }

  borrarCita(event, cita: CitaModelo ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea cita id ${ cita.citaId }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        let peticion: Observable<any>;
        peticion = this.citasService.borrarCita( cita.citaId );

        peticion.subscribe( resp => {
          Swal.fire({
                    icon: 'success',
                    title: cita.citaId.toString(),
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
      citaId  : [null, [] ],
      fecha  : [null, [] ],
      hora  : [null, [] ],
      areas : this.fb.group({
        areaId  : [null, [] ]        
      }),
      estado: [null, [] ],
      pacientes : this.fb.group({
        pacienteId  : [null, [] ],
        pacienteCedula  : [null, [] ],
        pacienteNombres  : [null, [] ],
        pacienteApellidos  : [null, [] ]        
      }),
      funcionarios : this.fb.group({
        funcionarioId  : [null, [] ],
        funcionarioCedula  : [null, [] ],
        funcionarioNombres  : [null, [] ],
        funcionarioApellidos  : [null, [] ]        
      })      
    });
  }
}
