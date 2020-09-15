import { Component, OnInit } from '@angular/core';
import { StocksService } from '../../../servicios/stocks.service';
import { StockModelo } from '../../../modelos/stock.modelo';
import { ParametroModelo } from '../../../modelos/parametro.modelo';
import { ParametrosService } from '../../../servicios/parametros.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { InsumoModelo } from 'src/app/modelos/insumo.modelo';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {

  dtOptions: DataTables.Settings = {};

  stocks: StockModelo[] = [];
  buscador: StockModelo = new StockModelo();
  buscadorForm: FormGroup;
  listaUnidadMedida: ParametroModelo;
  cargando = false;  

  constructor( private stocksService: StocksService,
               private parametrosService: ParametrosService,
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
        {data:'stockId'}, {data:'insumos.insumoId'}, {data:'insumos.codigo'},
        {data:'insumos.descripcion'}, {data:'cantidad'}, {data:'unidadMedida'},
        {data:'fechaCreacion'}, {data:'usuarioCreacion'},
        {data:'fechaModificacion'},{data:'usuarioModificacion'},
        {data:'Editar'},
        {data:'Borrar'}
      ]
    };
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

  buscadorStocks(event) {
    event.preventDefault();
    var insumos = new InsumoModelo();
    this.buscador.stockId = this.buscadorForm.get('stockId').value;
    insumos.insumoId = this.buscadorForm.get('insumoId').value;
    insumos.codigo = this.buscadorForm.get('codigo').value;
    insumos.descripcion = this.buscadorForm.get('descripcion').value;

    this.buscador.insumos = insumos;

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

  limpiar(event) {
    event.preventDefault();
    this.buscadorForm.reset();
    this.buscador = new StockModelo();
    this.stocks = [];
  }

  borrarStock(event, stock: StockModelo ) {

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
              text: e.status +'. '+ this.obtenerError(e)
            })
            this.cargando = false;
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
