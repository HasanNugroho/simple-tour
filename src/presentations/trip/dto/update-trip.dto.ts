import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateTripDto {
  @ApiPropertyOptional({
    description: 'Customer ID yang memesan trip',
    example: 'd7c9a480-3e91-4f8c-9b7f-92b59d3b05e0',
  })
  @IsUUID()
  @IsOptional()
  customerID?: string;

  @ApiPropertyOptional({
    description: 'Tanggal mulai perjalanan (UTC, format ISO 8601)',
    example: '2025-08-01T08:00:00Z',
  })
  @IsDateString(
    { strict: true },
    { message: 'tanggalMulaiPerjalanan harus dalam format ISO 8601 UTC' },
  )
  @IsOptional()
  tanggalMulaiPerjalanan?: string;

  @ApiPropertyOptional({
    description: 'Tanggal berakhir perjalanan (UTC, format ISO 8601)',
    example: '2025-08-05T18:00:00Z',
  })
  @IsDateString(
    { strict: true },
    { message: 'tanggalBerakhirPerjalanan harus dalam format ISO 8601 UTC' },
  )
  @IsOptional()
  tanggalBerakhirPerjalanan?: string;

  @ApiPropertyOptional({
    description: 'Destinasi perjalanan',
    example: 'Bali, Indonesia',
  })
  @IsString()
  @IsOptional()
  destinasiPerjalanan?: string;
}
