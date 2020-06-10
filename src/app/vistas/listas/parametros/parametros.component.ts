import { Component, OnInit } from '@angular/core';
import { ParametrosService } from '../../../servicios/parametros.service';
import { ParametroModelo } from '../../../modelos/parametro.modelo';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css']
})
export class ParametrosComponent implements OnInit {

  parametros: ParametroModelo[] = [];
  buscador: ParametroModelo = new ParametroModelo();
  cargando = false;  

  constructor( private parametrosService: ParametrosService) { }

  ngOnInit() {    
    this.cargando = true;
    this.parametrosService.buscarParametrosFiltrosTabla(null)
      .subscribe( resp => {
        this.parametros = resp;
        this.cargando = false;
      });

  }

  buscadorParametros() {
    this.parametrosService.buscarParametrosFiltrosTabla(this.buscador)
    .subscribe( resp => {
      this.parametros = resp;
      this.cargando = false;
    }, e => {
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.error.mensaje,
      })
    });
  }

  limpiar() {
    this.buscador = new ParametroModelo();
    this.buscadorParametros();
  }

  borrarParametro( parametro: ParametroModelo ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ parametro.codigoParametro }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        let peticion: Observable<any>;
        //this.parametros.splice(i, 1);
        peticion = this.parametrosService.borrarParametro( parametro.parametroId );

        peticion.subscribe( resp => {
          Swal.fire({
                    icon: 'success',
                    title: parametro.codigoParametro,
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
                  text: e.status +'. '+e.error.errors[0],
                })
            }
        );
      }

    });
  }
}
