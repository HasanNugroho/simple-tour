import { CreateUserDto } from 'src/presentations/user/dto/create-user.dto';
import { User } from '../entity/user';

/**
 * Interface for the User service
 * Provides methods for handling user-related operations.
 */
export interface IUserService {
  /**
   * Create a new user.
   * @param user - The data of the user to create.
   * @returns A promise that resolves to the newly created user object.
   * @throws ConflictException if the email or username already exists.
   */
  create(user: User): Promise<User>;
}
