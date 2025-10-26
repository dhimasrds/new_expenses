/**
 * Get Expense Summary Use Case
 * Application layer - orchestrates expense summary calculation
 */
export class GetExpenseSummaryUseCase {
  constructor(expenseService) {
    this.expenseService = expenseService
  }

  /**
   * Execute expense summary retrieval
   */
  async execute(userId, filters = {}) {
    try {
      if (!userId) {
        throw new Error('User ID is required')
      }

      // Get expense summary through domain service
      const summary = await this.expenseService.getExpenseSummary(userId, filters)

      return {
        success: true,
        data: summary,
        message: 'Expense summary retrieved successfully'
      }
    } catch (error) {
      throw new Error(`Failed to get expense summary: ${error.message}`)
    }
  }
}