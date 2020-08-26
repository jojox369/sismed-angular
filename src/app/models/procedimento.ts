import { Deserializable } from './deserializable';

export class Procedimento implements Deserializable{
    id: number;
    valor: number;
    convenio: number;
    descricao: string;
    
    
    deserializable(input: any): this {
        return Object.assign(this, input);
    }

}
