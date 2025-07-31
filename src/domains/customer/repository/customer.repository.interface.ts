import { PaginationOptionsDto } from 'src/shared/dtos/page-option.dto';
import { Customer } from '../entity/customer';

export interface ICustomerRepository {
  /**
   * @param id - The ID of the customer to get
   *
   * @returns The customer with the given ID, or null if not found
   */
  getById(id: string): Promise<Customer | null>;

  /**
   * @param email - The email of the customer to get
   *
   * @returns The customer with the given email, or null if not found
   */
  getByEmail(email: string): Promise<Customer | null>;

  /**
   * @param token - The token of the customer to get
   *
   * @returns The customer with the given token, or null if not found
   */
  getByToken(token: string): Promise<Customer | null>;

  /**
   * Retrieve a paginated list of customers.
   * @param option - The pagination and filter options.
   * @returns A promise that resolves to an object containing:
   *  - data: An array of customers for the current page.
   *  - totalCount: The total number of customers matching the criteria.
   */
  getAll(
    option: PaginationOptionsDto,
  ): Promise<{ data: Customer[]; totalCount: number }>;

  /**
   * @param customer - The customer to save
   *
   * @returns The saved customer
   */
  save(customer: Customer): Promise<Customer>;

  /**
   * @param id - identifier of the customer to update
   * @param customer - The customer to update
   *
   * @returns The updated customer
   */
  update(id: string, customerData: Partial<Customer>): Promise<Customer>;

  /**
   * @param id - identifier of the customer to delete
   *
   * @returns void
   */
  delete(id: string): Promise<void>;
}
