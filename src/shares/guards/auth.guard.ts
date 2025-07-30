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
import {
  IS_PUBLIC_KEY,
  ONE_HOUR_MS,
  USER_REPOSITORY,
} from 'src/shares/constant';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,

    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const isPublic = this.validatePublicRoles(context);
    if (isPublic) return true;

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not provided or malformed');
    }

    const blacklistKey = `access_token:${token}`;
    const isBlacklisted = await this.cacheManager.get(blacklistKey);
    if (!isBlacklisted) {
      throw new UnauthorizedException('Token is blacklisted');
    }

    try {
      const secret = this.configService.get<string>('jwt.secret');

      const payload = await this.jwtService.verifyAsync(token, { secret });
      const user = await this.fetchUser(payload.id);
      request.user = user;

      return true;
    } catch (error) {
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

  private async fetchUser(userId: string): Promise<User> {
    const key = `user:${userId}`;
    const cache = await this.cacheManager.get<User | null>(key);

    if (cache) return plainToInstance(User, cache);

    const user = await this.userRepository.getById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    await this.cacheManager.set(key, user, ONE_HOUR_MS);
    return user;
  }
}
