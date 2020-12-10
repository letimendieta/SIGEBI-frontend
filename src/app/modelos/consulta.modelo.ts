import { AreaModelo } from './area.modelo';
import { DiagnosticoModelo } from './diagnostico.modelo';
import { TratamientoModelo } from './tratamiento.modelo';

export class ConsultaModelo {

    consultaId: number;
    fecha: Date;
    tratamientos: TratamientoModelo;
    diagnosticos: DiagnosticoModelo;
    historialClinicoId: string;
    areas: AreaModelo;
    fechaCreacion: Date;
    fechaModificacion: Date;
    usuarioCreacion: string;
    usuarioModificacion: string;

    constructor() {
    }

}
