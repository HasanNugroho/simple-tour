import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { USER_SERVICE } from 'src/shares/constant';
import { CreateUserDto } from '../dto/create-user.dto';
import { HttpResponse } from 'src/shares/dtos/response.dto';
import { IUserService } from 'src/domains/account/service/user.service.interface';
import { User } from 'src/domains/account/entity/user';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('api/users')
export class UserController {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
  ) {}

  @ApiOperation({ summary: 'Endpoint untuk create user' })
  @ApiCreatedResponse({
    description: 'Response success create user',
    type: User,
    isArray: false,
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @ApiConflictResponse({
    description: 'Email already exists',
  })
  @Post()
  async create(@Body() payload: CreateUserDto) {
    try {
      const user = new User({
        email: payload.email,
        name: payload.name,
        password: payload.password,
      });
      const result = await this.userService.create(user);

      const { password, ...userData } = result;

      return new HttpResponse(
        HttpStatus.CREATED,
        true,
        'create user successfully',
        userData,
      );
    } catch (error) {
      throw error;
    }
  }
}
