import { AreaModelo } from "./area.modelo";

export class PreguntaModelo {

    preguntaId: number;
    numero: number;
    descripcion: string;
    valor: string;
    estado: string; 
    areas: AreaModelo = new AreaModelo();   
    fechaCreacion: Date;
    fechaModificacion: Date;
    usuarioCreacion: string;
    usuarioModificacion: string;

    constructor() {
    }

}
