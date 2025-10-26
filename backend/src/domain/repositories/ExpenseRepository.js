/**
 * Repository interface for Expense entity
 * This interface defines the contract for expense data access
 * Implementations should handle all database operations
 */
export class ExpenseRepository {
  /**
   * Finds an expense by ID and user ID
   * @param {string} id - Expense ID
   * @param {string} userId - User ID
   * @returns {Promise<Expense|null>} Found expense or null
   */
  async findByIdAndUserId(id, userId) {
    throw new Error('Method not implemented')
  }

  /**
   * Finds all expenses for a user with optional filters
   * @param {string} userId - User ID
   * @param {Object} filters - Optional filters (category, dateFrom, dateTo, search)
   * @param {Object} pagination - Pagination options (limit, offset)
   * @returns {Promise<{expenses: Expense[], total: number}>} Expenses and total count
   */
  async findByUserId(userId, filters = {}, pagination = {}) {
    throw new Error('Method not implemented')
  }

  /**
   * Saves a new expense
   * @param {Expense} expense - Expense entity to save
   * @returns {Promise<Expense>} Saved expense
   */
  async save(expense) {
    throw new Error('Method not implemented')
  }

  /**
   * Updates an existing expense
   * @param {Expense} expense - Expense entity to update
   * @returns {Promise<Expense>} Updated expense
   */
  async update(expense) {
    throw new Error('Method not implemented')
  }

  /**
   * Deletes an expense by ID and user ID
   * @param {string} id - Expense ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async deleteByIdAndUserId(id, userId) {
    throw new Error('Method not implemented')
  }

  /**
   * Gets expense summary for a user with optional filters
   * @param {string} userId - User ID
   * @param {Object} filters - Optional filters (category, dateFrom, dateTo)
   * @returns {Promise<Object>} Summary with total, count, and category breakdown
   */
  async getSummaryByUserId(userId, filters = {}) {
    throw new Error('Method not implemented')
  }

  /**
   * Checks if an expense exists and belongs to a user
   * @param {string} id - Expense ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} True if exists and belongs to user
   */
  async existsByIdAndUserId(id, userId) {
    throw new Error('Method not implemented')
  }
}