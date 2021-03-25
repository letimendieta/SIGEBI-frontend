import { PacienteModelo } from './paciente.modelo';

export class ProcesoPacienteFichaClinicaModelo {

    paciente: PacienteModelo;
    alergenosIdList : number[];
	patologiasProcedimientosIdList : number[];
	patologiasFamiliaresIdList : number[];
	vacunasIdList : number[];

    constructor() {
    }

}
