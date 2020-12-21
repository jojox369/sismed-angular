import { Deserializable } from './deserializable';
import { Funcionario } from './funcionario';
import { Paciente } from './paciente';

export class Registroclinico implements Deserializable {
  id: number;
  data: string;
  hora: string;
  descricao: string;
  funcionario: number;
  agendamento: number;
  quantidade: number;
  nome: string;
  prontuario: number;
  funcionarioNome: string;
  pId: number;

  deserializable(input: any): this {
    return Object.assign(this, input);
  }
}

export class RegistroclinicoDetails implements Deserializable {
  id: number;
  data: string;
  hora: string;
  descricao: string;
  funcionario: Funcionario;
  agendamento: number;
  paciente: Paciente

  deserializable(input: any): this {
    return Object.assign(this, input);
  }
}



