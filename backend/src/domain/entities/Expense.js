import { ExpenseCategory } from '../value-objects/ExpenseCategory.js'
import { Money } from '../value-objects/Money.js'
import { ExpenseDate } from '../value-objects/ExpenseDate.js'

export class Expense {
  constructor(id, userId, description, amount, category, date, createdAt = null, updatedAt = null) {
    this.id = id
    this.userId = userId
    this.description = description
    this.amount = new Money(amount)
    this.category = new ExpenseCategory(category)
    this.date = new ExpenseDate(date)
    this.createdAt = createdAt || new Date()
    this.updatedAt = updatedAt || new Date()
  }

  /**
   * Validates the expense according to business rules
   * @returns {Object} validation result with isValid boolean and errors array
   */
  validate() {
    const errors = []

    // Description validation
    if (!this.description || typeof this.description !== 'string') {
      errors.push('Description is required and must be a string')
    } else if (this.description.trim().length === 0) {
      errors.push('Description cannot be empty')
    } else if (this.description.length > 255) {
      errors.push('Description must be 255 characters or less')
    }

    // Amount validation
    try {
      this.amount.validate()
    } catch (error) {
      errors.push(error.message)
    }

    // Category validation
    try {
      this.category.validate()
    } catch (error) {
      errors.push(error.message)
    }

    // Date validation
    try {
      this.date.validate()
    } catch (error) {
      errors.push(error.message)
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Updates the expense with new data
   * @param {Object} data - Object containing description, amount, category, date
   */
  update(data) {
    if (data.description !== undefined) {
      this.description = data.description
    }
    if (data.amount !== undefined) {
      this.amount = new Money(data.amount)
    }
    if (data.category !== undefined) {
      this.category = new ExpenseCategory(data.category)
    }
    if (data.date !== undefined) {
      this.date = new ExpenseDate(data.date)
    }
    this.updatedAt = new Date()
  }

  /**
   * Checks if this expense belongs to a specific user
   * @param {string} userId 
   * @returns {boolean}
   */
  belongsToUser(userId) {
    return this.userId === userId
  }

  /**
   * Checks if this expense is in a specific category
   * @param {string} categoryName 
   * @returns {boolean}
   */
  isInCategory(categoryName) {
    return this.category.getValue() === categoryName
  }

  /**
   * Checks if this expense is within a date range
   * @param {Date|string} from 
   * @param {Date|string} to 
   * @returns {boolean}
   */
  isWithinDateRange(from, to) {
    return this.date.isWithinRange(from, to)
  }

  /**
   * Returns a plain object representation
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      description: this.description,
      amount: this.amount.getValue(),
      category: this.category.getValue(),
      date: this.date.getValue(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  /**
   * Creates an Expense from a plain object
   * @param {Object} data 
   * @returns {Expense}
   */
  static fromJSON(data) {
    return new Expense(
      data.id,
      data.userId,
      data.description,
      data.amount,
      data.category,
      data.date,
      data.createdAt,
      data.updatedAt
    )
  }
}