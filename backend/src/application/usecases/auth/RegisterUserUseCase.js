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

    // Return simplified auth data
    return {
      user: {
        id: authResult.user.id,
        email: authResult.user.email
      },
      accessToken: authResult.session?.access_token
    }
  }
}