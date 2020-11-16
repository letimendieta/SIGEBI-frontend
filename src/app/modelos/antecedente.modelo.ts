import { PatologiaProcedimientoModelo } from './patologiaProcedimiento.modelo';

export class AntecedenteModelo {

    antecedenteId: number;
    historialClinicoId: number;
    patologiasProcedimientos: PatologiaProcedimientoModelo;
    descripcion: string;
    tipo: string;    
    fechaCreacion: Date;
    fechaModificacion: Date;
    usuarioCreacion: string;
    usuarioModificacion: string;

    constructor() {
    }

}
