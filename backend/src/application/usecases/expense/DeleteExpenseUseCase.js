/**
 * Delete Expense Use Case
 * Application layer - orchestrates expense deletion
 */
export class DeleteExpenseUseCase {
  constructor(expenseService) {
    this.expenseService = expenseService
  }

  /**
   * Execute expense deletion
   */
  async execute(expenseId, userId) {
    try {
      if (!expenseId) {
        throw new Error('Expense ID is required')
      }

      if (!userId) {
        throw new Error('User ID is required')
      }

      // Get existing expense to verify ownership
      const existingExpense = await this.expenseService.getExpenseById(expenseId)
      
      if (existingExpense.userId !== userId) {
        throw new Error('Access denied: expense does not belong to user')
      }

      // Delete expense through domain service
      await this.expenseService.deleteExpense(expenseId)

      return {
        success: true,
        message: 'Expense deleted successfully'
      }
    } catch (error) {
      throw new Error(`Failed to delete expense: ${error.message}`)
    }
  }
}