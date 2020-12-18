import { Deserializable } from './deserializable';
import { Convenio } from './convenio'

export class Procedimento implements Deserializable {
  id: number;
  valor: number;
  convenio: Convenio;
  descricao: string;


  deserializable(input: any): this {
    return Object.assign(this, input);
  }

}
