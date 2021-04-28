import { InsumoModelo } from './insumo.modelo';
import { ProcedimientoModelo } from './procedimiento.modelo';

export class ProcedimientoInsumoModelo {

    procedimientoInsumoId: number;
    cantidad: number;
    medida: string;
    procedimientos: ProcedimientoModelo;
    insumos: InsumoModelo;    
    estado: string;
    fechaCreacion: Date;
    fechaModificacion: Date;
    usuarioCreacion: string;
    usuarioModificacion: string;

    constructor() {
    }

}
