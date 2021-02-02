import { AlergenoModelo } from './alergeno.modelo';

export class AlergiaModelo {

    alergiaId: number;
    pacienteId: number;
    alergenos: AlergenoModelo;    
    fechaCreacion: Date;
    fechaModificacion: Date;
    usuarioCreacion: string;
    usuarioModificacion: string;

    constructor() {
    }

}
