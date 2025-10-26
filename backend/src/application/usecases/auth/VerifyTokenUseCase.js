/**
 * Verify Token Use Case
 * Application layer - orchestrates token verification
 */
export class VerifyTokenUseCase {
  constructor(authService) {
    this.authService = authService
  }

  /**
   * Execute token verification
   */
  async execute(token) {
    try {
      if (!token) {
        throw new Error('Token is required')
      }

      // Verify token through auth service
      const user = await this.authService.verifyToken(token)

      return {
        success: true,
        data: {
          user,
          valid: true
        },
        message: 'Token is valid'
      }
    } catch (error) {
      return {
        success: false,
        data: {
          valid: false
        },
        message: `Token verification failed: ${error.message}`
      }
    }
  }
}