import { Deserializable } from './deserializable';
import { Time } from '@angular/common';
import { Procedimento } from './procedimento';
import { TipoConvenio, TipoConvenioPaciente } from './tipo-convenio';
import { Paciente } from './paciente';
import { Funcionario } from './funcionario';

export class Agenda implements Deserializable {

    id: number;
    primeira_vez: number;
    compareceu: number;
    pagou: number;
    finalizado: number;
    data: Date;
    hora: string;
    observacao: string;
    procedimento: Procedimento;
    tipo_convenio: TipoConvenioPaciente;
    paciente: Paciente;
    funcionario: Funcionario;

    deserializable(input: any): this {
        return Object.assign(this, input);
    }
}

export class Agendar implements Deserializable {

    id: number;
    primeira_vez: number;
    compareceu: number;
    pagou: number;
    finalizado: number;
    data: Date;
    hora: string;
    observacao: string;
    procedimento: number;
    tipo_convenio: number;
    paciente: number;
    funcionario: number;


    deserializable(input: any): this {
        return Object.assign(this, input);
    }
}

