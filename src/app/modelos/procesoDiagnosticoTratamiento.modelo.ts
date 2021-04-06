import { AnamnesisModelo } from './anamnesis.modelo';
import { ConsultaModelo } from './consulta.modelo';
import { DiagnosticoModelo } from './diagnostico.modelo'
import { FichaMedicaModelo } from './fichaMedica.modelo';
import { HistorialClinicoModelo } from './historialClinico.modelo';
import { TratamientoModelo } from './tratamiento.modelo'
import { TratamientoInsumoModelo } from './tratamientoInsumo.modelo';

export class ProcesoDiagnosticoTratamientoModelo {

    anamnesis: AnamnesisModelo;
    diagnostico: DiagnosticoModelo;
    tratamiento: TratamientoModelo;
    tratamientoInsumoList: TratamientoInsumoModelo[];
    consulta: ConsultaModelo;
    fichaMedicaList: FichaMedicaModelo[];
    historialClinico: HistorialClinicoModelo;

    constructor() {
    }

}
