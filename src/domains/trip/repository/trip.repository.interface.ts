import { PaginationOptionsDto } from 'src/shared/dtos/page-option.dto';
import { Trip } from '../entity/trip';

/**
 * Trip Repository Interface
 * Defines the contract for data access related to trips.
 */
export interface ITripRepository {
  /**
   * Save a new trip into the database.
   * @param trip - The trip entity to be saved.
   * @returns A promise that resolves to the saved trip.
   */
  save(trip: Trip): Promise<Trip>;

  /**
   * Retrieve a trip by its unique ID.
   * @param id - The unique identifier of the trip.
   * @returns A promise that resolves to the trip or null if not found.
   */
  getById(id: string): Promise<Trip | null>;

  /**
   * Retrieve all trips with pagination support.
   * @param options - The pagination options.
   * @returns A promise that resolves to an array of trips and the total count.
   */
  getAll(
    options: PaginationOptionsDto,
  ): Promise<{ data: Trip[]; totalCount: number }>;

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
   * Update an existing trip.
   * @param id - The unique identifier of the trip.
   * @param updateData - The fields to update.
   * @returns A promise that resolves to the updated trip.
   */
  update(id: string, updateData: Partial<Trip>): Promise<Trip>;

  /**
   * Delete a trip by its unique ID.
   * @param id - The unique identifier of the trip.
   * @returns A promise that resolves when the trip is deleted.
   */
  delete(id: string): Promise<void>;
}
