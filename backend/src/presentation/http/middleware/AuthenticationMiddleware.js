/**
 * Authentication middleware using clean architecture
 */
export class AuthenticationMiddleware {
  constructor(verifyTokenUseCase) {
    this.verifyTokenUseCase = verifyTokenUseCase
  }

  /**
   * Middleware function to authenticate users
   */
  authenticate() {
    return async (req, res, next) => {
      try {
        const authHeader = req.headers.authorization
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({
            error: 'Unauthorized',
            message: 'No valid token provided. Please include Authorization header with Bearer token.'
          })
        }

        const token = authHeader.substring(7)
        console.log('🔑 Verifying token:', token.substring(0, 50) + '...')
        
        const result = await this.verifyTokenUseCase.execute(token)
        
        if (!result.success) {
          throw new Error(result.message)
        }
        
        const user = result.data.user
        console.log('✅ User authenticated:', user.email)
        
        req.user = user
        next()
      } catch (error) {
        console.error('❌ Authentication error:', error.message)
        
        if (error.message.includes('Invalid or expired token') || error.message.includes('User not found')) {
          return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid or expired token'
          })
        }

        res.status(500).json({
          error: 'Internal Server Error',
          message: 'Authentication failed'
        })
      }
    }
  }
}