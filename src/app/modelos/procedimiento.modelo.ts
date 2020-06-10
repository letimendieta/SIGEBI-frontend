import { PacienteModelo } from './paciente.modelo';
import { FuncionarioModelo } from './funcionario.modelo';

export class ProcedimientoModelo {

    procedimientoId: number;
    insumoId: number;
    notas: string;
    cantidadInsumo: number;
    fecha: string;
    hora: string;
    fechaCreacion: string;
    usuarioCreacion: string;
    fechaModificacion: string;
    usuarioModificacion: string;    
    pacientes: PacienteModelo;
    funcionarios: FuncionarioModelo;

    constructor() {
    }

}
