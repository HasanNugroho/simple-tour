import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import { CustomerEntity } from '../entities/customer.entity';
import { Customer } from 'src/domains/customer/entity/customer';
import { ICustomerRepository } from 'src/domains/customer/repository/customer.repository.interface';
import { PaginationOptionsDto } from 'src/shared/dtos/page-option.dto';

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly db: Repository<CustomerEntity>,
  ) {}

  async getById(id: string): Promise<Customer | null> {
    const entity = await this.db.findOneBy({ id });
    return entity ? this.toDomain(entity) : null;
  }

  async getByEmail(email: string): Promise<Customer | null> {
    const entity = await this.db.findOneBy({ email });
    return entity ? this.toDomain(entity) : null;
  }

  async getByToken(token: string): Promise<Customer | null> {
    const entity = await this.db.findOneBy({ token });
    return entity ? this.toDomain(entity) : null;
  }

  async getAll(
    option: PaginationOptionsDto,
  ): Promise<{ data: Customer[]; totalCount: number }> {
    const offset = (option.page - 1) * option.limit;
    let where: FindOptionsWhere<Customer>[] = [];

    if (option.keyword) {
      where = [
        { name: ILike(`${option.keyword}%`) },
        { email: ILike(`${option.keyword}%`) },
      ];
    }

    const [result, totalCount] = await this.db.findAndCount({
      where: where.length ? where : {},
      order: {
        [option.orderby || 'createdAt']: option.order || 'DESC',
      },
      skip: offset,
      take: option.limit,
    });

    const customers = result.map((i) => this.toDomain(i));
    return { data: customers, totalCount };
  }

  async update(id: string, customerData: Partial<Customer>): Promise<Customer> {
    const entity = await this.db.findOneBy({ id });
    if (!entity) throw new NotFoundException('Customer not found');

    Object.assign(entity, customerData);
    const updated = await this.db.save(entity);
    return this.toDomain(updated);
  }

  async save(customer: Customer): Promise<Customer> {
    try {
      const entity = this.toEntity(customer);
      const saved = await this.db.save(entity);
      return this.toDomain(saved);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('Customer already exists');
      }
      throw new InternalServerErrorException(error);
    }
  }

  async delete(id: string): Promise<void> {
    await this.db.delete({ id });
  }

  private toDomain(entity: CustomerEntity): Customer {
    return new Customer({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      address: entity.address,
      token: entity.token,
    });
  }

  private toEntity(domain: Customer): CustomerEntity {
    return new CustomerEntity({
      id: domain.id,
      name: domain.name,
      email: domain.email,
      address: domain.address,
      token: domain.token,
    });
  }
}
