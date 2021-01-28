import { CarreraModelo } from './carrera.modelo';
import { DepartamentoModelo } from './departamento.modelo';
import { DependenciaModelo } from './dependencia.modelo';
import { EstamentoModelo } from './estamento.modelo';

export class PersonaModelo {

    personaId: number;
    cedula: string;
    nombres: string;
    apellidos: string;
    edad: number;
    direccion: string;
    email: string;
    estadoCivil:string;
    fechaNacimiento: Date;
    nacionalidad: string;
    sexo: string;
    telefono: string;
    celular: string;
    observacion: string;
    carreras: CarreraModelo;
    departamentos: DepartamentoModelo;
    dependencias: DependenciaModelo;
    estamentos: EstamentoModelo;
    fechaCreacion: Date;
    fechaModificacion: Date;
    usuarioCreacion: string;
    usuarioModificacion: string;

    constructor() {
    }

}
