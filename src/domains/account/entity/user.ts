import { v4 as uuidv4 } from 'uuid';

export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: Partial<User>) {
    this.id = props.id ?? uuidv4();
    this.name = props.name ?? '';
    this.email = props.email ?? '';
    this.password = props.password ?? '';
  }
}
