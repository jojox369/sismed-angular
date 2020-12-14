import { Deserializable } from './deserializable';
import { Endereco } from './endereco';

export class Funcionario implements Deserializable {
  id: number;
  nome: string;
  cpf: string;
  rg: string;
  orgaoEmissor: string;
  dataEmissao: Date;
  crm: number;
  especialidade: string;
  telefone_fixo: string;
  celular: string;
  sexo: string;
  dataNascimento: Date;
  email: string;
  estado_civil: string;
  escolaridade: string;
  nacionalidade: string;
  naturalidade: string;
  dataInicio: Date;
  dataTermino: Date;
  endereco: Endereco;
  perfil: number;
  codigo: string;


  deserializable(input: any): this {
    return Object.assign(this, input);
  }




}
