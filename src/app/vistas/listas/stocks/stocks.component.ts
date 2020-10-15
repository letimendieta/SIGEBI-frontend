import { Component, OnInit } from '@angular/core';
import { StocksService } from '../../../servicios/stocks.service';
import { StockModelo } from '../../../modelos/stock.modelo';
import { ParametroModelo } from '../../../modelos/parametro.modelo';
import { ParametrosService } from '../../../servicios/parametros.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { InsumoModelo } from 'src/app/modelos/insumo.modelo';
import { GlobalConstants } from '../../../common/global-constants';
import { ComunesService } from 'src/app/servicios/comunes.service';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {

  dtOptions: any = {};

  stocks: StockModelo[] = [];
  buscador: StockModelo = new StockModelo();
  buscadorForm: FormGroup;
  listaUnidadMedida: ParametroModelo;
  cargando = false;  

  constructor( private stocksService: StocksService,
               private parametrosService: ParametrosService,
               private comunes: ComunesService,
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
        "lengthMenu": "Mostrar _MENU_ registros",
        "zeroRecords": "No se encontraron resultados",
        "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "infoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sSearch": "Buscar:",
        "oPaginate": {
          "sFirst": "Primero",
          "sLast":"Último",
          "sNext":"Siguiente",
          "sPrevious": "Anterior"
        },
        "sProcessing":"Procesando...",
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
      ],
      dom: 'lBfrtip',
      buttons: [
        {
          extend:    'copy',
          text:      '<i class="far fa-copy"></i>',
          titleAttr: 'Copiar',
          className: 'btn btn-light',
          title:     'Listado de stocks',
          messageTop: 'Usuario:  <br>Fecha: '+ new Date().toLocaleString(),
          exportOptions: {
            columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
          },
        },
        {
          extend:    'csv',
          title:     'Listado de stocks',
          text:      '<i class="fas fa-file-csv"></i>',
          titleAttr: 'Exportar a CSV',
          className: 'btn btn-secondary',
          messageTop: 'Usuario:  <br>Fecha: '+ new Date().toLocaleString(),
          exportOptions: {
            columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
          },
        },
        {
          extend:    'excelHtml5',
          title:     'Listado de stocks',
          text:      '<i class="fas fa-file-excel"></i> ',
          titleAttr: 'Exportar a Excel',
          className: 'btn btn-success',
          autoFilter: true,
          messageTop: 'Usuario:  <br>Fecha: '+ new Date().toLocaleString(),
          exportOptions: {
            columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
          }
        },          
        {
          extend:    'print',
          title:     'Listado de stocks',
          text:      '<i class="fa fa-print"></i> ',
          titleAttr: 'Imprimir',
          className: 'btn btn-info',
          messageTop: 'Usuario:  <br>Fecha: '+ new Date().toLocaleString(),
          exportOptions: {
            columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
          },
          customize: function ( win ) {
            $(win.document.body)
                .css( 'font-size', '10pt' )
                .prepend(
                    '<img src= ' + GlobalConstants.imagenReporteListas + ' style="position:absolute; top:400; left:400;" />'
                );

            $(win.document.body).find( 'table' )
                .addClass( 'compact' )
                .css( 'font-size', 'inherit' );
          }              
        }
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
    this.cargando = true;
    this.stocks = [];
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
        text: e.status +'. '+ this.comunes.obtenerError(e),
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
              this.buscadorStocks(event);
            }
          });
        }, e => {            
            Swal.fire({
              icon: 'info',
              title: 'Algo salio mal',
              text: e.status +'. '+ this.comunes.obtenerError(e)
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
