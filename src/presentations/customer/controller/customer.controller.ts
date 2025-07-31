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
import { CUSTOMER_SERVICE } from 'src/shared/constant';
import { HttpResponse } from 'src/shared/dtos/response.dto';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { Customer } from 'src/domains/customer/entity/customer';
import { ICustomerService } from 'src/domains/customer/service/customer.service.interface';
import { PaginationOptionsDto } from 'src/shared/dtos/page-option.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { PageMetaDto } from 'src/shared/dtos/page-meta.dto';

@ApiBearerAuth()
@ApiTags('Customer')
@Controller('api/customer')
export class CustomerController {
  constructor(
    @Inject(CUSTOMER_SERVICE)
    private readonly customerService: ICustomerService,
  ) {}

  /** CREATE CUSTOMER */
  @ApiOperation({ summary: 'Endpoint untuk create customer' })
  @ApiCreatedResponse({
    description: 'Response success create customer',
    type: Customer,
    isArray: false,
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @ApiConflictResponse({
    description: 'Email already exists',
  })
  @Post()
  async create(@Body() payload: CreateCustomerDto) {
    const customer = new Customer({
      email: payload.email,
      name: payload.name,
      address: payload.address,
    });
    const result = await this.customerService.create(customer);

    return new HttpResponse(
      HttpStatus.CREATED,
      true,
      'Create customer successfully',
      result,
    );
  }

  /** GET LIST CUSTOMERS (with pagination) */
  @ApiOperation({ summary: 'Get list of customers (paginated)' })
  @ApiOkResponse({
    description: 'List of customers',
    type: Customer,
    isArray: true,
  })
  @Get()
  async findAll(@Query() query: PaginationOptionsDto) {
    const { data, totalCount } = await this.customerService.findAll(query);

    return new HttpResponse(
      HttpStatus.OK,
      true,
      'Get customer list successfully',
      data,
      new PageMetaDto(query, totalCount),
    );
  }

  /** GET CUSTOMER BY ID */
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiOkResponse({
    description: 'Customer found',
    type: Customer,
  })
  @ApiNotFoundResponse({
    description: 'Customer not found',
  })
  @Get(':id')
  async findById(@Param('id') id: string) {
    const result = await this.customerService.findById(id);

    return new HttpResponse(
      HttpStatus.OK,
      true,
      'Get customer successfully',
      result,
    );
  }

  /** UPDATE CUSTOMER BY ID */
  @ApiOperation({ summary: 'Update customer by ID' })
  @ApiOkResponse({
    description: 'Customer updated successfully',
    type: Customer,
  })
  @ApiNotFoundResponse({
    description: 'Customer not found',
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: UpdateCustomerDto) {
    const result = await this.customerService.update(id, updateData);

    return new HttpResponse(
      HttpStatus.OK,
      true,
      'Update customer successfully',
      result,
    );
  }

  /** DELETE CUSTOMER BY ID */
  @ApiOperation({ summary: 'Delete customer by ID' })
  @ApiOkResponse({
    description: 'Customer deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Customer not found',
  })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.customerService.delete(id);

    return new HttpResponse(
      HttpStatus.OK,
      true,
      'Delete customer successfully',
    );
  }
}
