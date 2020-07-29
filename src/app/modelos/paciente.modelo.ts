import { PersonaModelo } from './persona.modelo';

export class PacienteModelo {

    pacienteId: number;
    historialId: number;
    grupoSanguineo: string;
    seguroMedico: string;
    fechaCreacion: Date;
    usuarioCreacion: string;
    fechaModificacion: Date;
    usuarioModificacion: string;
    personas: PersonaModelo;

    constructor() {
    }

}
