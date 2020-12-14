import { Deserializable } from './deserializable';
import { Convenio } from './convenio';

export class TipoConvenio implements Deserializable {
  id: number;
  nome: string;
  convenio: number;

  deserializable(input: any): this {
    return Object.assign(this, input);
  }
}

export class TipoConvenioPaciente implements Deserializable {
  id: number;
  nome: string;
  convenio: Convenio;

  deserializable(input: any): this {
    return Object.assign(this, input);
  }
}
