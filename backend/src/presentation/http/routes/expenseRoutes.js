import { Router } from 'express'
import { ValidationMiddleware } from '../middleware/ValidationMiddleware.js'

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Expense management and tracking
 */

/**
 * Expense routes
 */
export function createExpenseRoutes(expenseController, authMiddleware) {
  const router = Router()

  /**
   * @swagger
   * /api/expenses/summary:
   *   get:
   *     summary: Get expense summary statistics
   *     tags: [Expenses]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: from
   *         schema:
   *           type: string
   *           format: date
   *         description: Start date filter
   *       - in: query
   *         name: to
   *         schema:
   *           type: string
   *           format: date
   *         description: End date filter
   *       - in: query
   *         name: category
   *         schema:
   *           type: string
   *         description: Category filter
   *     responses:
   *       200:
   *         description: Summary retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     total:
   *                       type: number
   *                     count:
   *                       type: number
   *                     average:
   *                       type: number
   *                     byCategory:
   *                       type: object
   *       401:
   *         description: Unauthorized
   */
  router.get('/summary', 
    authMiddleware.authenticate(),
    ValidationMiddleware.validateExpenseQuery(),
    (req, res) => expenseController.getExpenseSummary(req, res)
  )

  /**
   * @swagger
   * /api/expenses:
   *   get:
   *     summary: Get all expenses for authenticated user
   *     tags: [Expenses]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: category
   *         schema:
   *           type: string
   *         description: Filter by category
   *       - in: query
   *         name: from
   *         schema:
   *           type: string
   *           format: date
   *         description: Start date
   *       - in: query
   *         name: to
   *         schema:
   *           type: string
   *           format: date
   *         description: End date
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Number of records to return
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *         description: Number of records to skip
   *     responses:
   *       200:
   *         description: List of expenses
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     expenses:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Expense'
   *                     total:
   *                       type: integer
   *       401:
   *         description: Unauthorized
   */
  router.get('/', 
    authMiddleware.authenticate(),
    ValidationMiddleware.validateExpenseQuery(),
    (req, res) => expenseController.getExpenses(req, res)
  )

  /**
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
   *             type: object
   *             required:
   *               - amount
   *               - description
   *               - category
   *               - date
   *             properties:
   *               amount:
   *                 type: number
   *                 example: 25.50
   *               description:
   *                 type: string
   *                 example: Lunch at restaurant
   *               category:
   *                 type: string
   *                 enum: [Food, Transport, Work, Entertainment, Health, Shopping, Bills, Other]
   *                 example: Food
   *               date:
   *                 type: string
   *                 format: date
   *                 example: "2024-10-25"
   *     responses:
   *       201:
   *         description: Expense created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Expense'
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized
   */
  router.post('/', 
    authMiddleware.authenticate(),
    ValidationMiddleware.validateExpenseData(),
    (req, res) => expenseController.createExpense(req, res)
  )

  /**
   * @swagger
   * /api/expenses/{id}:
   *   get:
   *     summary: Get expense by ID
   *     tags: [Expenses]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Expense ID
   *     responses:
   *       200:
   *         description: Expense details
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Expense'
   *       404:
   *         description: Expense not found
   *       401:
   *         description: Unauthorized
   */
  router.get('/:id', 
    authMiddleware.authenticate(),
    ValidationMiddleware.validateExpenseId(),
    (req, res) => expenseController.getExpenseById(req, res)
  )

  /**
   * @swagger
   * /api/expenses/{id}:
   *   put:
   *     summary: Update an expense
   *     tags: [Expenses]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Expense ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               amount:
   *                 type: number
   *                 example: 30.00
   *               description:
   *                 type: string
   *                 example: Updated description
   *               category:
   *                 type: string
   *                 example: Food
   *               date:
   *                 type: string
   *                 format: date
   *                 example: "2024-10-25"
   *     responses:
   *       200:
   *         description: Expense updated successfully
   *       404:
   *         description: Expense not found
   *       401:
   *         description: Unauthorized
   */
  router.put('/:id', 
    authMiddleware.authenticate(),
    ValidationMiddleware.validateExpenseId(),
    ValidationMiddleware.validateExpenseData(),
    (req, res) => expenseController.updateExpense(req, res)
  )

  /**
   * @swagger
   * /api/expenses/{id}:
   *   delete:
   *     summary: Delete an expense
   *     tags: [Expenses]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Expense ID
   *     responses:
   *       200:
   *         description: Expense deleted successfully
   *       404:
   *         description: Expense not found
   *       401:
   *         description: Unauthorized
   */
  router.delete('/:id', 
    authMiddleware.authenticate(),
    ValidationMiddleware.validateExpenseId(),
    (req, res) => expenseController.deleteExpense(req, res)
  )

  return router
}