import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';
import { User } from 'src/domains/account/entity/user';

@Entity('users')
export class UserEntity extends User {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @Column({ type: 'varchar', length: 100 })
  declare name: string;

  @Column({ type: 'varchar', unique: true })
  declare email: string;

  @Column({ type: 'varchar' })
  declare password: string;

  @CreateDateColumn({ type: 'timestamptz' })
  declare createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  declare updatedAt: Date;

  constructor(props?: Partial<User>) {
    super(props ?? {});
  }
}
