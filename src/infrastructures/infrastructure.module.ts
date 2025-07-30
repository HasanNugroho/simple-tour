import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CUSTOMER_REPOSITORY, USER_REPOSITORY } from 'src/shared/constant';
import { UserRepository } from './account/repository/user.repository';
import { UserEntity } from './account/entities/user.entity';
import { CustomerRepository } from './customer/repository/customer.repository';
import { CustomerEntity } from './customer/entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, CustomerEntity])],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: CustomerRepository,
    },
  ],
  exports: [USER_REPOSITORY, CUSTOMER_REPOSITORY],
})
export class InfrastructureModule {}
