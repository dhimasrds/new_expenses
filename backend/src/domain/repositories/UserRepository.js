/**
 * Repository interface for User entity
 * This interface defines the contract for user data access
 * Implementations should handle all database operations
 */
export class UserRepository {
  /**
   * Finds a user by ID
   * @param {string} id - User ID
   * @returns {Promise<User|null>} Found user or null
   */
  async findById(id) {
    throw new Error('Method not implemented')
  }

  /**
   * Finds a user by email
   * @param {string} email - User email
   * @returns {Promise<User|null>} Found user or null
   */
  async findByEmail(email) {
    throw new Error('Method not implemented')
  }

  /**
   * Saves a new user
   * @param {User} user - User entity to save
   * @returns {Promise<User>} Saved user
   */
  async save(user) {
    throw new Error('Method not implemented')
  }

  /**
   * Updates an existing user
   * @param {User} user - User entity to update
   * @returns {Promise<User>} Updated user
   */
  async update(user) {
    throw new Error('Method not implemented')
  }

  /**
   * Deletes a user by ID
   * @param {string} id - User ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async deleteById(id) {
    throw new Error('Method not implemented')
  }

  /**
   * Checks if a user exists by email
   * @param {string} email - User email
   * @returns {Promise<boolean>} True if user exists
   */
  async existsByEmail(email) {
    throw new Error('Method not implemented')
  }

  /**
   * Checks if a user exists by ID
   * @param {string} id - User ID
   * @returns {Promise<boolean>} True if user exists
   */
  async existsById(id) {
    throw new Error('Method not implemented')
  }
}