import { ApiResponse, ErrorCodes } from '../helpers/ApiResponse.js'

/**
 * HTTP Controller for Expense operations
 */
export class ExpenseController {
  constructor(
    createExpenseUseCase,
    getExpensesUseCase,
    getExpenseByIdUseCase,
    updateExpenseUseCase,
    deleteExpenseUseCase,
    getExpenseSummaryUseCase
  ) {
    this.createExpenseUseCase = createExpenseUseCase
    this.getExpensesUseCase = getExpensesUseCase
    this.getExpenseByIdUseCase = getExpenseByIdUseCase
    this.updateExpenseUseCase = updateExpenseUseCase
    this.deleteExpenseUseCase = deleteExpenseUseCase
    this.getExpenseSummaryUseCase = getExpenseSummaryUseCase
  }

  /**
   * Create a new expense
   * @swagger
   * /api/expenses:
   *   post:
   *     summary: Create a new expense
   *     tags: [Expenses]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateExpenseRequest'
   *     responses:
   *       201:
   *         description: Expense created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Expense'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  async createExpense(req, res) {
    try {
      const result = await this.createExpenseUseCase.execute(req.body, req.user.id)
      res.status(201).json(ApiResponse.success(result))
    } catch (error) {
      console.error('Create expense error:', error)
      
      if (error.message.includes('Validation failed')) {
        return res.status(400).json(
          ApiResponse.error(ErrorCodes.VALIDATION_ERROR, error.message)
        )
      }

      res.status(500).json(
        ApiResponse.error(ErrorCodes.INTERNAL_ERROR, 'Failed to create expense')
      )
    }
  }

  /**
   * Get expenses with optional filters
   * @swagger
   * /api/expenses:
   *   get:
   *     summary: Get expenses with optional filters
   *     tags: [Expenses]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 20
   *         description: Number of expenses per page
   *       - in: query
   *         name: category
   *         schema:
   *           type: string
   *           enum: [food, transportation, entertainment, utilities, shopping, healthcare, education, other]
   *         description: Filter by category
   *       - in: query
   *         name: dateFrom
   *         schema:
   *           type: string
   *           format: date
   *         description: Filter expenses from this date
   *       - in: query
   *         name: dateTo
   *         schema:
   *           type: string
   *           format: date
   *         description: Filter expenses to this date
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search in expense descriptions
   *     responses:
   *       200:
   *         description: List of expenses
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Expense'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                     limit:
   *                       type: integer
   *                     total:
   *                       type: integer
   *                     totalPages:
   *                       type: integer
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  async getExpenses(req, res) {
    try {
      const result = await this.getExpensesUseCase.execute(req.user.id, req.query)
      res.json(ApiResponse.success(result.expenses, { pagination: result.pagination }))
    } catch (error) {
      console.error('Get expenses error:', error)
      res.status(500).json(
        ApiResponse.error(ErrorCodes.INTERNAL_ERROR, 'Failed to fetch expenses')
      )
    }
  }

  /**
   * Get a single expense by ID
   * GET /api/expenses/:id
   */
  async getExpenseById(req, res) {
    try {
      const { id } = req.params
      const result = await this.getExpenseByIdUseCase.execute(id, req.user.id)
      res.json(ApiResponse.success(result))
    } catch (error) {
      console.error('Get expense by ID error:', error)
      
      if (error.message.includes('not found') || error.message.includes('Access denied')) {
        return res.status(404).json(
          ApiResponse.error(ErrorCodes.NOT_FOUND, 'Expense not found')
        )
      }

      res.status(500).json(
        ApiResponse.error(ErrorCodes.INTERNAL_ERROR, 'Failed to fetch expense')
      )
    }
  }

  /**
   * Update an expense
   * PUT /api/expenses/:id
   */
  async updateExpense(req, res) {
    try {
      const { id } = req.params
      const result = await this.updateExpenseUseCase.execute(id, req.body, req.user.id)
      res.json(ApiResponse.success(result))
    } catch (error) {
      console.error('Update expense error:', error)
      
      if (error.message.includes('not found') || error.message.includes('Access denied')) {
        return res.status(404).json(
          ApiResponse.error(ErrorCodes.NOT_FOUND, 'Expense not found')
        )
      }

      if (error.message.includes('Validation failed')) {
        return res.status(400).json(
          ApiResponse.error(ErrorCodes.VALIDATION_ERROR, error.message)
        )
      }

      res.status(500).json(
        ApiResponse.error(ErrorCodes.INTERNAL_ERROR, 'Failed to update expense')
      )
    }
  }

  /**
   * Delete an expense
   * DELETE /api/expenses/:id
   */
  async deleteExpense(req, res) {
    try {
      const { id } = req.params
      await this.deleteExpenseUseCase.execute(id, req.user.id)
      res.status(204).send()
    } catch (error) {
      console.error('Delete expense error:', error)
      
      if (error.message.includes('not found') || error.message.includes('Access denied')) {
        return res.status(404).json(
          ApiResponse.error(ErrorCodes.NOT_FOUND, 'Expense not found')
        )
      }

      res.status(500).json(
        ApiResponse.error(ErrorCodes.INTERNAL_ERROR, 'Failed to delete expense')
      )
    }
  }

  /**
   * Get expense summary
   * GET /api/expenses/summary
   */
  async getExpenseSummary(req, res) {
    try {
      const result = await this.getExpenseSummaryUseCase.execute(req.user.id, req.query)
      res.json(ApiResponse.success(result))
    } catch (error) {
      console.error('Get expense summary error:', error)
      res.status(500).json(
        ApiResponse.error(ErrorCodes.INTERNAL_ERROR, 'Failed to fetch expense summary')
      )
    }
  }
}