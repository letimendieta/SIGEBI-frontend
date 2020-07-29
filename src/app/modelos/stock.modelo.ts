import { InsumoModelo } from './insumo.modelo';

export class StockModelo {

    stockId: number;
    cantidad: number;
    unidadMedida: string;    
    fechaCreacion: Date;
    fechaModificacion: Date;
    usuarioCreacion: string;
    usuarioModificacion: string;
    insumos: InsumoModelo;
    
    constructor() {
    }

}
