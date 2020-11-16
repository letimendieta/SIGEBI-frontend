import { AlergenoModelo } from './alergeno.modelo';

export class AlergiaModelo {

    alergiaId: number;
    historialClinicoId: number;
    alergenos: AlergenoModelo;    
    fechaCreacion: Date;
    fechaModificacion: Date;
    usuarioCreacion: string;
    usuarioModificacion: string;

    constructor() {
    }

}
