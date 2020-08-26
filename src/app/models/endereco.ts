import { Deserializable } from './deserializable';

export class Endereco implements Deserializable{
    id: number; 
    cep: string;
    logradouro: string; 
    numero: number;
    complemento: string; 
    bairro: string; 
    cidade: string; 
    estado: string;

    deserializable(input: any): this {
        return Object.assign(this, input);
    }
}
