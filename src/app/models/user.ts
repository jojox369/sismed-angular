import { Deserializable } from './deserializable';

export class User implements Deserializable {
  id: number;
  username: string;
  email: string;
  deserializable(input: any): this {
    return Object.assign(this, input);
  }
}
