import { InsumoModelo } from './insumo.modelo';
import { PreguntaModelo } from './pregunta.modelo';
import { ProcedimientoModelo } from './procedimiento.modelo';

export class PreguntaHistorialModelo {

    preguntaHistorialId: number;
    preguntas: PreguntaModelo;
    respuesta: string;    
    historialClinicoId: number;
    fechaCreacion: Date;
    fechaModificacion: Date;
    usuarioCreacion: string;
    usuarioModificacion: string;

    constructor() {
    }

}
