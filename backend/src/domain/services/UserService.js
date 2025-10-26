/**
 * User Domain Service
 * Contains business logic related to user operations
 */
export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  /**
   * Create a new user
   */
  async createUser(userData) {
    try {
      // Business logic: validate user data
      if (!userData.email || !userData.email.includes('@')) {
        throw new Error('Valid email is required')
      }

      if (!userData.password || userData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long')
      }

      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(userData.email)
      if (existingUser) {
        throw new Error('User with this email already exists')
      }

      // Create user
      const user = await this.userRepository.create(userData)
      return user
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`)
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required')
      }

      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new Error('User not found')
      }

      return user
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`)
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email) {
    try {
      if (!email || !email.includes('@')) {
        throw new Error('Valid email is required')
      }

      const user = await this.userRepository.findByEmail(email)
      if (!user) {
        throw new Error('User not found')
      }

      return user
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`)
    }
  }

  /**
   * Update user profile
   */
  async updateUser(userId, updateData) {
    try {
      if (!userId) {
        throw new Error('User ID is required')
      }

      // Get existing user
      const existingUser = await this.userRepository.findById(userId)
      if (!existingUser) {
        throw new Error('User not found')
      }

      // Business logic: validate update data
      if (updateData.email && !updateData.email.includes('@')) {
        throw new Error('Valid email is required')
      }

      if (updateData.password && updateData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long')
      }

      // Check if email is already taken by another user
      if (updateData.email && updateData.email !== existingUser.email) {
        const emailExists = await this.userRepository.findByEmail(updateData.email)
        if (emailExists) {
          throw new Error('Email is already taken by another user')
        }
      }

      // Update user
      const updatedUser = await this.userRepository.update(userId, updateData)
      return updatedUser
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`)
    }
  }

  /**
   * Delete user
   */
  async deleteUser(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required')
      }

      // Check if user exists
      const existingUser = await this.userRepository.findById(userId)
      if (!existingUser) {
        throw new Error('User not found')
      }

      // Business logic: you might want to check if user has expenses before deletion
      // For now, we'll allow deletion regardless

      await this.userRepository.delete(userId)
      return { success: true }
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`)
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required')
      }

      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new Error('User not found')
      }

      // Business logic: calculate user statistics
      // This could include things like:
      // - Total expenses count
      // - Account age
      // - Last login date
      // etc.

      return {
        userId: user.id,
        email: user.email,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        // Add more stats as needed
      }
    } catch (error) {
      throw new Error(`Failed to get user stats: ${error.message}`)
    }
  }

  /**
   * Validate user permissions for expense operations
   */
  async validateUserAccess(userId, resourceUserId) {
    try {
      if (!userId || !resourceUserId) {
        throw new Error('User IDs are required')
      }

      // Business rule: users can only access their own resources
      if (userId !== resourceUserId) {
        throw new Error('Access denied: insufficient permissions')
      }

      return true
    } catch (error) {
      throw new Error(`Access validation failed: ${error.message}`)
    }
  }

  /**
   * Check if user is active
   */
  async isUserActive(userId) {
    try {
      const user = await this.userRepository.findById(userId)
      if (!user) {
        return false
      }

      // Business logic: check if user account is active
      // This could include checking if account is not suspended, email is verified, etc.
      return true // For now, all existing users are considered active
    } catch (error) {
      throw new Error(`Failed to check user status: ${error.message}`)
    }
  }
}