/**
 * Create Expense Use Case
 * Application layer - orchestrates expense creation
 */
export class CreateExpenseUseCase {
  constructor(expenseService) {
    this.expenseService = expenseService
  }

  /**
   * Execute expense creation
   */
  async execute(expenseData, userId) {
    try {
      // Validate required data
      if (!expenseData) {
        throw new Error('Expense data is required')
      }

      if (!userId) {
        throw new Error('User ID is required')
      }

      // Ensure the expense belongs to the authenticated user
      const expenseWithUser = {
        ...expenseData,
        userId
      }

      // Create expense through domain service
      const expense = await this.expenseService.createExpense(expenseWithUser)

      return {
        success: true,
        data: expense,
        message: 'Expense created successfully'
      }
    } catch (error) {
      throw new Error(`Failed to create expense: ${error.message}`)
    }
  }
}