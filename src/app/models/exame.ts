import { Laboratorio } from './laboratorio';
import { Paciente } from './paciente';
import { TipoConvenio, TipoConvenioPaciente } from './tipo-convenio';
import { Deserializable } from './deserializable';
import { Funcionario } from './funcionario';

export class Exame implements Deserializable {

  id: number;
  nome: string;
  descricao: string;
  dataColeta: Date;
  dataEnvio: Date;
  dataRetorno: Date;
  funcionarioLaboratorio: string;
  valor: number;
  tipoConvenio: TipoConvenioPaciente;
  paciente: Paciente;
  funcionario: Funcionario;
  laboratorio: Laboratorio;


  deserializable(input: any): this {
    return Object.assign(this, input);
  }
}


