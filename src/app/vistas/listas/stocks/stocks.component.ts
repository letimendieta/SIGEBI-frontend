import { Component, OnInit } from '@angular/core';
import { StocksService } from '../../../servicios/stocks.service';
import { StockModelo } from '../../../modelos/stock.modelo';
import { ParametroModelo } from '../../../modelos/parametro.modelo';
import { ParametrosService } from '../../../servicios/parametros.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {

  stocks: StockModelo[] = [];
  buscador: StockModelo = new StockModelo();
  buscadorForm: FormGroup;
  listaUnidadMedida: ParametroModelo;
  cargando = false;  

  constructor( private stocksService: StocksService,
               private parametrosService: ParametrosService,
               private fb: FormBuilder ) { 
    this.crearFormulario();
  }

  ngOnInit() { 
    this.obtenerParametros();  
    this.cargando = true;
    this.stocksService.buscarStocksFiltrosTabla(null)
      .subscribe( resp => {
        this.stocks = resp;
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

  obtenerParametros() {
    var estadoCivilParam = new ParametroModelo();
    estadoCivilParam.codigoParametro = "UNI_MEDIDA";
    estadoCivilParam.estado = "A";
    var orderBy = "descripcionValor";
    var orderDir = "asc";

    this.parametrosService.buscarParametrosFiltros( estadoCivilParam, orderBy, orderDir )
      .subscribe( (resp: ParametroModelo) => {
        this.listaUnidadMedida = resp;
    });
  }

  buscadorStocks() {
    this.buscador.stockId = this.buscadorForm.get('stockId').value;
    this.buscador.insumos.insumoId = this.buscadorForm.get('insumoId').value;
    this.buscador.insumos.codigo = this.buscadorForm.get('codigo').value;
    this.buscador.insumos.descripcion = this.buscadorForm.get('descripcion').value;

    if(!this.buscador.insumos.insumoId && !this.buscador.insumos.codigo 
      && !this.buscador.insumos.descripcion){
      this.buscador.insumos = null;
    } 
    this.stocksService.buscarStocksFiltrosTabla(this.buscador)
    .subscribe( resp => {
      this.stocks = resp;
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
    this.buscador = new StockModelo();
    this.buscadorStocks();
  }

  borrarStock( stock: StockModelo ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar ${ stock.stockId }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        let peticion: Observable<any>;
        peticion = this.stocksService.borrarStock( stock.stockId );

        peticion.subscribe( resp => {
          Swal.fire({
                    icon: 'success',
                    title: stock.stockId.toString(),
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
      stockId  : ['', [] ],
      insumoId : ['', [] ],
      codigo  : ['', [] ],
      descripcion  : ['', [] ]      
    });
  }
}
