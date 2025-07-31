import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';
import { Customer } from 'src/domains/customer/entity/customer';

@Entity('customer')
export class CustomerEntity extends Customer {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @Column({ type: 'varchar', length: 100 })
  declare name: string;

  @Column({ type: 'varchar', unique: true, length: 100 })
  declare email: string;

  @Column({ type: 'varchar', length: 255 })
  declare address: string;

  @Column({ type: 'varchar' })
  declare token: string;

  @CreateDateColumn({ type: 'timestamptz' })
  declare createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  declare updatedAt: Date;

  constructor(props?: Partial<Customer>) {
    super(props ?? {});
  }
}
