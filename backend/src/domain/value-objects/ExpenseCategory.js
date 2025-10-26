export class ExpenseCategory {
  static VALID_CATEGORIES = [
    'Food',
    'Transport', 
    'Work',
    'Entertainment',
    'Health',
    'Shopping',
    'Bills',
    'Other'
  ]

  constructor(value) {
    this.value = value
  }

  /**
   * Validates the category according to business rules
   * @throws {Error} if validation fails
   */
  validate() {
    if (!this.value || typeof this.value !== 'string') {
      throw new Error('Category is required and must be a string')
    }

    if (!ExpenseCategory.VALID_CATEGORIES.includes(this.value)) {
      throw new Error(`Category must be one of: ${ExpenseCategory.VALID_CATEGORIES.join(', ')}`)
    }
  }

  /**
   * Returns the category value
   * @returns {string}
   */
  getValue() {
    return this.value
  }

  /**
   * Checks if this category equals another
   * @param {ExpenseCategory} other 
   * @returns {boolean}
   */
  equals(other) {
    return this.value === other.getValue()
  }

  /**
   * Checks if the category is food-related
   * @returns {boolean}
   */
  isFoodRelated() {
    return this.value === 'Food'
  }

  /**
   * Checks if the category is transport-related
   * @returns {boolean}
   */
  isTransportRelated() {
    return this.value === 'Transport'
  }

  /**
   * Checks if the category is work-related
   * @returns {boolean}
   */
  isWorkRelated() {
    return this.value === 'Work'
  }

  /**
   * Returns all valid categories
   * @returns {string[]}
   */
  static getValidCategories() {
    return [...ExpenseCategory.VALID_CATEGORIES]
  }

  /**
   * Checks if a category is valid
   * @param {string} category 
   * @returns {boolean}
   */
  static isValid(category) {
    return ExpenseCategory.VALID_CATEGORIES.includes(category)
  }

  /**
   * Returns string representation
   * @returns {string}
   */
  toString() {
    return this.value
  }
}