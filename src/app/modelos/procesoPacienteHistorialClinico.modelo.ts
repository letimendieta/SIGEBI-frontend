import { HistorialClinicoModelo } from './historialClinico.modelo';
import { PacienteModelo } from './paciente.modelo';

export class ProcesoPacienteHistorialClinicoModelo {

    paciente: PacienteModelo;
    historialClinico: HistorialClinicoModelo;
    alergenosIdList : number[];
	patologiasProcedimientosIdList : number[];
	patologiasFamiliaresIdList : number[];
	vacunasIdList : number[];

    constructor() {
    }

}
