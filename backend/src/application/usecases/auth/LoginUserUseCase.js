/**
 * Login User Use Case
 * Application layer - orchestrates user authentication
 */
export class LoginUserUseCase {
  constructor(authService, userService) {
    this.authService = authService
    this.userService = userService
  }

  /**
   * Execute user login
   */
  async execute(loginData) {
    if (!loginData) {
      throw new Error('Login data is required')
    }

    const { email, password } = loginData

    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    // Authenticate through auth service
    const authResult = await this.authService.login(email, password)

    // Return simplified auth data
    return {
      user: {
        id: authResult.user.id,
        email: authResult.user.email
      },
      accessToken: authResult.access_token
    }
  }
}