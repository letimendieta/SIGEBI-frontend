import { PacienteModelo } from './paciente.modelo';
import { FuncionarioModelo } from './funcionario.modelo';

export class SignoVitalModelo {

    signoVitalId: number;      
    fecha: Date;
    pulso: number;
    frecuenciaCardiaca: number;
    frecuenciaRespiratoria: number;
    presionSistolica: number;
    presiondiastolica: number;
    temperatura: number;
    peso: number;
    talla: number;
    indiceMasaCorporal: number;
    ciaAbdominal: number;
    notas: string;  
    fechaCreacion: Date;
    usuarioCreacion: string;
    fechaModificacion: Date;
    usuarioModificacion: string;    
    pacientes: PacienteModelo = new PacienteModelo();
    funcionarios: FuncionarioModelo = new FuncionarioModelo();

    constructor() {
    }

}
