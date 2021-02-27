import { AreaModelo } from './area.modelo';
import { DiagnosticoModelo } from './diagnostico.modelo';
import { FuncionarioModelo } from './funcionario.modelo';
import { MotivoConsultaModelo } from './motivoConsulta.modelo';
import { TratamientoModelo } from './tratamiento.modelo';

export class ConsultaModelo {

    consultaId: number;
    motivoConsulta: MotivoConsultaModelo;
    fecha: Date;
    tratamientos: TratamientoModelo;
    diagnosticos: DiagnosticoModelo;
    funcionarios: FuncionarioModelo = new FuncionarioModelo();
    pacienteId: number;
    areas: AreaModelo = new AreaModelo();
    fechaCreacion: Date;
    fechaModificacion: Date;
    usuarioCreacion: string;
    usuarioModificacion: string;

    constructor() {
    }

}
