import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ParametroModelo } from '../../../modelos/parametro.modelo';
import { StockModelo } from '../../../modelos/stock.modelo';
import { StocksService } from '../../../servicios/stocks.service';
import { ParametrosService } from '../../../servicios/parametros.service';
import { InsumosService } from '../../../servicios/insumos.service';
import { InsumoModelo } from 'src/app/modelos/insumo.modelo';
import Swal from 'sweetalert2';
import { ComunesService } from 'src/app/servicios/comunes.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  crear = false;
  insumos: InsumoModelo[] = [];
  stockForm: FormGroup;
  listaUnidadMedida: ParametroModelo;
  cargando = false;
  alert:boolean=false;
  dtOptions: any = {};
  buscadorForm: FormGroup;
  stock: StockModelo = new StockModelo();

  constructor( private stocksService: StocksService,
               private parametrosService: ParametrosService,
               private insumosService: InsumosService,
               private comunes: ComunesService,
               private route: ActivatedRoute,
               private router: Router,
               private fb: FormBuilder,
               private fb2: FormBuilder,
               private modalService: NgbModal ) { 
    this.crearFormulario();
  }              

  ngOnInit() {
    this.obtenerParametros();
    const id = this.route.snapshot.paramMap.get('id');
    if ( id !== 'nuevo' ) {
      
      this.stocksService.getStock( Number(id) )
        .subscribe( (resp: StockModelo) => {
          this.stockForm.patchValue(resp);
        });
    }else{
      this.crear = true;
    }
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

  obtenerInsumo(event) {
    event.preventDefault();
    var id = this.stockForm.get('insumos').get('insumoId').value;
    this.insumosService.getInsumo( id )
    .subscribe( (resp: InsumoModelo) => {
        this.stockForm.get('insumos').patchValue(resp);
      }, e => {
          Swal.fire({
            icon: 'info',
            text: e.status +'. '+ this.comunes.obtenerError(e),
          })
          this.stockForm.get('insumos').get('insumoId').setValue(null);
        }
      );
  }

  guardar( ) {

    if ( this.stockForm.invalid ) {

      return Object.values( this.stockForm.controls ).forEach( control => {

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

    this.stock = this.stockForm.getRawValue();

    if ( this.stock.stockId ) {
      //Modificar
      this.stock.usuarioModificacion = 'admin';
      peticion = this.stocksService.actualizarStock( this.stock );
    } else {
      //Agregar
      this.stock.usuarioCreacion = 'admin';
      peticion = this.stocksService.crearStock( this.stock );
    }

    peticion.subscribe( resp => {

      Swal.fire({
                icon: 'success',
                title: resp.stock.stockId.toString(),
                text: resp.mensaje,
              }).then( resp => {

        if ( resp.value ) {
          if ( this.stock.stockId ) {
            this.router.navigate(['/stocks']);
          }else{
            this.limpiar();
          }
        }

      });
    }, e => {Swal.fire({
              icon: 'error',
              title: 'Algo salio mal',
              text: e.status +'. '+ this.comunes.obtenerError(e),
            })
       }
    );
  }

  limpiar(){
    this.stock = new StockModelo();
    this.stockForm.reset();
    this.stockForm.get('estado').setValue('A');
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

  get cantidadNoValido() {
    return this.stockForm.get('cantidad').invalid && this.stockForm.get('cantidad').touched
  }

  get insumoIdNoValido() {
    return this.stockForm.get('insumos').get('insumoId').invalid 
      && this.stockForm.get('insumos').get('insumoId').touched
  }

  crearFormulario() {

    this.stockForm = this.fb.group({
      stockId  : [null, [] ],
      insumos : this.fb.group({
        insumoId  : [null, [ Validators.required] ],
        codigo  : [null, [ Validators.required] ],
        descripcion  : [null, [ Validators.required] ]
      }),
      cantidad  : [null, [ Validators.required] ],
      unidadMedida: [null, [] ],
      fechaCreacion: [null, [] ],
      fechaModificacion: [null, [] ],
      usuarioCreacion: [null, [] ],
      usuarioModificacion: [null, [] ]  
    });

    this.buscadorForm = this.fb2.group({
      insumoId  : [null, [] ],
      codigo  : [null, [] ],
      descripcion  : [null, [] ],
      fechaVencimiento: [null, [] ]
    });

    this.stockForm.get('stockId').disable();
    this.stockForm.get('insumos').get('codigo').disable();
    this.stockForm.get('insumos').get('descripcion').disable();
    this.stockForm.get('fechaCreacion').disable();
    this.stockForm.get('fechaModificacion').disable();
    this.stockForm.get('usuarioCreacion').disable();
    this.stockForm.get('usuarioModificacion').disable();
  }
 

  buscadorInsumos(event) {
    event.preventDefault();
    var buscador = new InsumoModelo();
    buscador = this.buscadorForm.getRawValue();

    if(!buscador.insumoId && !buscador.codigo
      && !buscador.descripcion && !buscador.fechaVencimiento){
      this.alert=true;
      return;
    }
    this.insumosService.buscarInsumosFiltrosTabla(buscador)
    .subscribe( resp => {
      this.insumos = resp;
    }, e => {
      Swal.fire({
        icon: 'info',
        title: 'Algo salio mal',
        text: e.status +'. '+ this.comunes.obtenerError(e)
      })
    });
  }

  limpiarModal(event) {
    event.preventDefault();
    this.buscadorForm.reset();
    this.insumos = [];
  }

  cerrarAlert(){
    this.alert=false;
  }

  crearTablaModel(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [[5,10,15,20,50,-1],[5,10,15,20,50,"Todos"]],
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
      searching: false,
      processing: true,
      columns: [ { data: 'insumoId' }, { data: 'codigo' }, 
      { data: 'descripcion' }, { data: 'fechaVencimiento' }, { data: 'tipo' }]      
    };
  }

  openModal(targetModal) {
    this.modalService.open(targetModal, {
     centered: true,
     backdrop: 'static',
     size: 'lg'
    });
   
    this.buscadorForm.patchValue({
      insumoId: null,
      codigo: null,
      descripcion: null,
      fechaVencimiento: null
    });
    this.insumos = [];
    this.alert=false;
  }

  selectInsumo(event, insumo: InsumoModelo){
    this.modalService.dismissAll();
    if(insumo.insumoId){
      this.stockForm.get('insumos').get('insumoId').setValue(insumo.insumoId);
    }
    this.insumosService.getInsumo( insumo.insumoId )
      .subscribe( (resp: InsumoModelo) => {
        this.stockForm.get('insumos').patchValue(resp);
      }, e => {
          Swal.fire({
            icon: 'info',
            text: e.status +'. '+ this.comunes.obtenerError(e)
          })
          this.stockForm.get('insumos').get('insumoId').setValue(null);
        }
      );
  }

  onSubmit() {
    this.modalService.dismissAll();
  }

}
