export class TerminoEstandarModelo {

    id: number;
    codigoUnico: string;
    termino: string;
    estandarTerminologiaId: number;
    contextoId: number; 
    fechaCreacion: Date;
    fechaModificacion: Date;
    usuarioCreacion: string;
    usuarioModificacion: string;

    constructor() {
    }

}
