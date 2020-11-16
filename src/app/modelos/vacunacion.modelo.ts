import { AlergenoModelo } from './alergeno.modelo';
import { VacunaModelo } from './vacuna.modelo';

export class VacunacionModelo {

    vacunacionId: number;
    historialClinicoId: number;
    vacunas: VacunaModelo;    
    fechaCreacion: Date;
    fechaModificacion: Date;
    usuarioCreacion: string;
    usuarioModificacion: string;

    constructor() {
    }

}
