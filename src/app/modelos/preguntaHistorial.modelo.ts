import { PreguntaModelo } from './pregunta.modelo';

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
