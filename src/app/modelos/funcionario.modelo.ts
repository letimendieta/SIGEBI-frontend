import { PersonaModelo } from './persona.modelo';

export class FuncionarioModelo {

    funcionarioId: number;
    areaId: number;
    fechaIngreso: string;
    fechaEgreso: string;
    estado: string;
    fechaCreacion: string;
    usuarioCreacion: string;
    fechaModificacion: string;
    usuarioModificacion: string;
    personas: PersonaModelo;

    constructor() {
    }

}
