import { TerminoEstandarModelo } from "./terminoEstandar.modelo";

export class DiagnosticoModelo {

    diagnosticoId: number;
    diagnosticoPrincipal: string;
    diagnosticoSecundario: string;
    terminoEstandarPrincipal: TerminoEstandarModelo;  
    terminoEstandarSecundario: number;
    fechaCreacion: Date;
    fechaModificacion: Date;
    usuarioCreacion: string;
    usuarioModificacion: string;

    constructor() {
    }

}
