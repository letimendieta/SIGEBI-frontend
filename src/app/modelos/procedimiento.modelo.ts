import { PacienteModelo } from './paciente.modelo';
import { FuncionarioModelo } from './funcionario.modelo';
import { AreaModelo } from './area.modelo';
import { MotivoConsultaModelo } from './motivoConsulta.modelo';

export class ProcedimientoModelo {

    procedimientoId: number;
    notas: string;
    cantidadInsumo: number;
    motivoConsulta: MotivoConsultaModelo;
    consultaId: number;
    areas: AreaModelo;
    estado: string;
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
