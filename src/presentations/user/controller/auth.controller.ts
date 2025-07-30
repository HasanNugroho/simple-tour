import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import {
  ApiOperation,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/domains/account/entity/user';
import { IAuthService } from 'src/domains/account/service/auth.service.interface';
import { AUTH_SERVICE, USER_SERVICE } from 'src/shares/constant';
import { HttpResponse } from 'src/shares/dtos/response.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { Credential } from 'src/domains/account/entity/credential';
import { TokenPayloadDto } from '../dto/auth.dto';
import { IUserService } from 'src/domains/account/service/user.service.interface';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: IAuthService,

    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
  ) {}

  @ApiOperation({ summary: 'Login' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Invalid identifier or password' })
  // @Public()
  @Post('login')
  async create(@Body() payload: Credential) {
    const result = await this.authService.login(payload);
    return new HttpResponse(
      HttpStatus.OK,
      true,
      'User logged in successfully',
      result,
    );
  }

  @ApiOperation({ summary: 'Register' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Invalid identifier or password' })
  // @Public()
  @Post('register')
  async register(@Body() payload: CreateUserDto) {
    const user = new User({
      email: payload.email,
      name: payload.name,
      password: payload.password,
    });
    const result = await this.userService.create(user);
    return new HttpResponse(
      HttpStatus.CREATED,
      true,
      'User registered successfully',
      null,
    );
  }

  //   @ApiBearerAuth()
  //   @Get('me')
  //   async me(@CurrentUser() user: User) {
  //     return new HttpResponse(
  //       HttpStatus.OK,
  //       true,
  //       'Fetch user successfully',
  //       user.toResponse(),
  //     );
  //   }

  //   @ApiBearerAuth()
  //   @Post('logout')
  //   async logout(@Req() req: any, @Body() body: TokenPayloadDto) {
  //     const accessToken = req.headers['authorization']?.split(' ')[1];
  //     const refreshToken = body.refreshToken;

  //     if (!accessToken || !refreshToken) {
  //       throw new BadRequestException('Access token or refresh token is missing');
  //     }

  //     await this.authService.logout(accessToken, refreshToken);
  //     return new HttpResponse(
  //       HttpStatus.OK,
  //       true,
  //       'User logged out successfully',
  //       null,
  //     );
  //   }

  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiBadRequestResponse({ description: 'Missing or invalid refresh token' })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired refresh token' })
  // @Public()
  @Post('refresh-token')
  async refreshToken(@Body() body: TokenPayloadDto) {
    const { refreshToken } = body;

    if (!refreshToken) {
      throw new BadRequestException('User ID and refresh token are required');
    }

    const result = await this.authService.refreshToken(refreshToken);
    return new HttpResponse(
      HttpStatus.OK,
      true,
      'Token refreshed successfully',
      result,
    );
  }
}
