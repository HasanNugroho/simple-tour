import { Trip } from 'src/domains/trip/entity/trip';
import { CustomerEntity } from 'src/infrastructures/customer/entities/customer.entity';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('trips')
export class TripEntity extends Trip {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @Column({ type: 'uuid' })
  declare customerID: string;

  @ManyToOne(() => CustomerEntity, { eager: false })
  @JoinColumn({ name: 'customerID' })
  declare customer: CustomerEntity;

  @Column({ type: 'varchar' })
  declare destinasiPerjalanan: string;

  @Column({ type: 'timestamptz' })
  declare tanggalMulaiPerjalanan: Date;

  @Column({ type: 'timestamptz' })
  declare tanggalBerakhirPerjalanan: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  declare createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  declare updatedAt: Date;

  constructor(props?: Partial<Trip>) {
    super(props ?? {});
  }
}
