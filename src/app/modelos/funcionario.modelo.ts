import { AreaModelo } from './area.modelo';
import { PersonaModelo } from './persona.modelo';

export class FuncionarioModelo {

    funcionarioId: number;
    fechaIngreso: Date;
    fechaEgreso: Date;
    estado: string;
    fechaCreacion: Date;
    usuarioCreacion: string;
    fechaModificacion: Date;
    usuarioModificacion: string;
    personas: PersonaModelo;
    areas: AreaModelo = new AreaModelo();

    constructor() {
    }

}
