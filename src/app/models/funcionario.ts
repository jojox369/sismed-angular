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
  telefoneFixo: string;
  celular: string;
  sexo: string;
  dataNascimento: Date;
  email: string;
  estadoCivil: string;
  escolaridade: string;
  nacionalidade: string;
  naturalidade: string;
  dataInicio: Date;
  dataTermino: Date;
  endereco: Endereco;
  perfilId: number;
  codigo: string;


  deserializable(input: any): this {
    return Object.assign(this, input);
  }




}
