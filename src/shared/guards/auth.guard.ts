import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { User } from 'src/domains/account/entity/user';

import { IUserRepository } from 'src/domains/account/repository/user.repository.interface';
import { Customer } from 'src/domains/customer/entity/customer';
import { ICustomerRepository } from 'src/domains/customer/repository/customer.repository.interface';
import {
  CUSTOMER_REPOSITORY,
  IS_ALLOW_CUSTOMER_KEY,
  IS_PUBLIC_KEY,
  ONE_HOUR_MS,
  USER_REPOSITORY,
} from 'src/shared/constant';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,

    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (this.validatePublicRoles(context)) return true;

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not provided or malformed');
    }

    if (this.validateAllowCustomerRoles(context)) {
      const customer = await this.fetchCustomer(token);
      if (!customer) throw new UnauthorizedException('Customer not found');

      request.customer = customer;
      return true;
    }

    const blacklisted = await this.cacheManager.get(
      `blacklist:access-token:${token}`,
    );
    if (blacklisted) {
      throw new UnauthorizedException('Token is blacklisted');
    }

    try {
      const secret = this.configService.get<string>('jwt.secret');
      const payload = await this.jwtService.verifyAsync(token, { secret });

      const user = await this.fetchUser(payload.id);

      request.user = user;

      return true;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid or expired token', error);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private validatePublicRoles(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private validateAllowCustomerRoles(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_ALLOW_CUSTOMER_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private async fetchUser(userId: string): Promise<User> {
    const key = `user:${userId}`;
    const cache = await this.cacheManager.get<User | null>(key);
    if (cache)
      return new User({
        id: cache.id,
        name: cache.name,
        email: cache.email,
        password: cache.password,
        createdAt: cache.createdAt,
        updatedAt: cache.updatedAt,
      });

    const user = await this.userRepository.getById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    await this.cacheManager.set(key, user, ONE_HOUR_MS);
    return user;
  }

  private async fetchCustomer(token: string): Promise<Customer> {
    const key = `customer:${token}`;
    const cache = await this.cacheManager.get<Customer | null>(key);

    if (cache) return plainToInstance(Customer, cache);

    const customer = await this.customerRepository.getByToken(token);
    if (!customer) throw new UnauthorizedException('Customer not found');

    await this.cacheManager.set(key, customer, ONE_HOUR_MS);
    return customer;
  }
}
