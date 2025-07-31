import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CUSTOMER_REPOSITORY } from 'src/shared/constant';
import { ICustomerService } from 'src/domains/customer/service/customer.service.interface';
import { ICustomerRepository } from 'src/domains/customer/repository/customer.repository.interface';
import { Customer } from 'src/domains/customer/entity/customer';
import * as crypto from 'crypto';
import { PaginationOptionsDto } from 'src/shared/dtos/page-option.dto';

@Injectable()
export class CustomerService implements ICustomerService {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async create(customer: Customer): Promise<Customer> {
    const exist = await this.customerRepository.getByEmail(customer.email);
    if (exist) {
      throw new BadRequestException('Email is already in use');
    }

    customer.token = this.generateRandomString(16);

    return await this.customerRepository.save(customer);
  }

  async findById(id: string): Promise<Customer | null> {
    return await this.customerRepository.getById(id);
  }

  async findAll(
    option: PaginationOptionsDto,
  ): Promise<{ data: Customer[]; totalCount: number }> {
    return await this.customerRepository.getAll(option);
  }

  async update(id: string, updateData: Partial<Customer>): Promise<Customer> {
    const customer = await this.customerRepository.getById(id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return await this.customerRepository.update(id, updateData);
  }

  async delete(id: string): Promise<void> {
    const customer = await this.customerRepository.getById(id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    await this.customerRepository.delete(id);
  }

  private generateRandomString(length: number): string {
    const bytes = Math.ceil(length / 2);

    const randomBytes = crypto.randomBytes(bytes);
    const hexString = randomBytes.toString('hex');

    return hexString.slice(0, length);
  }
}
