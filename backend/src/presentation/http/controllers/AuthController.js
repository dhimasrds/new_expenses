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
      res.json(result)
    } catch (error) {
      console.error('Login error:', error)
      
      if (error.message.includes('Validation failed')) {
        return res.status(400).json({
          error: 'Bad Request',
          message: error.message
        })
      }

      if (error.message.includes('Authentication failed') || error.message.includes('Login failed')) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid email or password'
        })
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Login failed'
      })
    }
  }

  /**
   * User signup
   * POST /api/auth/signup
   */
  async signup(req, res) {
    try {
      const result = await this.signupUseCase.execute(req.body)
      res.status(201).json(result)
    } catch (error) {
      console.error('Signup error:', error)
      
      if (error.message.includes('Validation failed')) {
        return res.status(400).json({
          error: 'Bad Request',
          message: error.message
        })
      }

      if (error.message.includes('already exists')) {
        return res.status(409).json({
          error: 'Conflict',
          message: 'User already exists with this email'
        })
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Signup failed'
      })
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
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'No valid token provided'
        })
      }

      const token = authHeader.substring(7)
      const result = await this.verifyTokenUseCase.execute(token)
      res.json(result)
    } catch (error) {
      console.error('Verify token error:', error)
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      })
    }
  }

  /**
   * User logout
   * POST /api/auth/logout
   */
  async logout(req, res) {
    try {
      res.json({
        success: true,
        message: 'Logout successful'
      })
    } catch (error) {
      console.error('Logout error:', error)
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Logout failed'
      })
    }
  }

  /**
   * Get user profile
   * GET /api/auth/profile
   */
  async getProfile(req, res) {
    try {
      const result = await this.getUserProfileUseCase.execute(req.user.id)
      res.json(result)
    } catch (error) {
      console.error('Get profile error:', error)
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'User not found'
        })
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch user profile'
      })
    }
  }
}