import { Deserializable } from './deserializable';

export class Registroclinico implements Deserializable{
    id: number;
    data: string;
    hora: string;
    descricao: string;
    paciente: number;
    funcionario: number;
    agendamento: number;
    qtd: number;
    nome: string;
    prontuario: number;
    func_nome: string;
    pId: number;

    deserializable(input: any): this {
        return Object.assign(this, input);
    }
}
