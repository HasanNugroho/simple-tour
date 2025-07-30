import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/domains/account/entity/user';
import { IUserRepository } from 'src/domains/account/repository/user.repository.interface';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly db: Repository<UserEntity>,
  ) {}

  async getById(id: string): Promise<User | null> {
    const entity = await this.db.findOneBy({ id });
    return entity ? this.toDomain(entity) : null;
  }

  async getByEmail(email: string): Promise<User | null> {
    const entity = await this.db.findOneBy({ email });
    return entity ? this.toDomain(entity) : null;
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const entity = await this.db.findOneBy({ id });
    if (!entity) throw new NotFoundException('User not found');

    Object.assign(entity, userData);
    const updated = await this.db.save(entity);
    return this.toDomain(updated);
  }

  async save(user: User): Promise<User> {
    try {
      const entity = this.toEntity(user);
      const saved = await this.db.save(entity);
      return this.toDomain(saved);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('User already exists');
      }
      throw new InternalServerErrorException(error);
    }
  }

  private toDomain(entity: UserEntity): User {
    return new User({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
    });
  }

  private toEntity(domain: User): UserEntity {
    return new UserEntity({
      id: domain.id,
      name: domain.name,
      email: domain.email,
      password: domain.password,
    });
  }
}
