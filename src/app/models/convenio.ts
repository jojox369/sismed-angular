import { Deserializable } from './deserializable';
import { DadosBancarios } from './dados-bancarios';

export class Convenio implements Deserializable {
  id: number;
  nome: string;
  cnpj: string;
  registroAns: number;
  dataAdesao: Date;
  dadosBancarios: DadosBancarios;

  deserializable(input: any): this {
    return Object.assign(this, input);
  }
}
