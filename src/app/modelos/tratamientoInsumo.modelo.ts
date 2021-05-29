import { InsumoMedicoModelo } from './insumoMedico.modelo';
import { MedicamentoModelo } from './medicamento.modelo';
import { TratamientoModelo } from './tratamiento.modelo';

export class TratamientoInsumoModelo {

    tratamientoInsumoId: number;
    cantidad: number;
    tratamientos: TratamientoModelo;
    insumosMedicos: InsumoMedicoModelo;
    medicamentos: MedicamentoModelo;     
    fechaCreacion: Date;
    fechaModificacion: Date;
    usuarioCreacion: string;
    usuarioModificacion: string;

    constructor() {
    }

}
