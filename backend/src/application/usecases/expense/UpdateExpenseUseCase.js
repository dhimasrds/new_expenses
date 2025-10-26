/**
 * Update Expense Use Case
 * Application layer - orchestrates expense updates
 */
export class UpdateExpenseUseCase {
  constructor(expenseService) {
    this.expenseService = expenseService
  }

  /**
   * Execute expense update
   */
  async execute(expenseId, updateData, userId) {
    try {
      if (!expenseId) {
        throw new Error('Expense ID is required')
      }

      if (!updateData) {
        throw new Error('Update data is required')
      }

      if (!userId) {
        throw new Error('User ID is required')
      }

      // Get existing expense to verify ownership
      const existingExpense = await this.expenseService.getExpenseById(expenseId)
      
      if (existingExpense.userId !== userId) {
        throw new Error('Access denied: expense does not belong to user')
      }

      // Update expense through domain service
      const updatedExpense = await this.expenseService.updateExpense(expenseId, updateData)

      return {
        success: true,
        data: updatedExpense,
        message: 'Expense updated successfully'
      }
    } catch (error) {
      throw new Error(`Failed to update expense: ${error.message}`)
    }
  }
}