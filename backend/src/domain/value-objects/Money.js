export class Money {
  constructor(value) {
    this.value = parseFloat(value)
  }

  /**
   * Validates the money amount according to business rules
   * @throws {Error} if validation fails
   */
  validate() {
    if (isNaN(this.value)) {
      throw new Error('Amount must be a valid number')
    }
    
    if (this.value <= 0) {
      throw new Error('Amount must be greater than zero')
    }
    
    if (this.value > 999999.99) {
      throw new Error('Amount cannot exceed 999,999.99')
    }

    // Check for more than 2 decimal places
    const decimalPlaces = (this.value.toString().split('.')[1] || '').length
    if (decimalPlaces > 2) {
      throw new Error('Amount cannot have more than 2 decimal places')
    }
  }

  /**
   * Returns the rounded value to 2 decimal places
   * @returns {number}
   */
  getValue() {
    return Math.round(this.value * 100) / 100
  }

  /**
   * Adds another Money value
   * @param {Money} other 
   * @returns {Money}
   */
  add(other) {
    return new Money(this.getValue() + other.getValue())
  }

  /**
   * Subtracts another Money value
   * @param {Money} other 
   * @returns {Money}
   */
  subtract(other) {
    return new Money(this.getValue() - other.getValue())
  }

  /**
   * Compares with another Money value
   * @param {Money} other 
   * @returns {boolean}
   */
  equals(other) {
    return this.getValue() === other.getValue()
  }

  /**
   * Checks if this amount is greater than another
   * @param {Money} other 
   * @returns {boolean}
   */
  isGreaterThan(other) {
    return this.getValue() > other.getValue()
  }

  /**
   * Checks if this amount is less than another
   * @param {Money} other 
   * @returns {boolean}
   */
  isLessThan(other) {
    return this.getValue() < other.getValue()
  }

  /**
   * Returns string representation
   * @returns {string}
   */
  toString() {
    return this.getValue().toFixed(2)
  }
}