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
