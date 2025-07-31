import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TRIP_REPOSITORY } from 'src/shared/constant';
import { PaginationOptionsDto } from 'src/shared/dtos/page-option.dto';
import { ITripService } from 'src/domains/trip/service/trip.service.interface';
import { Trip } from 'src/domains/trip/entity/trip';
import { ITripRepository } from 'src/domains/trip/repository/trip.repository.interface';

@Injectable()
export class TripService implements ITripService {
  constructor(
    @Inject(TRIP_REPOSITORY)
    private readonly tripRepository: ITripRepository,
  ) {}

  async create(trip: Trip): Promise<Trip> {
    return await this.tripRepository.save(trip);
  }

  async findById(id: string): Promise<Trip | null> {
    return await this.tripRepository.getById(id);
  }

  async findAll(
    options: PaginationOptionsDto,
  ): Promise<{ data: Trip[]; totalCount: number }> {
    return await this.tripRepository.getAll(options);
  }

  async findTripDetailByCustomer(
    customerId: string,
    tripId: string,
  ): Promise<Trip | null> {
    const trip = await this.tripRepository.getById(tripId);

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    // validasi trip milik customer yang login
    if (trip.customerID !== customerId) {
      throw new ForbiddenException('You are not allowed to view this trip');
    }

    return trip;
  }

  async findTripsByCustomer(
    id: string,
    options: PaginationOptionsDto,
  ): Promise<{ data: Trip[]; totalCount: number }> {
    return await this.tripRepository.findTripsByCustomer(id, options);
  }

  async update(id: string, updateData: Partial<Trip>): Promise<Trip> {
    const trip = await this.tripRepository.getById(id);
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return await this.tripRepository.update(id, updateData);
  }

  async delete(id: string): Promise<void> {
    const trip = await this.tripRepository.getById(id);
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    await this.tripRepository.delete(id);
  }
}
