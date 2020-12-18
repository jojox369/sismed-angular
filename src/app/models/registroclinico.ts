import { Deserializable } from './deserializable';

export class Registroclinico implements Deserializable {
  id: number;
  data: string;
  hora: string;
  descricao: string;
  funcionario: number;
  agendamento: number;
  qtd: number;
  nome: string;
  prontuario: number;
  funcionarioNome: string;
  pId: number;

  deserializable(input: any): this {
    return Object.assign(this, input);
  }
}
