import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CitaModelo } from '../../../modelos/cita.modelo';
import { FuncionarioModelo } from '../../../modelos/funcionario.modelo';
import { PersonaModelo } from '../../../modelos/persona.modelo';
import { AreaModelo } from '../../../modelos/area.modelo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CitasService } from '../../../servicios/citas.service';
import { PacientesService } from '../../../servicios/pacientes.service';
import { FuncionariosService } from '../../../servicios/funcionarios.service';
import { AreasService } from '../../../servicios/areas.service';

import Swal from 'sweetalert2';
import { PacienteModelo } from 'src/app/modelos/paciente.modelo';

@Component({
  selector: 'app-cita',
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.css']
})
export class CitaComponent implements OnInit {
  crear = false;
  cita: CitaModelo = new CitaModelo();
  pacientePersona: PersonaModelo = new PersonaModelo();  
  funcionarioPersona: PersonaModelo = new PersonaModelo();

  paciente: PacienteModelo = new PacienteModelo();
  funcionario: FuncionarioModelo = new FuncionarioModelo();
  listaAreas: AreaModelo;
  citaForm: FormGroup;
  modificar: boolean = false;


  constructor( private citasService: CitasService,
               private pacientesService: PacientesService,
               private funcionariosService: FuncionariosService,
               private areasService: AreasService,
               private route: ActivatedRoute,
               private router: Router,
               private fb: FormBuilder ) { 
    this.crearFormulario();
  }

  ngOnInit() {
    this.listarAreas();
    const id = this.route.snapshot.paramMap.get('id');

    if ( id !== 'nuevo' ) {
      this.citasService.getCita( Number(id) )
        .subscribe( (resp: CitaModelo) => {         
          this.citaForm.patchValue(resp);
        });
    }else{
      this.crear = true;
    }
  }  

  obtenerPaciente( ){
    var id = this.citaForm.get('pacientes').get('pacienteId').value;
    this.pacientesService.getPaciente( id )
      .subscribe( (resp: PacienteModelo) => {         
        this.citaForm.get('pacientes').patchValue(resp);
      }, e => {
          Swal.fire({
            icon: 'info',
            text: e.status +'. '+ this.obtenerError(e),
          })
        }
      );
  }

  listarAreas() {
    var orderBy = "descripcion";
    var orderDir = "asc";

    this.areasService.buscarAreasFiltros(null, orderBy, orderDir )
      .subscribe( (resp: AreaModelo) => {
        this.listaAreas = resp;
    });
  }

  obtenerFuncionario( ){
    var id = this.citaForm.get('funcionarios').get('funcionarioId').value;
    this.funcionariosService.getFuncionario( id )
      .subscribe( (resp: FuncionarioModelo) => {          
        this.citaForm.get('funcionarios').patchValue(resp);
      }, e => {
          Swal.fire({
            icon: 'info',
            //title: 'Algo salio mal',
            text: e.status +'. '+ this.obtenerError(e),
          })
        }
      );
  }
  
  guardar( ) {

    if ( this.citaForm.invalid ){
      return Object.values( this.citaForm.controls ).forEach( control => {
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

    this.cita = this.citaForm.getRawValue();

    if ( this.cita.citaId ) {
      this.cita.usuarioModificacion = 'admin';
      peticion = this.citasService.actualizarCita( this.cita );
    } else {
      this.cita.usuarioCreacion = 'admin';
      peticion = this.citasService.crearCita( this.cita );
    }

    peticion.subscribe( resp => {

      Swal.fire({
                icon: 'success',
                title: this.cita.citaId,
                text: resp.mensaje,
              }).then( resp => {

        if ( resp.value ) {
          if ( this.cita.citaId ) {
            this.router.navigate(['/citas']);
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
    this.citaForm.reset();
    this.cita = new CitaModelo();
    this.paciente = new PacienteModelo();
    this.funcionario = new FuncionarioModelo();
    this.citaForm.get('estado').setValue('A');
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

  get areaNoValido() {
    return this.citaForm.get('areas').get('areaId').invalid 
    && this.citaForm.get('areas').get('areaId').touched
  }
  
  crearFormulario() {
    this.citaForm = this.fb.group({
      citaId  : [null, [] ],
      pacientes : this.fb.group({
        pacienteId  : [null, [] ],
        personas : this.fb.group({
          cedula  : [null, [] ],
          nombres  : [null, [] ],
          apellidos  : [null, [] ]
        })
      }),
      funcionarios : this.fb.group({
        funcionarioId  : [null, [] ],
        personas : this.fb.group({
          cedula  : [null, [] ],
          nombres  : [null, [] ],
          apellidos  : [null, [] ]
        })
      }),
      areas : this.fb.group({
        areaId  : [null, [Validators.required] ]        
      }),
      fecha  : [null, [] ],
      hora  : [null, [] ],
      estado  : [null, [] ],
      fechaCreacion: [null, [] ],
      fechaModificacion: [null, [] ],
      usuarioCreacion: [null, [] ],
      usuarioModificacion: [null, [] ],             
    });

    this.citaForm.get('citaId').disable();
    this.citaForm.get('pacientes').get('personas').get('cedula').disable();
    this.citaForm.get('pacientes').get('personas').get('nombres').disable();
    this.citaForm.get('pacientes').get('personas').get('apellidos').disable();

    this.citaForm.get('funcionarios').get('personas').get('cedula').disable();
    this.citaForm.get('funcionarios').get('personas').get('nombres').disable();
    this.citaForm.get('funcionarios').get('personas').get('apellidos').disable();

    this.citaForm.get('fechaCreacion').disable();
    this.citaForm.get('fechaModificacion').disable();
    this.citaForm.get('usuarioCreacion').disable();
    this.citaForm.get('usuarioModificacion').disable();
  }
}
