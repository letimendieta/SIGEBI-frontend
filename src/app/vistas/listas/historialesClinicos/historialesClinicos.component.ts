import { Component, OnInit } from '@angular/core';
import { HistorialesClinicosService } from '../../../servicios/historialesClinicos.service';
import { HistorialClinicoModelo } from '../../../modelos/historialClinico.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import { PacienteModelo } from '../../../modelos/paciente.modelo';
import { AreaModelo } from '../../../modelos/area.modelo';
import { AreasService } from '../../../servicios/areas.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historialesClinicos',
  templateUrl: './historialesClinicos.component.html',
  styleUrls: ['./historialesClinicos.component.css']
})
export class HistorialesClinicosComponent implements OnInit {

  historialClinicos: HistorialClinicoModelo[] = [];
  paciente : PacienteModelo = new PacienteModelo();
  pacientePersona: PersonaModelo = new PersonaModelo();
  listaAreas: AreaModelo;

  buscadorForm: FormGroup;
  buscador: HistorialClinicoModelo = new HistorialClinicoModelo();
  cargando = false;


  constructor( private historialClinicosService: HistorialesClinicosService,
              private areasService: AreasService,
              private fb: FormBuilder) { 
    this.crearFormulario();
  }

  ngOnInit() {

    this.cargando = true;
    this.listarAreas();
    this.historialClinicosService.buscarHistorialClinicosFiltros(null)
      .subscribe( resp => {
        this.historialClinicos = resp;
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

  listarAreas() {
    var orderBy = "descripcion";
    var orderDir = "asc";

    this.areasService.buscarAreasFiltros(null, orderBy, orderDir )
      .subscribe( (resp: AreaModelo) => {
        this.listaAreas = resp;
    });
  }

  buscadorHistorialClinicos() {   
    this.paciente = new PacienteModelo();
    this.pacientePersona = new PersonaModelo();

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
 
    this.buscador.pacientes = this.paciente;

    this.historialClinicosService.buscarHistorialClinicosFiltros(this.buscador)
    .subscribe( resp => {
      this.historialClinicos = resp;
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
    this.buscador = new HistorialClinicoModelo();    
    this.buscadorHistorialClinicos();
  }

  borrarHistorialClinico( historialClinico: HistorialClinicoModelo ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea historialClinico id ${ historialClinico.historialClinicoId }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        let peticion: Observable<any>;
        peticion = this.historialClinicosService.borrarHistorialClinico( historialClinico.historialClinicoId );

        peticion.subscribe( resp => {
          Swal.fire({
                    icon: 'success',
                    title: historialClinico.historialClinicoId,
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
      historialClinicoId  : ['', [] ],
      areaId  : [null, [] ],
      pacientes : this.fb.group({
        pacienteId  : ['', [] ],
        pacienteCedula  : ['', [] ],
        pacienteNombres  : ['', [] ],
        pacienteApellidos  : ['', [] ]        
      })   
    });
  }
}
