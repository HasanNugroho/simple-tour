import { Credential, CredentialResponse } from '../entity/credential';

/**
 * Authentication service interface.
 */
export interface IAuthService {
  /**
   * Authenticate user with identifier and password.
   * @param credential - User login input (email and password)
   * @returns Access and refresh tokens
   */
  login(credential: Credential): Promise<CredentialResponse>;

  /**
   * Log out current user session.
   * @param accessToken - Access token string
   * @param refreshToken - Refresh token string
   * @returns Void
   */
  logout(accessToken: string, refreshToken: string): Promise<void>;

  /**
   * Generate new access and refresh tokens using refresh token.
   * @param userId - User ID
   * @param refreshToken - Refresh token string
   * @returns New access and refresh tokens
   */
  refreshToken(refreshToken: string): Promise<CredentialResponse>;
}
