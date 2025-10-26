/**
 * Register User Use Case
 * Application layer - orchestrates user registration
 */
export class RegisterUserUseCase {
  constructor(authService, userService) {
    this.authService = authService
    this.userService = userService
  }

  /**
   * Execute user registration
   */
  async execute(registrationData) {
    try {
      if (!registrationData) {
        throw new Error('Registration data is required')
      }

      const { email, password, fullName } = registrationData

      if (!email || !password) {
        throw new Error('Email and password are required')
      }

      // Register through auth service
      const authResult = await this.authService.register(email, password, {
        full_name: fullName
      })

      // Create user profile if needed (depending on your Supabase setup)
      let user = authResult.user

      return {
        success: true,
        data: {
          user,
          session: authResult.session
        },
        message: 'Registration successful'
      }
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`)
    }
  }
}