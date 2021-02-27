import { MotivoConsultaModelo } from "./motivoConsulta.modelo";

export class AnamnesisModelo {

    anamnesisId: number;
    antecedentes: string;
    antecedentesRemotos: string;
    pacienteId: number;
    motivoConsulta: MotivoConsultaModelo = new MotivoConsultaModelo();
    fechaCreacion: Date;
    fechaModificacion: Date;
    usuarioCreacion: string;
    usuarioModificacion: string;

    constructor() {
    }

}
