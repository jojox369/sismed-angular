import { Deserializable } from './deserializable';

export class DadosBancarios implements Deserializable{
    id: number
    banco: string
    agencia: string
    conta: string
    
    
    deserializable(input: any): this {
        return Object.assign(this, input);
    }
    
}