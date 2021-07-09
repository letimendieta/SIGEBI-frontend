import { AlergenoModelo } from './alergeno.modelo';

export class PatologiaProcedimientoModelo {

    patologiaProcedimientoId: number;
    codigo: string;
    descripcion: string;
    estado: string;    
    tipo: string;
    fechaCreacion: Date;
    fechaModificacion: Date;
    usuarioCreacion: string;
    usuarioModificacion: string;

    constructor() {
    }

}