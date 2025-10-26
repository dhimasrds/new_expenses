import { Money } from '../value-objects/Money.js'

/**
 * Domain service for expense-related business logic
 * Contains complex business rules that span multiple entities
 */
export class ExpenseService {
  constructor(expenseRepository) {
    this.expenseRepository = expenseRepository
  }

  /**
   * Get expenses for a user
   * @param {string} userId 
   * @param {Object} filters 
   * @returns {Promise<Expense[]>}
   */
  async getExpensesByUser(userId, filters = {}) {
    if (!userId) {
      throw new Error('User ID is required')
    }

    return await this.expenseRepository.findByUserId(userId, filters)
  }

  /**
   * Get expense by ID
   * @param {string} expenseId 
   * @returns {Promise<Expense>}
   */
  async getExpenseById(expenseId) {
    if (!expenseId) {
      throw new Error('Expense ID is required')
    }

    return await this.expenseRepository.findById(expenseId)
  }

  /**
   * Create new expense
   * @param {Object} expenseData 
   * @returns {Promise<Expense>}
   */
  async createExpense(expenseData) {
    return await this.expenseRepository.create(expenseData)
  }

  /**
   * Update expense
   * @param {string} expenseId 
   * @param {Object} updateData 
   * @returns {Promise<Expense>}
   */
  async updateExpense(expenseId, updateData) {
    return await this.expenseRepository.update(expenseId, updateData)
  }

  /**
   * Delete expense
   * @param {string} expenseId 
   * @returns {Promise<boolean>}
   */
  async deleteExpense(expenseId) {
    return await this.expenseRepository.delete(expenseId)
  }

  /**
   * Calculates total expenses for a given array of expenses
   * @param {Expense[]} expenses 
   * @returns {Money} Total amount
   */
  calculateTotal(expenses) {
    if (!expenses || expenses.length === 0) {
      return new Money(0)
    }

    const total = expenses.reduce((sum, expense) => {
      return sum + expense.amount.getValue()
    }, 0)

    return new Money(total)
  }

  /**
   * Groups expenses by category with totals
   * @param {Expense[]} expenses 
   * @returns {Object} Category breakdown
   */
  groupByCategory(expenses) {
    if (!expenses || expenses.length === 0) {
      return {}
    }

    return expenses.reduce((groups, expense) => {
      const category = expense.category.getValue()
      
      if (!groups[category]) {
        groups[category] = {
          amount: 0,
          count: 0,
          expenses: []
        }
      }

      groups[category].amount += expense.amount.getValue()
      groups[category].count += 1
      groups[category].expenses.push(expense)

      return groups
    }, {})
  }

  /**
   * Groups expenses by month with totals
   * @param {Expense[]} expenses 
   * @returns {Object} Monthly breakdown
   */
  groupByMonth(expenses) {
    if (!expenses || expenses.length === 0) {
      return {}
    }

    return expenses.reduce((groups, expense) => {
      const date = expense.date.getValue()
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!groups[monthKey]) {
        groups[monthKey] = {
          amount: 0,
          count: 0,
          expenses: []
        }
      }

      groups[monthKey].amount += expense.amount.getValue()
      groups[monthKey].count += 1
      groups[monthKey].expenses.push(expense)

      return groups
    }, {})
  }

  /**
   * Finds the most expensive expense from a list
   * @param {Expense[]} expenses 
   * @returns {Expense|null} Most expensive expense
   */
  findMostExpensive(expenses) {
    if (!expenses || expenses.length === 0) {
      return null
    }

    return expenses.reduce((max, current) => {
      return current.amount.isGreaterThan(max.amount) ? current : max
    })
  }

  /**
   * Calculates average expense amount
   * @param {Expense[]} expenses 
   * @returns {Money} Average amount
   */
  calculateAverage(expenses) {
    if (!expenses || expenses.length === 0) {
      return new Money(0)
    }

    const total = this.calculateTotal(expenses).getValue()
    return new Money(total / expenses.length)
  }

  /**
   * Filters expenses by date range
   * @param {Expense[]} expenses 
   * @param {Date|string} from 
   * @param {Date|string} to 
   * @returns {Expense[]} Filtered expenses
   */
  filterByDateRange(expenses, from, to) {
    if (!expenses || expenses.length === 0) {
      return []
    }

    const fromDate = new Date(from)
    const toDate = new Date(to)

    return expenses.filter(expense => {
      return expense.date.isWithinRange(fromDate, toDate)
    })
  }

  /**
   * Filters expenses by category
   * @param {Expense[]} expenses 
   * @param {string} category 
   * @returns {Expense[]} Filtered expenses
   */
  filterByCategory(expenses, category) {
    if (!expenses || expenses.length === 0) {
      return []
    }

    return expenses.filter(expense => {
      return expense.isInCategory(category)
    })
  }

  /**
   * Generates expense summary for analytics
   * @param {Expense[]} expenses 
   * @returns {Object} Summary object
   */
  generateSummary(expenses) {
    const total = this.calculateTotal(expenses)
    const categories = this.groupByCategory(expenses)
    const monthly = this.groupByMonth(expenses)
    const average = this.calculateAverage(expenses)
    const mostExpensive = this.findMostExpensive(expenses)

    return {
      total: total.getValue(),
      count: expenses.length,
      average: average.getValue(),
      mostExpensive: mostExpensive ? mostExpensive.toJSON() : null,
      categories: Object.keys(categories).reduce((acc, key) => {
        acc[key] = {
          amount: categories[key].amount,
          count: categories[key].count
        }
        return acc
      }, {}),
      monthly: Object.keys(monthly).reduce((acc, key) => {
        acc[key] = {
          amount: monthly[key].amount,
          count: monthly[key].count
        }
        return acc
      }, {})
    }
  }

  /**
   * Validates if an expense can be deleted by a user
   * @param {Expense} expense 
   * @param {string} userId 
   * @returns {boolean}
   */
  canDeleteExpense(expense, userId) {
    return expense.belongsToUser(userId)
  }

  /**
   * Validates if an expense can be updated by a user
   * @param {Expense} expense 
   * @param {string} userId 
   * @returns {boolean}
   */
  canUpdateExpense(expense, userId) {
    return expense.belongsToUser(userId)
  }
}