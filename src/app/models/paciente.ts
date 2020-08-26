import { TipoConvenio, TipoConvenioPaciente } from '../models/tipo-convenio';
import { Deserializable } from './deserializable';
import { Endereco } from './endereco';

export class Paciente implements Deserializable{
    id: number;
    nome: string;
    prontuario: number;
    cpf: string;
    rg: string;
    orgao_emissor: string;
    data_emissao: string;
    telefone_fixo: string;
    telefone_trabalho: string;
    celular: string;
    sexo: string;
    data_nascimento: string;
    email: string;
    estado_civil: string;
    escolaridade: string;
    profissao: string;
    recomendacao: string;
    naturalidade: string;
    nacionalidade: string;
    situacao: string;
    carteira_convenio: string;
    validade: string;
    tipo_convenio: TipoConvenioPaciente;
    endereco: Endereco;

    deserializable(input: any): this {
        return Object.assign(this, input);
    }
}

export class PacientePost implements Deserializable{
    id: number;
    nome: string;
    prontuario: number;
    cpf: string;
    rg: string;
    orgao_emissor: string;
    data_emissao: string;
    telefone_fixo: string;
    telefone_trabalho: string;
    celular: string;
    sexo: string;
    data_nascimento: string;
    email: string;
    estado_civil: string;
    escolaridade: string;
    profissao: string;
    recomendacao: string;
    naturalidade: string;
    nacionalidade: string;
    situacao: string;
    carteira_convenio: string;
    validade: string;
    tipo_convenio: number;
    endereco: Endereco;

    deserializable(input: any): this {
        return Object.assign(this, input);
    }
}
