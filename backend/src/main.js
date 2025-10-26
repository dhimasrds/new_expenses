import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { Container } from './shared/container/Container.js'
import { setupDependencies } from './config/dependencies.js'
import { createExpenseRoutes } from './presentation/http/routes/expenseRoutes.js'
import { createAuthRoutes } from './presentation/http/routes/authRoutes.js'
import { setupSwagger } from './infrastructure/swagger/index.js'

// Load environment variables
dotenv.config()

/**
 * Main application entry point
 */
class Application {
  constructor() {
    this.app = express()
    this.container = new Container()
    this.port = process.env.PORT || 3001
  }

  /**
   * Initialize the application
   */
  async initialize() {
    try {
      // Setup middleware
      this.setupMiddleware()
      
      // Setup dependencies
      await setupDependencies(this.container)
      
      // Setup routes
      this.setupRoutes()
      
      // Setup error handling
      this.setupErrorHandling()
      
      console.log('✅ Application initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize application:', error)
      throw error
    }
  }

  /**
   * Setup Express middleware
   */
  setupMiddleware() {
    // CORS configuration
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3000', 'http://localhost:3001'];

    this.app.use(cors({
      origin: function(origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, curl, etc)
        if (!origin) return callback(null, true);
        
        // Allow Vercel preview deployments
        if (origin.includes('.vercel.app')) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }))

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }))
    this.app.use(express.urlencoded({ extended: true }))

    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
      next()
    })
  }

  /**
   * Setup API routes
   */
  setupRoutes() {
    // Setup Swagger documentation
    setupSwagger(this.app)

    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0'
      })
    })

    // API routes
    const expenseController = this.container.resolve('expenseController')
    const authController = this.container.resolve('authController')
    const authMiddleware = this.container.resolve('authMiddleware')

    this.app.use('/api/expenses', createExpenseRoutes(expenseController, authMiddleware))
    this.app.use('/api/auth', createAuthRoutes(authController, authMiddleware))

    // Catch-all for undefined routes
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl
      })
    })
  }

  /**
   * Setup global error handling
   */
  setupErrorHandling() {
    this.app.use((error, req, res, next) => {
      console.error('Global error handler:', error)

      // Validation errors
      if (error.isJoi) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.details.map(detail => detail.message)
        })
      }

      // Database errors
      if (error.code === '23505') { // Unique constraint violation
        return res.status(409).json({
          error: 'Resource already exists'
        })
      }

      // Authentication errors
      if (error.message === 'Unauthorized') {
        return res.status(401).json({
          error: 'Authentication required'
        })
      }

      // Default error
      res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      })
    })
  }

  /**
   * Start the server
   */
  async start() {
    try {
      await this.initialize()
      
      this.app.listen(this.port, () => {
        console.log(`🚀 Server running on port ${this.port}`)
        console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
        console.log(`🌐 Health check: http://localhost:${this.port}/health`)
        console.log(`📡 API Base URL: http://localhost:${this.port}/api`)
      })
    } catch (error) {
      console.error('❌ Failed to start server:', error)
      process.exit(1)
    }
  }

  /**
   * Graceful shutdown
   */
  async stop() {
    console.log('🛑 Shutting down server...')
    
    // Close database connections
    const dbConnection = this.container.resolve('dbConnection')
    await dbConnection.close()
    
    console.log('✅ Server shut down successfully')
    process.exit(0)
  }
}

// Initialize application instance
const appInstance = new Application()

// For Vercel serverless deployment - initialize and export
if (process.env.VERCEL) {
  await appInstance.initialize()
}

// For local development
if (!process.env.VERCEL) {
  // Handle graceful shutdown
  process.on('SIGTERM', () => appInstance.stop())
  process.on('SIGINT', () => appInstance.stop())

  // Start the application
  appInstance.start().catch(error => {
    console.error('Failed to start application:', error)
    process.exit(1)
  })
}

// Export for Vercel serverless
export default appInstance.app