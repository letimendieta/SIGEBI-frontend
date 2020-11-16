import { ConsultaModelo } from './consulta.modelo';
import { DiagnosticoModelo } from './diagnostico.modelo'
import { TratamientoModelo } from './tratamiento.modelo'
import { TratamientoInsumoModelo } from './tratamientoInsumo.modelo';

export class ProcesoDiagnosticoTratamientoModelo {

    diagnostico: DiagnosticoModelo;
    tratamiento: TratamientoModelo;
    tratamientoInsumoList: TratamientoInsumoModelo[];
    consulta: ConsultaModelo;

    constructor() {
    }

}
