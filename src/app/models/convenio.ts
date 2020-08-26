import { Deserializable } from './deserializable';
import {DadosBancarios} from './dados-bancarios';

export class Convenio implements Deserializable{
    id: number;
    nome: string;
    cnpj: string;
    registro_ans: number;
    data_adesao: Date;
    dados_bancarios: DadosBancarios;

    deserializable(input: any): this {
        return Object.assign(this, input);
    }
}
