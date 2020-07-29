import { PacienteModelo } from './paciente.modelo';
import { FuncionarioModelo } from './funcionario.modelo';

export class ProcedimientoModelo {

    procedimientoId: number;
    insumoId: number;
    notas: string;
    cantidadInsumo: number;
    fecha: Date;
    fechaCreacion: Date;
    usuarioCreacion: string;
    fechaModificacion: Date;
    usuarioModificacion: string;    
    pacientes: PacienteModelo;
    funcionarios: FuncionarioModelo;

    constructor() {
    }

}
