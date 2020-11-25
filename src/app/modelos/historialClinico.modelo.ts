import { PacienteModelo } from './paciente.modelo';
import { FuncionarioModelo } from './funcionario.modelo';
import { Time } from '@angular/common';
import { AreaModelo } from './area.modelo';
import { AnamnesisModelo } from './anamnesis.modelo';

export class HistorialClinicoModelo {

    historialClinicoId: number;
    hora: Time;
    areas: AreaModelo = new AreaModelo();
    anamnesis: AnamnesisModelo;
    fechaCreacion: Date;
    usuarioCreacion: string;
    fechaModificacion: Date;
    usuarioModificacion: string;    
    constructor() {
    }

}
