import { PacienteModelo } from './paciente.modelo';
import { FuncionarioModelo } from './funcionario.modelo';
import { AreaModelo } from './area.modelo';
import { Time } from '@angular/common';

export class CitaModelo {

    citaId: number;
    fecha: Date;
    hora: Time;
    areaId: number;
    estado:string;
    fechaCreacion: Date;
    usuarioCreacion: string;
    fechaModificacion: Date;
    usuarioModificacion: string;    
    pacientes: PacienteModelo;
    funcionarios: FuncionarioModelo;
    areas: AreaModelo;

    constructor() {
    }

}
