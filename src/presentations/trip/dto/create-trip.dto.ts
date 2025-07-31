import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsDateString } from 'class-validator';

export class CreateTripDto {
  @ApiProperty({
    description: 'Customer ID',
    example: 'a3f2bde2-6c6e-4e8e-9f3f-abc123',
  })
  @IsUUID()
  @IsNotEmpty()
  customerID: string;

  @ApiProperty({ description: 'Trip destination', example: 'Bali' })
  @IsString()
  @IsNotEmpty()
  destinasiPerjalanan: string;

  @ApiProperty({
    description: 'Start date and time of the trip (UTC)',
    example: '2025-07-31T08:00:00Z',
  })
  @IsDateString() // ISO 8601 format + UTC
  @IsNotEmpty()
  tanggalMulaiPerjalanan: string;

  @ApiProperty({
    description: 'End date and time of the trip (UTC)',
    example: '2025-08-05T18:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  tanggalBerakhirPerjalanan: string;
}
