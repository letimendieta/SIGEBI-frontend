import { AreaModelo } from './area.modelo';

export class HistorialClinicoModelo {

    historialClinicoId: number;
    pacienteId: number;
    patologiaActual: string;
    tratamientoActual: string;
    areas: AreaModelo = new AreaModelo();
    fechaCreacion: Date;
    usuarioCreacion: string;
    fechaModificacion: Date;
    usuarioModificacion: string;    
    constructor() {
    }

}
