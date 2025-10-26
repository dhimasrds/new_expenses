export class ExpenseDate {
  constructor(value) {
    this.value = new Date(value)
  }

  /**
   * Validates the date according to business rules
   * @throws {Error} if validation fails
   */
  validate() {
    if (isNaN(this.value.getTime())) {
      throw new Error('Date must be a valid date')
    }

    const now = new Date()
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
    const oneYearLater = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())

    if (this.value < oneYearAgo || this.value > oneYearLater) {
      throw new Error('Date must be within one year from today')
    }
  }

  /**
   * Returns the date value
   * @returns {Date}
   */
  getValue() {
    return this.value
  }

  /**
   * Returns ISO string representation
   * @returns {string}
   */
  toISOString() {
    return this.value.toISOString()
  }

  /**
   * Returns date string in YYYY-MM-DD format
   * @returns {string}
   */
  toDateString() {
    return this.value.toISOString().split('T')[0]
  }

  /**
   * Checks if this date equals another
   * @param {ExpenseDate} other 
   * @returns {boolean}
   */
  equals(other) {
    return this.value.getTime() === other.getValue().getTime()
  }

  /**
   * Checks if this date is before another
   * @param {ExpenseDate|Date} other 
   * @returns {boolean}
   */
  isBefore(other) {
    const otherDate = other instanceof ExpenseDate ? other.getValue() : other
    return this.value < otherDate
  }

  /**
   * Checks if this date is after another
   * @param {ExpenseDate|Date} other 
   * @returns {boolean}
   */
  isAfter(other) {
    const otherDate = other instanceof ExpenseDate ? other.getValue() : other
    return this.value > otherDate
  }

  /**
   * Checks if this date is within a range
   * @param {Date|string} from 
   * @param {Date|string} to 
   * @returns {boolean}
   */
  isWithinRange(from, to) {
    const fromDate = new Date(from)
    const toDate = new Date(to)
    return this.value >= fromDate && this.value <= toDate
  }

  /**
   * Checks if this date is today
   * @returns {boolean}
   */
  isToday() {
    const today = new Date()
    return this.toDateString() === today.toISOString().split('T')[0]
  }

  /**
   * Checks if this date is in the current month
   * @returns {boolean}
   */
  isCurrentMonth() {
    const now = new Date()
    return this.value.getFullYear() === now.getFullYear() && 
           this.value.getMonth() === now.getMonth()
  }

  /**
   * Returns string representation
   * @returns {string}
   */
  toString() {
    return this.toDateString()
  }
}