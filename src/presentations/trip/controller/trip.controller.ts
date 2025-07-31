import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { TRIP_SERVICE } from 'src/shared/constant';
import { HttpResponse } from 'src/shared/dtos/response.dto';
import { CreateTripDto } from '../dto/create-trip.dto';
import { UpdateTripDto } from '../dto/update-trip.dto';
import { PaginationOptionsDto } from 'src/shared/dtos/page-option.dto';
import { PageMetaDto } from 'src/shared/dtos/page-meta.dto';
import { ITripService } from 'src/domains/trip/service/trip.service.interface';
import { Trip } from 'src/domains/trip/entity/trip';
import { CustomerAllowed } from 'src/shared/decorators/customer-access.decorator';
import { CurrentUser } from 'src/shared/decorators/user.decorator';
import { Customer } from 'src/domains/customer/entity/customer';

@ApiBearerAuth()
@ApiTags('Trip')
@Controller('api/trip')
export class TripController {
  constructor(
    @Inject(TRIP_SERVICE)
    private readonly tripService: ITripService,
  ) {}

  /** CREATE TRIP */
  @ApiOperation({ summary: 'Create new trip' })
  @ApiCreatedResponse({
    description: 'Trip successfully created',
    type: Trip,
    isArray: false,
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @Post()
  async create(@Body() payload: CreateTripDto) {
    const trip = new Trip({
      customerID: payload.customerID,
      destinasiPerjalanan: payload.destinasiPerjalanan,
      tanggalMulaiPerjalanan: payload.tanggalMulaiPerjalanan,
      tanggalBerakhirPerjalanan: payload.tanggalBerakhirPerjalanan,
    });

    const result = await this.tripService.create(trip);

    return new HttpResponse(
      HttpStatus.CREATED,
      true,
      'Create trip successfully',
      result,
    );
  }

  /** GET LIST TRIPS (with pagination) */
  @ApiOperation({ summary: 'Get list of trips (paginated)' })
  @ApiOkResponse({
    description: 'List of trips',
    type: Trip,
    isArray: true,
  })
  @Get()
  async findAll(@Query() query: PaginationOptionsDto) {
    const { data, totalCount } = await this.tripService.findAll(query);

    return new HttpResponse(
      HttpStatus.OK,
      true,
      'Get trip list successfully',
      data,
      new PageMetaDto(query, totalCount),
    );
  }

  @CustomerAllowed()
  @Get('my/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get my trip detail',
    description:
      'Hanya bisa diakses oleh customer. Gunakan access token customer pada Authorization header.',
  })
  async getMyTripsById(
    @Param('id') id: string,
    @CurrentUser() customer: Customer,
  ) {
    const result = await this.tripService.findTripDetailByCustomer(
      customer.id,
      id,
    );

    return new HttpResponse(
      HttpStatus.OK,
      true,
      'Get trip detail successfully',
      result,
    );
  }

  @CustomerAllowed()
  @Get('my')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get my trips',
    description:
      'Hanya bisa diakses oleh customer. Gunakan access token customer pada Authorization header.',
  })
  async getMyTrips(
    @Query() query: PaginationOptionsDto,
    @CurrentUser() customer: Customer,
  ) {
    const { data, totalCount } = await this.tripService.findTripsByCustomer(
      customer.id,
      query,
    );

    return new HttpResponse(
      HttpStatus.OK,
      true,
      'Get trip list successfully',
      data,
      new PageMetaDto(query, totalCount),
    );
  }

  /** GET TRIP BY ID */
  @ApiOperation({ summary: 'Get trip by ID' })
  @ApiOkResponse({
    description: 'Trip found',
    type: Trip,
  })
  @ApiNotFoundResponse({
    description: 'Trip not found',
  })
  @Get(':id')
  async findById(@Param('id') id: string) {
    const result = await this.tripService.findById(id);

    return new HttpResponse(
      HttpStatus.OK,
      true,
      'Get trip successfully',
      result,
    );
  }

  /** UPDATE TRIP BY ID */
  @ApiOperation({ summary: 'Update trip by ID' })
  @ApiOkResponse({
    description: 'Trip updated successfully',
    type: Trip,
  })
  @ApiNotFoundResponse({
    description: 'Trip not found',
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateTripDto) {
    const updateData: Partial<Trip> = {
      ...updateDto,
      tanggalMulaiPerjalanan: updateDto.tanggalMulaiPerjalanan
        ? new Date(updateDto.tanggalMulaiPerjalanan)
        : undefined,
      tanggalBerakhirPerjalanan: updateDto.tanggalBerakhirPerjalanan
        ? new Date(updateDto.tanggalBerakhirPerjalanan)
        : undefined,
    };

    const result = await this.tripService.update(id, updateData);

    return new HttpResponse(
      HttpStatus.OK,
      true,
      'Update trip successfully',
      result,
    );
  }

  /** DELETE TRIP BY ID */
  @ApiOperation({ summary: 'Delete trip by ID' })
  @ApiOkResponse({
    description: 'Trip deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Trip not found',
  })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.tripService.delete(id);

    return new HttpResponse(HttpStatus.OK, true, 'Delete trip successfully');
  }
}
