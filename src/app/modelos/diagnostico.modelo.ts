export class DiagnosticoModelo {

    diagnosticoId: number;
    diagnosticoPrincipal: string;
    diagnosticoSecundario: string;
    consultaId: number;
    terminoEstandarPrincipal: number;  
    terminoEstandarSecundario: number;
    fechaCreacion: Date;
    fechaModificacion: Date;
    usuarioCreacion: string;
    usuarioModificacion: string;

    constructor() {
    }

}
