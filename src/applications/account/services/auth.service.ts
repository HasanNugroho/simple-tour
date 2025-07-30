import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CUSTOMER_REPOSITORY, USER_REPOSITORY } from 'src/shared/constant';
import { IAuthService } from 'src/domains/account/service/auth.service.interface';
import { IUserRepository } from 'src/domains/account/repository/user.repository.interface';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  Credential,
  CredentialResponse,
} from 'src/domains/account/entity/credential';
import { ICustomerRepository } from 'src/domains/customer/repository/customer.repository.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,

    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(credential: Credential): Promise<CredentialResponse> {
    const credentialInstance = plainToInstance(Credential, credential);

    try {
      const { email, password } = credential;

      let user = await this.userRepository.getByEmail(email);
      let role: 'employee' | 'customer' = 'employee';

      if (!user) {
        user = await this.userRepository.getByEmail(email);
        role = 'customer';
      }

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Invalid identifier or password');
      }

      return this.generateTokens(user.id, role);
    } catch (error) {
      throw error;
    }
  }

  async logout(accessToken: string, refreshToken: string): Promise<void> {
    try {
      const accessClaims = await this.decodeToken(accessToken, true);
      const refreshClaims = await this.decodeToken(refreshToken, true, true);

      await this.blacklistToken('access-token', accessToken, accessClaims.exp);
      await this.blacklistToken(
        'refresh-token',
        refreshToken,
        refreshClaims.exp,
      );
    } catch (error) {
      throw new BadRequestException('Failed to blacklist token', {
        cause: error,
      });
    }
  }

  async refreshToken(refreshToken: string): Promise<CredentialResponse> {
    try {
      const blacklistKey = `blacklist:refresh-token:${refreshToken}`;
      const isBlacklisted = await this.cacheManager.get(blacklistKey);
      if (isBlacklisted)
        throw new UnauthorizedException('Token is blacklisted');

      const claims = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('jwt.secret'),
      });

      if (claims.nbf) {
        const nbfDate = new Date(claims.nbf * 1000);
        if (new Date() < nbfDate) {
          throw new UnauthorizedException('Refresh token not yet valid');
        }
      }

      const id = claims.id;
      const role = claims.role;
      if (!id || !role) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const user =
        role === 'customer'
          ? await this.customerRepository.getById(id)
          : await this.userRepository.getById(id);

      if (!user) {
        throw new BadRequestException('User not found');
      }

      return this.generateTokens(user.id, role);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token expired');
      }
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new UnauthorizedException('Invalid refresh token', error);
    }
  }

  private async generateTokens(
    id: string,
    role: 'customer' | 'employee',
  ): Promise<CredentialResponse> {
    const tokenExpiresIn = this.configService.get<string>('jwt.expired');
    const refreshExpiresIn = this.configService.get<string>(
      'jwt.refresh_expired',
    );

    const payload = { id };

    // Generate Access Token
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: tokenExpiresIn,
    });

    // Generate Refresh Token
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: refreshExpiresIn,
      notBefore: tokenExpiresIn,
    });

    // Save token to redis
    await this.cacheManager.set(
      `access_token:${accessToken}`,
      {
        id,
        type: role,
      },
      Number(tokenExpiresIn) * 1000,
    );

    return new CredentialResponse(accessToken, refreshToken, id);
  }

  private async decodeToken(
    token: string,
    ignoreExpiration = false,
    ignoreNotBefore = false,
  ) {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('jwt.secret'),
      ignoreExpiration,
      ignoreNotBefore,
    });
  }

  private calculateTtl(exp?: number): number {
    const now = Date.now();
    if (!exp || exp * 1000 <= now) {
      return 60000;
    }
    const ttlInMs = exp * 1000 - now;
    return Math.max(ttlInMs, 60000);
  }

  private async blacklistToken(
    type: 'access-token' | 'refresh-token',
    token: string,
    exp?: number,
  ) {
    const ttl = this.calculateTtl(exp);
    const key = `blacklist:${type}:${token}`;
    await this.cacheManager.set(key, true, ttl);
  }
}
