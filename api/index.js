// ================================================
// EXPENSE TRACKER API - Main Implementation
// ================================================
// Backend API untuk expense tracker menggunakan Supabase dan Express.js
// Optimized untuk Vercel serverless deployment

import { createClient } from '@supabase/supabase-js'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import compression from 'compression'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'
import dotenv from 'dotenv'

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config()
console.log('🔧 Environment check:')
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development')
console.log('- SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Loaded' : '❌ Missing')
console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Loaded' : '❌ Missing')
console.log('- SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Loaded' : '❌ Missing')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

// Initialize Supabase clients with error handling
let supabase = null  // Admin client with service role key
let supabaseAuth = null  // Auth client with anon key

if (supabaseUrl && supabaseServiceKey) {
  // Admin client for database operations
  supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        'x-application-name': 'expense-tracker-api-admin'
      }
    }
  })
} else {
  console.warn('⚠️  Supabase admin credentials not found. Database operations will not work.')
}

if (supabaseUrl && supabaseAnonKey) {
  // Auth client for authentication operations
  supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        'x-application-name': 'expense-tracker-api-auth'
      }
    }
  })
} else {
  console.warn('⚠️  Supabase auth credentials not found. Authentication will not work.')
}

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 3000

// ================================================
// MIDDLEWARE SETUP
// ================================================

// Compression middleware
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false
    }
    return compression.filter(req, res)
  }
}))

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}))

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://expense-tracker-frontend.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too Many Requests',
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
})
app.use('/api/', limiter)

// Body parser
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Performance logging middleware
const performanceMiddleware = (req, res, next) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    if (process.env.NODE_ENV !== 'production' || duration > 1000) {
      console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`)
    }
  })
  
  next()
}
app.use(performanceMiddleware)

// ================================================
// SWAGGER DOCUMENTATION SETUP
// ================================================

// Load OpenAPI spec
let swaggerDocument = {}
try {
  const swaggerPath = join(__dirname, '../pengeluaran_documentation_guide/expense-tracker-openapi.yaml')
  if (fs.existsSync(swaggerPath)) {
    swaggerDocument = YAML.load(swaggerPath)
  } else {
    // Fallback inline swagger spec
    swaggerDocument = {
      openapi: '3.0.0',
      info: {
        title: 'Expense Tracker API',
        version: '1.0.0',
        description: 'Backend API untuk aplikasi expense tracker'
      },
      servers: [
        {
          url: process.env.NODE_ENV === 'production' 
            ? 'https://your-api.vercel.app' 
            : `http://localhost:${PORT}`,
          description: process.env.NODE_ENV === 'production' ? 'Production' : 'Development'
        }
      ],
      paths: {
        '/health': {
          get: {
            summary: 'Health check endpoint',
            responses: {
              '200': {
                description: 'API is healthy'
              }
            }
          }
        }
      }
    }
  }
} catch (error) {
  console.warn('Could not load swagger documentation:', error.message)
}

// API Documentation routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customSiteTitle: 'Expense Tracker API Documentation',
  customCss: '.swagger-ui .topbar { display: none }'
}))

// Alternative documentation route
app.use('/docs', swaggerUi.serve)
app.get('/docs', swaggerUi.setup(swaggerDocument, {
  customSiteTitle: 'Expense Tracker API Documentation',
  customCss: '.swagger-ui .topbar { display: none }'
}))

// JSON schema endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocument);
})

// ================================================
// DATABASE CHECK MIDDLEWARE
// ================================================

const requireDatabase = (req, res, next) => {
  if (!supabase) {
    return res.status(503).json({
      error: 'Service Unavailable',
      message: 'Database not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.'
    })
  }
  next()
}

// ================================================
// AUTHENTICATION MIDDLEWARE
// ================================================

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'No valid token provided. Please include Authorization header with Bearer token.' 
      })
    }

    const token = authHeader.substring(7)
    console.log('🔑 Verifying token:', token.substring(0, 50) + '...')
    
    // Use the same client that was used for login to verify token
    const { data: { user }, error } = await supabaseAuth.auth.getUser(token)
    
    if (error) {
      console.error('❌ Token verification error:', error.message)
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Invalid or expired token' 
      })
    }

    if (!user) {
      console.error('❌ No user found for token')
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Invalid or expired token' 
      })
    }

    console.log('✅ User authenticated:', user.email)
    req.user = user
    next()
  } catch (error) {
    console.error('Authentication error:', error)
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Authentication failed' 
    })
  }
}

// ================================================
// VALIDATION MIDDLEWARE
// ================================================

const validateExpenseData = (req, res, next) => {
  const { description, amount, category, date } = req.body
  const errors = []

  // Validate description
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push('Description is required and must be a non-empty string')
  } else if (description.length > 255) {
    errors.push('Description must be 255 characters or less')
  }

  // Validate amount
  if (!amount || typeof amount !== 'number' || amount <= 0) {
    errors.push('Amount is required and must be a positive number')
  } else if (amount > 999999.99) {
    errors.push('Amount cannot exceed 999,999.99')
  }

  // Validate category
  const validCategories = ['Food', 'Transport', 'Work', 'Entertainment', 'Health', 'Shopping', 'Bills', 'Other']
  if (!category || !validCategories.includes(category)) {
    errors.push(`Category must be one of: ${validCategories.join(', ')}`)
  }

  // Validate date
  if (!date || isNaN(Date.parse(date))) {
    errors.push('Date is required and must be a valid ISO 8601 date string')
  } else {
    const expenseDate = new Date(date)
    const now = new Date()
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
    const oneYearLater = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
    
    if (expenseDate < oneYearAgo || expenseDate > oneYearLater) {
      errors.push('Date must be within one year from today')
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Please fix the following errors:',
      details: errors
    })
  }

  next()
}

// ================================================
// HEALTH CHECK ENDPOINT
// ================================================

app.get('/health', async (req, res) => {
  try {
    let healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: 'not-configured'
    }

    // Test Supabase connection if configured
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('expenses')
          .select('count')
          .limit(1)
        
        healthStatus.database = error ? 'error' : 'connected'
        
        if (error) {
          healthStatus.status = 'degraded'
          healthStatus.database_error = error.message
        }
      } catch (dbError) {
        healthStatus.database = 'error'
        healthStatus.database_error = dbError.message
        healthStatus.status = 'degraded'
      }
    }

    res.status(healthStatus.status === 'healthy' ? 200 : 503).json(healthStatus)
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    })
  }
})

// ================================================
// API INFO ENDPOINT
// ================================================

app.get('/api/v1/info', (req, res) => {
  res.json({
    name: 'Expense Tracker API',
    version: '1.0.0',
    description: 'Backend API untuk aplikasi expense tracker dengan Supabase',
    environment: process.env.NODE_ENV || 'development',
    documentation: `${req.protocol}://${req.get('host')}/api-docs`,
    endpoints: {
      health: '/health',
      docs: '/api-docs',
      auth: {
        signup: 'POST /auth/signup',
        login: 'POST /auth/login',
        logout: 'POST /auth/logout'
      },
      expenses: {
        list: 'GET /api/v1/expenses',
        create: 'POST /api/v1/expenses',
        get: 'GET /api/v1/expenses/:id',
        update: 'PUT /api/v1/expenses/:id',
        delete: 'DELETE /api/v1/expenses/:id'
      }
    }
  })
})

// ================================================
// AUTHENTICATION ROUTES
// ================================================

// POST /auth/login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email and password are required'
      })
    }

    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    })

    if (error) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: error.message
      })
    }

    res.json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_in: data.session.expires_in,
      user: {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Login failed' 
    })
  }
})

// Test endpoint untuk debug authentication
app.post('/auth/verify-token', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'No valid token provided' 
      })
    }

    const token = authHeader.substring(7)
    console.log('🔑 Testing token:', token.substring(0, 50) + '...')
    
    // Test dengan anon key
    try {
      const { data: { user: userAuth }, error: errorAuth } = await supabaseAuth.auth.getUser(token)
      console.log('📝 Anon client result:', { user: userAuth?.email, error: errorAuth?.message })
    } catch (e) {
      console.log('📝 Anon client error:', e.message)
    }
    
    // Test dengan service key
    try {
      const { data: { user: userAdmin }, error: errorAdmin } = await supabase.auth.getUser(token)
      console.log('📝 Admin client result:', { user: userAdmin?.email, error: errorAdmin?.message })
    } catch (e) {
      console.log('📝 Admin client error:', e.message)
    }

    res.json({
      message: 'Token verification test completed - check server logs'
    })
  } catch (error) {
    console.error('Verify token error:', error)
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Token verification failed' 
    })
  }
})// POST /auth/signup (for testing only)
app.post('/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email and password are required'
      })
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Password must be at least 6 characters'
      })
    }

    const { data, error } = await supabaseAuth.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        emailRedirectTo: undefined
      }
    })

    if (error) {
      return res.status(400).json({
        error: 'Bad Request',
        message: error.message
      })
    }

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at
      },
      access_token: data.session?.access_token || null,
      refresh_token: data.session?.refresh_token || null
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Signup failed'
    })
  }
})

// POST /auth/logout
app.post('/auth/logout', authenticateUser, async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      })
    }

    res.json({ message: 'Successfully logged out' })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Logout failed'
    })
  }
})

// ================================================
// EXPENSE ROUTES
// ================================================

// Test endpoint untuk demo tanpa authentication
app.get('/api/v1/expenses/test', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', '56bd5008-dd82-4893-abaf-05be9798b3d6')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      return res.status(500).json({
        error: 'Database Error',
        message: error.message
      })
    }

    res.json({
      message: 'Test endpoint - Demo data for user lele@gmail.com',
      count: data.length,
      user_id: '56bd5008-dd82-4893-abaf-05be9798b3d6',
      expenses: data
    })
  } catch (error) {
    console.error('Test endpoint error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch test data'
    })
  }
})

// GET /api/v1/expenses - TEMPORARY: Disable auth for testing
app.get('/api/v1/expenses/demo', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', '56bd5008-dd82-4893-abaf-05be9798b3d6')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      return res.status(500).json({
        error: 'Database Error',
        message: error.message
      })
    }

    res.json({
      message: 'Demo endpoint - All expenses for user lele@gmail.com (no auth required)',
      user_id: '56bd5008-dd82-4893-abaf-05be9798b3d6',
      total: data.length,
      expenses: data
    })
  } catch (error) {
    console.error('Demo endpoint error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch demo data'
    })
  }
})

// GET /api/v1/expenses
app.get('/api/v1/expenses', authenticateUser, async (req, res) => {
  try {
    const {
      limit = 50,
      offset = 0,
      category,
      date_from,
      date_to,
      search
    } = req.query

    // Validate pagination parameters
    const limitNum = Math.min(Math.max(parseInt(limit) || 50, 1), 100)
    const offsetNum = Math.max(parseInt(offset) || 0, 0)

    // Build query
    let query = supabase
      .from('expenses')
      .select('*', { count: 'exact' })
      .eq('user_id', req.user.id)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offsetNum, offsetNum + limitNum - 1)

    // Apply filters
    if (category) {
      query = query.eq('category', category)
    }
    
    if (date_from) {
      query = query.gte('date', date_from)
    }
    
    if (date_to) {
      query = query.lte('date', date_to)
    }

    if (search) {
      query = query.ilike('description', `%${search}%`)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch expenses'
      })
    }

    // Transform data
    const transformedData = data.map(expense => ({
      id: expense.id,
      userId: expense.user_id,
      description: expense.description,
      amount: parseFloat(expense.amount),
      category: expense.category,
      date: expense.date,
      created_at: expense.created_at,
      updated_at: expense.updated_at
    }))

    res.json({
      data: transformedData,
      pagination: {
        total: count,
        limit: limitNum,
        offset: offsetNum,
        hasMore: count > offsetNum + limitNum
      }
    })
  } catch (error) {
    console.error('Get expenses error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch expenses'
    })
  }
})

// POST /api/v1/expenses
app.post('/api/v1/expenses', authenticateUser, validateExpenseData, async (req, res) => {
  try {
    const { description, amount, category, date } = req.body

    const { data, error } = await supabase
      .from('expenses')
      .insert([{
        user_id: req.user.id,
        description: description.trim(),
        amount: Math.round(amount * 100) / 100, // Round to 2 decimal places
        category,
        date: new Date(date).toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to create expense'
      })
    }

    // Transform response
    const transformedResponse = {
      id: data.id,
      userId: data.user_id,
      description: data.description,
      amount: parseFloat(data.amount),
      category: data.category,
      date: data.date,
      created_at: data.created_at,
      updated_at: data.updated_at
    }

    res.status(201).json(transformedResponse)
  } catch (error) {
    console.error('Create expense error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create expense'
    })
  }
})

// GET /api/v1/expenses/:id
app.get('/api/v1/expenses/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params

    // Validate ID format
    if (!id.startsWith('exp_')) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid expense ID format'
      })
    }

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Expense not found'
        })
      }
      console.error('Database error:', error)
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch expense'
      })
    }

    // Transform response
    const transformedResponse = {
      id: data.id,
      userId: data.user_id,
      description: data.description,
      amount: parseFloat(data.amount),
      category: data.category,
      date: data.date,
      created_at: data.created_at,
      updated_at: data.updated_at
    }

    res.json(transformedResponse)
  } catch (error) {
    console.error('Get expense error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch expense'
    })
  }
})

// PUT /api/v1/expenses/:id
app.put('/api/v1/expenses/:id', authenticateUser, validateExpenseData, async (req, res) => {
  try {
    const { id } = req.params
    const { description, amount, category, date } = req.body

    // Validate ID format
    if (!id.startsWith('exp_')) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid expense ID format'
      })
    }

    const { data, error } = await supabase
      .from('expenses')
      .update({
        description: description.trim(),
        amount: Math.round(amount * 100) / 100,
        category,
        date: new Date(date).toISOString()
      })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Expense not found'
        })
      }
      console.error('Database error:', error)
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update expense'
      })
    }

    // Transform response
    const transformedResponse = {
      id: data.id,
      userId: data.user_id,
      description: data.description,
      amount: parseFloat(data.amount),
      category: data.category,
      date: data.date,
      created_at: data.created_at,
      updated_at: data.updated_at
    }

    res.json(transformedResponse)
  } catch (error) {
    console.error('Update expense error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update expense'
    })
  }
})

// DELETE /api/v1/expenses/:id
app.delete('/api/v1/expenses/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params

    // Validate ID format
    if (!id.startsWith('exp_')) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid expense ID format'
      })
    }

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id)

    if (error) {
      console.error('Database error:', error)
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to delete expense'
      })
    }

    res.json({
      message: 'Expense successfully deleted',
      id
    })
  } catch (error) {
    console.error('Delete expense error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete expense'
    })
  }
})

// GET /api/v1/expenses/summary - Get expense summary and analytics
app.get('/api/v1/expenses/summary', authenticateUser, async (req, res) => {
  try {
    const { category, dateFrom, dateTo } = req.query
    let query = supabase
      .from('expenses')
      .select('amount, category, date')
      .eq('user_id', req.user.id)

    // Apply filters
    if (category) {
      query = query.eq('category', category)
    }
    
    if (dateFrom) {
      query = query.gte('date', dateFrom)
    }
    
    if (dateTo) {
      query = query.lte('date', dateTo)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch expense summary'
      })
    }

    // Calculate summary
    const total = data.reduce((sum, expense) => sum + expense.amount, 0)
    const count = data.length

    // Calculate category breakdown
    const categories = data.reduce((acc, expense) => {
      const category = expense.category
      if (!acc[category]) {
        acc[category] = { amount: 0, count: 0 }
      }
      acc[category].amount += expense.amount
      acc[category].count += 1
      return acc
    }, {})

    res.json({
      success: true,
      data: {
        total,
        count,
        categories
      }
    })
  } catch (error) {
    console.error('Get expense summary error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch expense summary'
    })
  }
})

// ================================================
// ERROR HANDLING
// ================================================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableEndpoints: {
      health: 'GET /health',
      docs: 'GET /api-docs',
      info: 'GET /api/v1/info',
      auth: 'POST /auth/login, POST /auth/logout',
      expenses: 'GET|POST /api/v1/expenses, GET|PUT|DELETE /api/v1/expenses/:id, GET /api/v1/expenses/summary'
    }
  })
})

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error)
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong'
  })
})

// ================================================
// SERVER STARTUP (for local development)
// ================================================

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Expense Tracker API running on port ${PORT}`)
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`)
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`)
    console.log(`ℹ️  API Info: http://localhost:${PORT}/api/v1/info`)
  })
}

// ================================================
// VERCEL EXPORT
// ================================================

export default app