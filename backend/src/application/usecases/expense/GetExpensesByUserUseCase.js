/**
 * Get Expenses By User Use Case
 * Application layer - orchestrates expense retrieval for a user
 */
export class GetExpensesByUserUseCase {
  constructor(expenseService) {
    this.expenseService = expenseService
  }

  /**
   * Execute get expenses by user
   */
  async execute(userId, filters = {}) {
    try {
      if (!userId) {
        throw new Error('User ID is required')
      }

      // Get expenses through domain service
      const expenses = await this.expenseService.getExpensesByUser(userId, filters)

      return {
        success: true,
        data: expenses,
        count: expenses.length,
        message: 'Expenses retrieved successfully'
      }
    } catch (error) {
      throw new Error(`Failed to get expenses: ${error.message}`)
    }
  }
}