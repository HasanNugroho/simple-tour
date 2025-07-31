import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import { TripEntity } from '../entities/trip.entity';
import { PaginationOptionsDto } from 'src/shared/dtos/page-option.dto';
import { ITripRepository } from 'src/domains/trip/repository/trip.repository.interface';
import { Trip } from 'src/domains/trip/entity/trip';

@Injectable()
export class TripRepository implements ITripRepository {
  constructor(
    @InjectRepository(TripEntity)
    private readonly db: Repository<TripEntity>,
  ) {}

  async save(trip: Trip): Promise<Trip> {
    try {
      const entity = this.toEntity(trip);
      const saved = await this.db.save(entity);
      return this.toDomain(saved);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('Trip already exists');
      }
      throw new InternalServerErrorException(error);
    }
  }

  async getById(id: string): Promise<Trip | null> {
    const entity = await this.db.findOne({
      where: { id },
      relations: ['customer'],
    });

    return entity ? this.toDomain(entity) : null;
  }

  async getAll(
    options: PaginationOptionsDto,
  ): Promise<{ data: Trip[]; totalCount: number }> {
    const offset = (options.page - 1) * options.limit;
    let where: FindOptionsWhere<Trip>[] = [];

    if (options.keyword) {
      where = [{ destinasiPerjalanan: ILike(`${options.keyword}%`) }];
    }

    const [result, totalCount] = await this.db.findAndCount({
      where: where.length ? where : {},
      order: {
        [options.orderby || 'createdAt']: options.order || 'DESC',
      },
      skip: offset,
      take: options.limit,
    });

    const trips = result.map((i) => this.toDomain(i));
    return { data: trips, totalCount };
  }

  async findTripsByCustomer(
    id: string,
    options: PaginationOptionsDto,
  ): Promise<{ data: Trip[]; totalCount: number }> {
    const offset = (options.page - 1) * options.limit;
    let where: FindOptionsWhere<Trip>[] = [{ customerID: id }];

    if (options.keyword) {
      where.push({ destinasiPerjalanan: ILike(`${options.keyword}%`) });
    }

    const [result, totalCount] = await this.db.findAndCount({
      where: where.length ? where : {},
      order: {
        [options.orderby || 'createdAt']: options.order || 'DESC',
      },
      skip: offset,
      take: options.limit,
    });

    const trips = result.map((i) => this.toDomain(i));
    return { data: trips, totalCount };
  }

  async update(id: string, updateData: Partial<Trip>): Promise<Trip> {
    const entity = await this.db.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException('Trip not found');
    }

    Object.assign(entity, updateData);
    const updated = await this.db.save(entity);
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.db.delete({ id });
  }

  private toDomain(entity: TripEntity): Trip {
    return new Trip({
      id: entity.id,
      customerID: entity.customerID,
      destinasiPerjalanan: entity.destinasiPerjalanan,
      tanggalMulaiPerjalanan: entity.tanggalMulaiPerjalanan,
      tanggalBerakhirPerjalanan: entity.tanggalBerakhirPerjalanan,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      customer: entity.customer
        ? {
            id: entity.customer.id,
            name: entity.customer.name,
            email: entity.customer.email,
            token: entity.customer.token,
            address: entity.customer.address,
            createdAt: entity.customer.createdAt,
            updatedAt: entity.customer.updatedAt,
          }
        : undefined,
    });
  }

  private toEntity(domain: Trip): TripEntity {
    return new TripEntity({
      id: domain.id,
      customerID: domain.customerID,
      destinasiPerjalanan: domain.destinasiPerjalanan,
      tanggalMulaiPerjalanan: domain.tanggalMulaiPerjalanan,
      tanggalBerakhirPerjalanan: domain.tanggalBerakhirPerjalanan,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    });
  }
}
