import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'user email',
    example: 'adam@user.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Nama user',
    example: 'adam',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'password',
    example: 'adam123',
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
  password!: string;
}
