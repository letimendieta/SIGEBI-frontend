import { PatologiaProcedimientoModelo } from './patologiaProcedimiento.modelo';

export class AntecedenteModelo {

    antecedenteId: number;
    pacienteId: number;
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
