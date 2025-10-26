/**
 * Data Transfer Objects for Authentication operations
 */

export class LoginDTO {
  constructor(email, password) {
    this.email = email?.toLowerCase()?.trim()
    this.password = password
  }

  static fromRequest(requestBody) {
    return new LoginDTO(
      requestBody.email,
      requestBody.password
    )
  }

  validate() {
    const errors = []

    if (!this.email) {
      errors.push('Email is required')
    }
    if (!this.password) {
      errors.push('Password is required')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

export class SignupDTO {
  constructor(email, password, name = null) {
    this.email = email?.toLowerCase()?.trim()
    this.password = password
    this.name = name?.trim()
  }

  static fromRequest(requestBody) {
    return new SignupDTO(
      requestBody.email,
      requestBody.password,
      requestBody.name
    )
  }

  validate() {
    const errors = []

    if (!this.email) {
      errors.push('Email is required')
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.email)) {
        errors.push('Email must be a valid email format')
      }
    }

    if (!this.password) {
      errors.push('Password is required')
    } else if (this.password.length < 6) {
      errors.push('Password must be at least 6 characters long')
    }

    if (this.name && this.name.length < 2) {
      errors.push('Name must be at least 2 characters long')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

export class AuthResponseDTO {
  constructor(user, accessToken, refreshToken = null, expiresIn = null) {
    this.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    }
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    this.expiresIn = expiresIn
  }

  static fromUserAndToken(user, accessToken, refreshToken = null, expiresIn = null) {
    return new AuthResponseDTO(user, accessToken, refreshToken, expiresIn)
  }
}

export class UserProfileDTO {
  constructor(user) {
    this.id = user.id
    this.email = user.email
    this.name = user.name
    this.createdAt = user.createdAt
    this.updatedAt = user.updatedAt
  }

  static fromUser(user) {
    return new UserProfileDTO(user)
  }
}