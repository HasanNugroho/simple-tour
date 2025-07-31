import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'customer email',
    example: 'adam@customer.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Nama customer',
    example: 'adam',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Alamat customer',
    example: 'Yogyakarta',
  })
  @IsString()
  address!: string;
}
