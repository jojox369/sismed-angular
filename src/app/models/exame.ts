import { Laboratorio } from './laboratorio';
import { Paciente } from './paciente';
import { TipoConvenio, TipoConvenioPaciente } from './tipo-convenio';
import { Deserializable } from './deserializable';
import { Funcionario } from './funcionario';

export class Exame implements Deserializable{

  id: number;
  nome: string;
  descricao: string;
  data_coleta: Date;
  data_envio: Date;
  data_retorno: Date;
  funcionario_laboratorio: string;
  valor: number;
  tipo_convenio: TipoConvenioPaciente;
  paciente: Paciente;
  funcionario: Funcionario;
  laboratorio: Laboratorio;


  deserializable(input: any): this {
    return Object.assign(this, input);
  }
}

export class ExameDetail implements Deserializable{

  id: number;
  nome: string;
  descricao: string;
  data_coleta: Date;
  data_envio: Date;
  data_retorno: Date;
  funcionario_laboratorio: string;
  valor: number;
  tipo_convenio: number;
  paciente: number;
  funcionario: number;
  laboratorio: number;


  deserializable(input: any): this {
    return Object.assign(this, input);
  }
}

