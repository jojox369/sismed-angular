import { TipoConvenio, TipoConvenioPaciente } from '../models/tipo-convenio';
import { Deserializable } from './deserializable';
import { Endereco } from './endereco';

export class Paciente implements Deserializable {
  nome: string;
  prontuario: number;
  cpf: string;
  rg: string;
  orgaoEmissor: string;
  dataEmissao: string;
  telefoneFixo: string;
  telefoneTrabalho: string;
  celular: string;
  sexo: string;
  dataNascimento: string;
  email: string;
  estadoCivil: string;
  escolaridade: string;
  profissao: string;
  recomendacao: string;
  naturalidade: string;
  nacionalidade: string;
  situacao: string;
  carteiraConvenio: string;
  validade: string;
  tipoConvenio: TipoConvenioPaciente;
  endereco: Endereco;

  deserializable(input: any): this {
    return Object.assign(this, input);
  }
}

export class PacientePost implements Deserializable {
  nome: string;
  prontuario: number;
  cpf: string;
  rg: string;
  orgaoEmissor: string;
  dataEmissao: string;
  telefoneFixo: string;
  telefoneTrabalho: string;
  celular: string;
  sexo: string;
  dataNascimento: string;
  email: string;
  estadoCivil: string;
  escolaridade: string;
  profissao: string;
  recomendacao: string;
  naturalidade: string;
  nacionalidade: string;
  situacao: string;
  carteiraConvenio: string;
  validade: string;
  tipoConvenio: number;
  endereco: Endereco;

  deserializable(input: any): this {
    return Object.assign(this, input);
  }
}
