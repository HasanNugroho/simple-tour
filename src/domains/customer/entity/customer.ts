import { v4 as uuidv4 } from 'uuid';

export class Customer {
  id: string;
  name: string;
  email: string;
  token: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: Partial<Customer>) {
    this.id = props.id ?? uuidv4();
    this.name = props.name ?? '';
    this.email = props.email ?? '';
    this.token = props.token ?? '';
    this.address = props.address ?? '';
  }
}
