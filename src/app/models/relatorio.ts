import { Deserializable } from './deserializable';
import { Paciente } from './paciente';
import { Convenio } from './convenio';
import { Procedimento } from './procedimento';
import { Funcionario } from './funcionario';
import { Agenda } from './agenda';

export class Relatorio implements Deserializable {

    id: number;
    valor: number;
    data: Date;
    hora: string;
    paciente: number;
    convenio: number;
    procedimento: number;
    funcionario: number;
    agendamento: number;

    deserializable(input: any): this {
        return Object.assign(this, input);
    }
}

export class RelatorioList implements Deserializable {

    id: number;
    valor: number;
    data: Date;
    hora: string;
    paciente: Paciente;
    convenio: Convenio;
    procedimento: Procedimento;
    funcionario: Funcionario;
    agendamento: Agenda;

    deserializable(input: any): this {
        return Object.assign(this, input);
    }
}
