import { PaginationOptionsDto } from 'src/shared/dtos/page-option.dto';
import { Trip } from '../entity/trip';

/**
 * Trip Service Interface
 * Defines the business logic contract for trips.
 */
export interface ITripService {
  /**
   * Create a new trip.
   * @param trip - The trip entity to be created.
   * @returns A promise that resolves to the created trip.
   */
  create(trip: Trip): Promise<Trip>;

  /**
   * Retrieve a trip by its unique ID.
   * @param id - The unique identifier of the trip.
   * @returns A promise that resolves to the trip or null if not found.
   */
  findById(id: string): Promise<Trip | null>;

  /**
   * Retrieve all trips with pagination.
   * @param options - The pagination options.
   * @returns A promise that resolves to the trips and the total count.
   */
  findAll(
    options: PaginationOptionsDto,
  ): Promise<{ data: Trip[]; totalCount: number }>;

  /**
   * Retrieve a trip detail by its unique ID for a specific customer.
   * @param customerId - The unique identifier of the customer (pemilik trip).
   * @param tripId - The unique identifier of the trip.
   * @returns A promise that resolves to the trip or null if not found.
   */
  findTripDetailByCustomer(
    customerId: string,
    tripId: string,
  ): Promise<Trip | null>;

  /**
   * Retrieve a trip by its unique ID.
   * @param id - The unique identifier of the customer.
   * @param options - The pagination options.
   * @returns A promise that resolves to the trip or null if not found.
   */
  findTripsByCustomer(
    id: string,
    options: PaginationOptionsDto,
  ): Promise<{ data: Trip[]; totalCount: number }>;

  /**
   * Update a trip by its ID.
   * @param id - The unique identifier of the trip.
   * @param updateData - The data to update.
   * @returns A promise that resolves to the updated trip.
   */
  update(id: string, updateData: Partial<Trip>): Promise<Trip>;

  /**
   * Delete a trip by its ID.
   * @param id - The unique identifier of the trip.
   * @returns A promise that resolves when the trip is deleted.
   */
  delete(id: string): Promise<void>;
}
