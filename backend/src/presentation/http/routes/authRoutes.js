import { Router } from 'express'
import { ValidationMiddleware } from '../middleware/ValidationMiddleware.js'

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization
 */

/**
 * Authentication routes
 */
export function createAuthRoutes(authController, authMiddleware) {
  const router = Router()

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Login user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: lele@gmail.com
   *               password:
   *                 type: string
   *                 format: password
   *                 example: test1234
   *     responses:
   *       200:
   *         description: Login successful
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
   *                     user:
   *                       $ref: '#/components/schemas/User'
   *                     access_token:
   *                       type: string
   *                     session:
   *                       type: object
   *                 message:
   *                   type: string
   *       401:
   *         description: Invalid credentials
   */
  router.post('/login', 
    ValidationMiddleware.validateLoginData(),
    (req, res) => authController.login(req, res)
  )

  /**
   * @swagger
   * /api/auth/signup:
   *   post:
   *     summary: Register new user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *               - fullName
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: newuser@example.com
   *               password:
   *                 type: string
   *                 format: password
   *                 minLength: 6
   *                 example: password123
   *               fullName:
   *                 type: string
   *                 example: John Doe
   *     responses:
   *       200:
   *         description: Registration successful
   *       400:
   *         description: Validation error
   */
  router.post('/signup', 
    ValidationMiddleware.validateSignupData(),
    (req, res) => authController.signup(req, res)
  )

  /**
   * @swagger
   * /api/auth/verify-token:
   *   post:
   *     summary: Verify JWT token
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - token
   *             properties:
   *               token:
   *                 type: string
   *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   *     responses:
   *       200:
   *         description: Token is valid
   *       401:
   *         description: Invalid or expired token
   */
  router.post('/verify-token', 
    (req, res) => authController.verifyToken(req, res)
  )

  /**
   * @swagger
   * /api/auth/logout:
   *   post:
   *     summary: Logout user
   *     tags: [Authentication]
   *     responses:
   *       200:
   *         description: Logout successful
   */
  router.post('/logout', 
    (req, res) => authController.logout(req, res)
  )

  /**
   * @swagger
   * /api/auth/profile:
   *   get:
   *     summary: Get user profile
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User profile retrieved
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/User'
   *       401:
   *         description: Unauthorized
   */
  router.get('/profile', 
    authMiddleware.authenticate(),
    (req, res) => authController.getProfile(req, res)
  )

  return router
}