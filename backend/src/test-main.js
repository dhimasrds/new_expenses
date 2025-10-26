import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

/**
 * Simple test application to verify clean architecture structure
 */
class SimpleTestApp {
  constructor() {
    this.app = express()
    this.port = process.env.PORT || 3001
  }

  /**
   * Initialize the application
   */
  async initialize() {
    try {
      // Setup middleware
      this.setupMiddleware()
      
      // Setup routes
      this.setupRoutes()
      
      console.log('✅ Simple test application initialized successfully')
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
    this.app.use(cors({
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
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
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        message: 'Clean Architecture Backend is running!'
      })
    })

    // Test routes
    this.app.get('/api/test', (req, res) => {
      res.json({
        message: 'Clean architecture backend test endpoint',
        structure: 'Working!',
        timestamp: new Date().toISOString()
      })
    })

    // Mock expense routes
    this.app.get('/api/expenses', (req, res) => {
      res.json({
        success: true,
        data: [],
        message: 'Clean architecture expenses endpoint (mock)',
        count: 0
      })
    })

    // Mock auth routes
    this.app.post('/api/auth/login', (req, res) => {
      res.json({
        success: true,
        message: 'Clean architecture auth endpoint (mock)',
        data: {
          user: { id: 1, email: 'test@example.com' },
          access_token: 'mock-token'
        }
      })
    })

    // Catch-all for undefined routes
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        message: 'Clean architecture backend - route not implemented yet'
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
        console.log(`🚀 Clean Architecture Backend Server running on port ${this.port}`)
        console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
        console.log(`🌐 Health check: http://localhost:${this.port}/health`)
        console.log(`📡 API Base URL: http://localhost:${this.port}/api`)
        console.log(`🏗️  Architecture: Clean Architecture Pattern`)
        console.log(`🔧 Test endpoint: http://localhost:${this.port}/api/test`)
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
    console.log('✅ Server shut down successfully')
    process.exit(0)
  }
}

// Handle graceful shutdown
const app = new SimpleTestApp()

process.on('SIGTERM', () => app.stop())
process.on('SIGINT', () => app.stop())

// Start the application
app.start().catch(error => {
  console.error('Failed to start application:', error)
  process.exit(1)
})