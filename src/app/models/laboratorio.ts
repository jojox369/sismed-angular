import { Deserializable } from './deserializable';
import { Endereco } from './endereco';

export class Laboratorio implements Deserializable {

  id: number;
  cnpj: string;
  nome: string;
  responsavel: string;
  telefoneFixo: string;
  email: string;
  endereco: Endereco;

  deserializable(input: any): this {
    return Object.assign(this, input);
  }
}
