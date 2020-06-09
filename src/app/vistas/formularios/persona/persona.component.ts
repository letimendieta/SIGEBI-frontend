import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { PersonaModelo } from '../../../modelos/persona.modelo';
import { PersonasService } from '../../../servicios/personas.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {

  forma: FormGroup;

  persona: PersonaModelo = new PersonaModelo();


  constructor( private personasService: PersonasService,
               private route: ActivatedRoute,
              private fb: FormBuilder ) { this.crearFormulario();}

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    if ( id !== 'nuevo' ) {

      this.personasService.getPersona( Number(id) )
        .subscribe( (resp: PersonaModelo) => {
          this.persona = resp;
        });
    }
  }

  guardar(  ) {


      if ( this.forma.invalid ) {

    return Object.values( this.forma.controls ).forEach( control => {

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

    if ( this.persona.personaId ) {
      //Modificar
      this.persona.usuarioModificacion = 'admin';
      peticion = this.personasService.actualizarPersona( this.persona );
    } else {
      //Agregar
      this.persona.usuarioCreacion = 'admin';
      peticion = this.personasService.crearPersona( this.persona );
    }

    peticion.subscribe( resp => {

      Swal.fire({
                icon: 'info',
                title: this.persona.nombres,
                text: resp.mensaje,
              }).then( resp => {

        if ( resp.value ) {
          if ( this.persona.personaId ) {
            //volver a la lista de personas
          }else{
            this.limpiar();
          }
        }

      });
    }, e => {Swal.fire({
              icon: 'error',
              title: 'Algo salio mal',
              text: e.status +'. '+e.error.errors[0],
            })
       }
    );


    // Posteo de información
    this.forma.reset({
      nombre: this.persona.nombres
    });

  }

  limpiar(){
    this.persona = new PersonaModelo();
  }

  get cedulaNoValido() {
    return this.forma.get('cedula').invalid && this.forma.get('cedula').touched
  }

  get nombreNoValido() {
    return this.forma.get('nombre').invalid && this.forma.get('nombre').touched
  }

  get apellidoNoValido() {
  return this.forma.get('apellido').invalid && this.forma.get('apellido').touched
}

get correoNoValido() {
  return this.forma.get('correo').invalid && this.forma.get('correo').touched
}




crearFormulario() {

  this.forma = this.fb.group({
    cedula  : ['', [ Validators.required, Validators.minLength(6) ]  ],
    nombre  : ['', [ Validators.required, Validators.minLength(5) ]  ],
    apellido: ['', [Validators.required] ],
    correo  : ['', [ Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')] ]
  });

}

}
