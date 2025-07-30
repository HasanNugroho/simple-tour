import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { User } from 'src/domains/account/entity/user';
import { IUserRepository } from 'src/domains/account/repository/user.repository.interface';
import { IUserService } from 'src/domains/account/service/user.service.interface';
import { USER_REPOSITORY } from 'src/shared/constant';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async create(user: User): Promise<User> {
    const exist = await this.userRepository.getByEmail(user.email);
    if (exist) {
      throw new BadRequestException('Email is already in use');
    }

    user.password = await bcrypt.hash(user.password, 10);

    return await this.userRepository.save(user);
  }
}
