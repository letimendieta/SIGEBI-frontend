import { InsumoMedicoModelo } from './insumoMedico.modelo';
import { MedicamentoModelo } from './medicamento.modelo';
import { ProcedimientoModelo } from './procedimiento.modelo';

export class ProcedimientoInsumoModelo {

    procedimientoInsumoId: number;
    cantidad: number;
    procedimientos: ProcedimientoModelo;
    insumosMedicos: InsumoMedicoModelo;
    medicamentos: MedicamentoModelo;    
    estado: string;
    fechaCreacion: Date;
    fechaModificacion: Date;
    usuarioCreacion: string;
    usuarioModificacion: string;

    constructor() {
    }

}
