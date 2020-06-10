import { PersonaModelo } from './persona.modelo';

export class UsuarioModelo {

    usuarioId: number;
    funcionarioId: number;
    codigoUsuario: string;
    password: string;
    estado: string;
    fechaCreacion: string;
    usuarioCreacion: string;
    fechaModificacion: string;
    usuarioModificacion: string;
    personas: PersonaModelo;

    constructor() {
    }

}
