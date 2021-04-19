import { InsumoModelo } from './insumo.modelo';
import { TratamientoModelo } from './tratamiento.modelo';

export class TratamientoInsumoModelo {

    tratamientoInsumoId: number;
    cantidad: number;
    medida: string;
    tratamientos: TratamientoModelo;
    insumos: InsumoModelo;    
    fechaCreacion: Date;
    fechaModificacion: Date;
    usuarioCreacion: string;
    usuarioModificacion: string;

    constructor() {
    }

}
