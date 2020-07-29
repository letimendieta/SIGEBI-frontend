import { PersonaModelo } from './persona.modelo';

export class FuncionarioModelo {

    funcionarioId: number;
    areaId: number;
    fechaIngreso: Date;
    fechaEgreso: Date;
    estado: string;
    fechaCreacion: Date;
    usuarioCreacion: string;
    fechaModificacion: Date;
    usuarioModificacion: string;
    personas: PersonaModelo;

    constructor() {
    }

}
