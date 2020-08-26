import { Deserializable } from './deserializable';
import { Endereco } from './endereco';

export class Funcionario implements Deserializable {
    id: number;
    nome: string;
    cpf: string;
    rg: string;
    orgao_emissor: string;
    data_emissao: Date;
    crm: number;
    especialidade: string;
    telefone_fixo: string;
    celular: string;
    sexo: string;
    data_nascimento: Date;
    email: string;
    estado_civil: string;
    escolaridade: string;
    nacionalidade: string;
    naturalidade: string;
    data_inicio: Date;
    data_termino: Date;
    endereco: Endereco;
    perfil: number;
    codigo: string;


    deserializable(input: any): this {
        return Object.assign(this, input);
    }




}
