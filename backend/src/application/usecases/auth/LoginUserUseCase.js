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
    try {
      if (!loginData) {
        throw new Error('Login data is required')
      }

      const { email, password } = loginData

      if (!email || !password) {
        throw new Error('Email and password are required')
      }

      // Authenticate through auth service
      const authResult = await this.authService.login(email, password)

      // Return user data directly from Supabase auth result
      return {
        success: true,
        data: {
          user: authResult.user,
          access_token: authResult.access_token,
          session: authResult.session
        },
        message: 'Login successful'
      }
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`)
    }
  }
}