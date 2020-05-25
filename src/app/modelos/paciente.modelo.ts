import { PersonaModelo } from './persona.modelo';

export class PacienteModelo {

    pacienteId: number;
    historialId: number;
    grupoSanguineo: string;
    seguroMedico: string;
    fechaCreacion: string;
    usuarioCreacion: string;
    fechaModificacion: string;
    usuarioModificacion: string;
    personas: PersonaModelo;

    constructor() {
    }

}
