import { User } from '../../domain/entities/User.js'
import { LoginDTO, SignupDTO, AuthResponseDTO, UserProfileDTO } from '../dto/AuthDTO.js'

/**
 * Use case for user login
 */
export class LoginUseCase {
  constructor(userRepository, authenticationService, externalAuthService) {
    this.userRepository = userRepository
    this.authenticationService = authenticationService
    this.externalAuthService = externalAuthService // For Supabase auth
  }

  async execute(loginDTO) {
    // Validate input
    const validation = loginDTO.validate()
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
    }

    // Use external auth service (Supabase) for authentication
    const authResult = await this.externalAuthService.signIn(loginDTO.email, loginDTO.password)
    
    if (!authResult.success) {
      throw new Error('Invalid credentials')
    }

    // Get or create user in our domain
    let user = await this.userRepository.findByEmail(loginDTO.email)
    if (!user) {
      // Create user if doesn't exist in our domain
      user = new User(
        authResult.user.id,
        authResult.user.email,
        null, // Password is managed by Supabase
        authResult.user.name || null
      )
      await this.userRepository.save(user)
    }

    return AuthResponseDTO.fromUserAndToken(
      user,
      authResult.accessToken,
      authResult.refreshToken,
      authResult.expiresIn
    )
  }
}

/**
 * Use case for user signup
 */
export class SignupUseCase {
  constructor(userRepository, authenticationService, externalAuthService) {
    this.userRepository = userRepository
    this.authenticationService = authenticationService
    this.externalAuthService = externalAuthService
  }

  async execute(signupDTO) {
    // Validate input
    const validation = signupDTO.validate()
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(signupDTO.email)
    if (existingUser) {
      throw new Error('User already exists with this email')
    }

    // Use external auth service (Supabase) for signup
    const authResult = await this.externalAuthService.signUp(
      signupDTO.email, 
      signupDTO.password,
      { name: signupDTO.name }
    )
    
    if (!authResult.success) {
      throw new Error(authResult.error || 'Signup failed')
    }

    // Create user in our domain
    const user = new User(
      authResult.user.id,
      authResult.user.email,
      null, // Password is managed by Supabase
      signupDTO.name
    )

    const validation2 = user.validate()
    if (!validation2.isValid) {
      throw new Error(`User validation failed: ${validation2.errors.join(', ')}`)
    }

    const savedUser = await this.userRepository.save(user)

    return AuthResponseDTO.fromUserAndToken(
      savedUser,
      authResult.accessToken,
      authResult.refreshToken,
      authResult.expiresIn
    )
  }
}

/**
 * Use case for token verification
 */
export class VerifyTokenUseCase {
  constructor(userRepository, externalAuthService) {
    this.userRepository = userRepository
    this.externalAuthService = externalAuthService
  }

  async execute(token) {
    // Verify token with external auth service
    const authResult = await this.externalAuthService.getUser(token)
    
    if (!authResult.success || !authResult.user) {
      throw new Error('Invalid or expired token')
    }

    // Get user from our domain
    const user = await this.userRepository.findById(authResult.user.id)
    if (!user) {
      throw new Error('User not found')
    }

    return UserProfileDTO.fromUser(user)
  }
}

/**
 * Use case for user logout
 */
export class LogoutUseCase {
  constructor(externalAuthService) {
    this.externalAuthService = externalAuthService
  }

  async execute(token) {
    // Logout from external auth service
    const result = await this.externalAuthService.signOut(token)
    
    if (!result.success) {
      throw new Error('Logout failed')
    }

    return { success: true, message: 'Logged out successfully' }
  }
}

/**
 * Use case for getting user profile
 */
export class GetUserProfileUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute(userId) {
    const user = await this.userRepository.findById(userId)
    
    if (!user) {
      throw new Error('User not found')
    }

    return UserProfileDTO.fromUser(user)
  }
}