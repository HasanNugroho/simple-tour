import { PaginationOptionsDto } from 'src/shared/dtos/page-option.dto';
import { Customer } from '../entity/customer';

export interface ICustomerService {
  /**
   * Create a new customer.
   * @param customer - The data of the customer to create.
   * @returns A promise that resolves to the newly created customer object.
   * @throws ConflictException if the email or username already exists.
   */
  create(customer: Customer): Promise<Customer>;

  /**
   * Find a customer by their unique ID.
   * @param id - The unique identifier of the customer.
   * @returns A promise that resolves to the customer object or null if not found.
   */
  findById(id: string): Promise<Customer | null>;

  /**
   * Retrieve a paginated list of customers.
   * @param option - The pagination and filter options.
   * @returns A promise that resolves to an object containing:
   *  - data: An array of customers for the current page.
   *  - totalCount: The total number of customers matching the criteria.
   */
  findAll(
    option: PaginationOptionsDto,
  ): Promise<{ data: Customer[]; totalCount: number }>;

  /**
   * Update an existing customer's data.
   * @param id - The unique identifier of the customer to update.
   * @param updateData - Partial data to update on the customer.
   * @returns A promise that resolves to the updated customer object.
   */
  update(id: string, updateData: Partial<Customer>): Promise<Customer>;

  /**
   * Delete a customer by their unique ID.
   * @param id - The unique identifier of the customer to delete.
   * @returns A promise that resolves when deletion is complete.
   */
  delete(id: string): Promise<void>;
}
