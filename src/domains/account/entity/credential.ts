import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class Credential {
  @ApiProperty({
    description: 'username or email',
    required: true,
    example: 'adam@user.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'password',
    required: true,
    example: 'adam123!',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @Matches(/[a-zA-Z]/, {
    message: 'Password must contain at least one letter.',
  })
  @Matches(/[0-9]/, { message: 'Password must contain at least one number.' })
  @Matches(/[^a-zA-Z0-9]/, {
    message: 'Password must contain at least one special character.',
  })
  password: string;
}

export class CredentialResponse {
  accessToken: string;
  refreshToken: string;
  id: string;

  constructor(accessToken: string, refreshToken: string, id: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.id = id;
  }
}
