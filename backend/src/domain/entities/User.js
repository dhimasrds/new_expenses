export class User {
  constructor(id, email, password = null, name = null, createdAt = null, updatedAt = null) {
    this.id = id
    this.email = email
    this.password = password // Will be hashed
    this.name = name
    this.createdAt = createdAt || new Date()
    this.updatedAt = updatedAt || new Date()
  }

  /**
   * Validates the user according to business rules
   * @returns {Object} validation result with isValid boolean and errors array
   */
  validate() {
    const errors = []

    // Email validation
    if (!this.email || typeof this.email !== 'string') {
      errors.push('Email is required and must be a string')
    } else if (!this.isValidEmail()) {
      errors.push('Email must be a valid email format')
    }

    // Name validation (if provided)
    if (this.name !== null) {
      if (typeof this.name !== 'string') {
        errors.push('Name must be a string')
      } else if (this.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long')
      } else if (this.name.length > 100) {
        errors.push('Name must be 100 characters or less')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Validates email format according to business rules
   * @returns {boolean}
   */
  isValidEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(this.email)
  }

  /**
   * Updates user information
   * @param {Object} data - Object containing email, name
   */
  update(data) {
    if (data.email !== undefined) {
      this.email = data.email.toLowerCase().trim()
    }
    if (data.name !== undefined) {
      this.name = data.name
    }
    this.updatedAt = new Date()
  }

  /**
   * Sets the user's password (should be hashed before calling this)
   * @param {string} hashedPassword 
   */
  setPassword(hashedPassword) {
    this.password = hashedPassword
    this.updatedAt = new Date()
  }

  /**
   * Returns a safe representation without sensitive data
   * @returns {Object}
   */
  toSafeJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  /**
   * Returns a complete representation (for internal use only)
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      password: this.password,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  /**
   * Creates a User from a plain object
   * @param {Object} data 
   * @returns {User}
   */
  static fromJSON(data) {
    return new User(
      data.id,
      data.email,
      data.password,
      data.name,
      data.createdAt,
      data.updatedAt
    )
  }
}