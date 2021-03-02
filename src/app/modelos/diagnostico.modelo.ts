import { EnfermedadCie10Modelo } from "./enfermedadCie10.modelo";

export class DiagnosticoModelo {

    diagnosticoId: number;
    diagnosticoPrincipal: string;
    diagnosticoSecundario: string;
    enfermedadCie10Primaria: EnfermedadCie10Modelo;
    enfermedadCie10Secundaria: EnfermedadCie10Modelo;
    enfermedadCie10PrimariaId: number;
    enfermedadCie10SecundariaId: number;
    fechaCreacion: Date;
    fechaModificacion: Date;
    usuarioCreacion: string;
    usuarioModificacion: string;

    constructor() {
    }

}
