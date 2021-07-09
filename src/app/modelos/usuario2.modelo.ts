import { PersonaModelo } from './persona.modelo';
import { FuncionarioModelo } from './funcionario.modelo';

export class Usuario2Modelo {

    id: number;
    nombreUsuario: string;
    password: string;
    estado: string;
    fechaCreacion: Date;
    usuarioCreacion: string;
    fechaModificacion: Date;
    usuarioModificacion: string;
    personas: PersonaModelo;
    funcionarios: FuncionarioModelo

    constructor() {
    }

}
