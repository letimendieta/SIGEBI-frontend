import { PacienteModelo } from './paciente.modelo';
import { FuncionarioModelo } from './funcionario.modelo';
import { Time } from '@angular/common';

export class HistorialClinicoModelo {

    historialClinicoId: number;
    hora: Time;
    areaId: number;
    fechaCreacion: Date;
    usuarioCreacion: string;
    fechaModificacion: Date;
    usuarioModificacion: string;    
    pacientes: PacienteModelo;

    constructor() {
    }

}
