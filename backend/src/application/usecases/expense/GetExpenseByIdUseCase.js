/**
 * Get Expense By ID Use Case
 * Application layer - orchestrates expense retrieval by ID
 */
export class GetExpenseByIdUseCase {
  constructor(expenseService) {
    this.expenseService = expenseService
  }

  /**
   * Execute get expense by ID
   */
  async execute(expenseId, userId) {
    try {
      if (!expenseId) {
        throw new Error('Expense ID is required')
      }

      if (!userId) {
        throw new Error('User ID is required')
      }

      // Get expense through domain service
      const expense = await this.expenseService.getExpenseById(expenseId)

      // Verify user ownership
      if (expense.userId !== userId) {
        throw new Error('Access denied: expense does not belong to user')
      }

      return {
        success: true,
        data: expense,
        message: 'Expense retrieved successfully'
      }
    } catch (error) {
      throw new Error(`Failed to get expense: ${error.message}`)
    }
  }
}