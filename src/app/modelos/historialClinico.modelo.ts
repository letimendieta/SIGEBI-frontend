import { PacienteModelo } from './paciente.modelo';
import { FuncionarioModelo } from './funcionario.modelo';
import { Time } from '@angular/common';
import { AreaModelo } from './area.modelo';
import { AnamnesisModelo } from './anamnesis.modelo';

export class HistorialClinicoModelo {

    historialClinicoId: number;
    pacientes: PacienteModelo = new PacienteModelo();
    areas: AreaModelo = new AreaModelo();
    fechaCreacion: Date;
    usuarioCreacion: string;
    fechaModificacion: Date;
    usuarioModificacion: string;    
    constructor() {
    }

}
