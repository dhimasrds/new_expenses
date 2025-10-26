/**
 * Domain service for authentication-related business logic
 * Contains business rules that don't belong to a specific entity
 */
export class AuthenticationService {
  constructor(passwordHasher, tokenGenerator) {
    this.passwordHasher = passwordHasher
    this.tokenGenerator = tokenGenerator
  }

  /**
   * Validates password strength according to business rules
   * @param {string} password 
   * @returns {Object} validation result
   */
  validatePassword(password) {
    const errors = []

    if (!password || typeof password !== 'string') {
      errors.push('Password is required')
    } else {
      if (password.length < 6) {
        errors.push('Password must be at least 6 characters long')
      }
      if (password.length > 128) {
        errors.push('Password must be 128 characters or less')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Hashes a password
   * @param {string} password 
   * @returns {Promise<string>} Hashed password
   */
  async hashPassword(password) {
    const validation = this.validatePassword(password)
    if (!validation.isValid) {
      throw new Error(`Password validation failed: ${validation.errors.join(', ')}`)
    }

    return await this.passwordHasher.hash(password)
  }

  /**
   * Verifies a password against a hash
   * @param {string} password 
   * @param {string} hash 
   * @returns {Promise<boolean>}
   */
  async verifyPassword(password, hash) {
    return await this.passwordHasher.verify(password, hash)
  }

  /**
   * Generates an authentication token for a user
   * @param {User} user 
   * @returns {Promise<string>} JWT token
   */
  async generateToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      iat: Math.floor(Date.now() / 1000)
    }

    return await this.tokenGenerator.generate(payload)
  }

  /**
   * Verifies and decodes an authentication token
   * @param {string} token 
   * @returns {Promise<Object>} Token payload
   */
  async verifyToken(token) {
    return await this.tokenGenerator.verify(token)
  }

  /**
   * Checks if a user can authenticate with given credentials
   * @param {User} user 
   * @param {string} password 
   * @returns {Promise<boolean>}
   */
  async canAuthenticate(user, password) {
    if (!user || !user.password) {
      return false
    }

    return await this.verifyPassword(password, user.password)
  }
}