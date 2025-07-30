import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { User } from 'src/domains/account/entity/user';
import { IUserRepository } from 'src/domains/account/repository/user.repository.interface';
import { IUserService } from 'src/domains/account/service/user.service.interface';
import { CUSTOMER_REPOSITORY } from 'src/shared/constant';
import * as bcrypt from 'bcrypt';
import { ICustomerService } from 'src/domains/customer/service/customer.service.interface';
import { ICustomerRepository } from 'src/domains/customer/repository/customer.repository.interface';
import { Customer } from 'src/domains/customer/entity/customer';

@Injectable()
export class CustomerService implements ICustomerService {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
  ) {}

  create(customer: Customer): Promise<Customer> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<Customer | null> {
    throw new Error('Method not implemented.');
  }
  update(id: string, updateData: Partial<Customer>): Promise<Customer> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
