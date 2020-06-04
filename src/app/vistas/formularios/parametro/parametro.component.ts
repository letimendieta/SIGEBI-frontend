import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

import { ParametroModelo } from '../../../modelos/parametro.modelo';
import { ParametrosService } from '../../../servicios/parametros.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-parametro',
  templateUrl: './parametro.component.html',
  styleUrls: ['./parametro.component.css']
})
export class ParametroComponent implements OnInit {
  crear = false;
  parametro: ParametroModelo = new ParametroModelo();

  constructor( private parametrosService: ParametrosService,
               private route: ActivatedRoute 
               ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if ( id !== 'nuevo' ) {
      
      this.parametrosService.getParametro( Number(id) )
        .subscribe( (resp: ParametroModelo) => {
          this.parametro = resp;
        });
    }else{
      this.crear = true;
    }

  }
  
  guardar( form: NgForm ) {

    if ( form.invalid ) {
      console.log('Formulario no válido');
      return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();


    let peticion: Observable<any>;

    if ( this.parametro.parametroId ) {
      //Modificar
      this.parametro.usuarioModificacion = 'admin';
      peticion = this.parametrosService.actualizarParametro( this.parametro );
    } else {
      //Agregar
      this.parametro.usuarioCreacion = 'admin';
      peticion = this.parametrosService.crearParametro( this.parametro );
    }

    peticion.subscribe( resp => {

      Swal.fire({
                icon: 'info',
                title: this.parametro.codigoParametro,
                text: resp.mensaje,
              }).then( resp => {

        if ( resp.value ) {
          if ( this.parametro.parametroId ) {
            //volver a la lista de parametros
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
  }

  limpiar(){
    this.parametro = new ParametroModelo();
  }
}
