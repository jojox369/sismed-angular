import { Deserializable } from './deserializable';
import { Funcionario } from './funcionario';

export class Log implements Deserializable {
    id: number;
    data: Date;
    hora: string;
    funcionario: Funcionario;
    evento: string;
    descricao: string;


    deserializable(input: any): this {
        return Object.assign(this, input);
    }
}



export class LogSave implements Deserializable {
    id: number;
    data: string;
    hora: string;
    funcionario: number;
    evento: string;
    descricao: string;


    deserializable(input: any): this {
        return Object.assign(this, input);
    }
}

