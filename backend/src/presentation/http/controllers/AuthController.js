import { ApiResponse, ErrorCodes } from '../helpers/ApiResponse.js'

/**
 * HTTP Controller for Authentication operations
 */
export class AuthController {
  constructor(
    loginUseCase,
    signupUseCase,
    verifyTokenUseCase,
    getUserProfileUseCase
  ) {
    this.loginUseCase = loginUseCase
    this.signupUseCase = signupUseCase
    this.verifyTokenUseCase = verifyTokenUseCase
    this.getUserProfileUseCase = getUserProfileUseCase
  }

  /**
   * User login
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      const result = await this.loginUseCase.execute(req.body)
      res.json(ApiResponse.success(result))
    } catch (error) {
      console.error('Login error:', error)
      
      if (error.message.includes('Validation failed')) {
        return res.status(400).json(
          ApiResponse.error(ErrorCodes.VALIDATION_ERROR, error.message)
        )
      }

      if (error.message.includes('Authentication failed') || error.message.includes('Login failed')) {
        return res.status(401).json(
          ApiResponse.error(ErrorCodes.INVALID_CREDENTIALS, 'Invalid email or password')
        )
      }

      res.status(500).json(
        ApiResponse.error(ErrorCodes.INTERNAL_ERROR, 'Login failed')
      )
    }
  }

  /**
   * User signup
   * POST /api/auth/signup
   */
  async signup(req, res) {
    try {
      const result = await this.signupUseCase.execute(req.body)
      res.status(201).json(ApiResponse.success(result))
    } catch (error) {
      console.error('Signup error:', error)
      
      if (error.message.includes('Validation failed')) {
        return res.status(400).json(
          ApiResponse.error(ErrorCodes.VALIDATION_ERROR, error.message)
        )
      }

      if (error.message.includes('already exists') || error.message.includes('already registered')) {
        return res.status(409).json(
          ApiResponse.error(ErrorCodes.ALREADY_EXISTS, 'User already exists with this email')
        )
      }

      // Return detailed error message for debugging
      res.status(500).json(
        ApiResponse.error(ErrorCodes.INTERNAL_ERROR, error.message || 'Signup failed')
      )
    }
  }

  /**
   * Verify token
   * POST /api/auth/verify-token
   */
  async verifyToken(req, res) {
    try {
      const authHeader = req.headers.authorization
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json(
          ApiResponse.error(ErrorCodes.UNAUTHORIZED, 'No valid token provided')
        )
      }

      const token = authHeader.substring(7)
      const result = await this.verifyTokenUseCase.execute(token)
      res.json(ApiResponse.success(result))
    } catch (error) {
      console.error('Verify token error:', error)
      res.status(401).json(
        ApiResponse.error(ErrorCodes.TOKEN_EXPIRED, 'Invalid or expired token')
      )
    }
  }

  /**
   * User logout
   * POST /api/auth/logout
   */
  async logout(req, res) {
    try {
      res.json(ApiResponse.success({ message: 'Logout successful' }))
    } catch (error) {
      console.error('Logout error:', error)
      res.status(500).json(
        ApiResponse.error(ErrorCodes.INTERNAL_ERROR, 'Logout failed')
      )
    }
  }

  /**
   * Get user profile
   * GET /api/auth/profile
   */
  async getProfile(req, res) {
    try {
      const result = await this.getUserProfileUseCase.execute(req.user.id)
      res.json(ApiResponse.success(result))
    } catch (error) {
      console.error('Get profile error:', error)
      
      if (error.message.includes('not found')) {
        return res.status(404).json(
          ApiResponse.error(ErrorCodes.NOT_FOUND, 'User not found')
        )
      }

      res.status(500).json(
        ApiResponse.error(ErrorCodes.INTERNAL_ERROR, 'Failed to fetch user profile')
      )
    }
  }
}