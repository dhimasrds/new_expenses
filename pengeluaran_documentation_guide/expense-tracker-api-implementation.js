// ================================================
// EXPENSE TRACKER API IMPLEMENTATION
// ================================================
// Contoh implementasi JavaScript/TypeScript untuk expense tracker
// menggunakan Supabase client dan framework Express.js

// ================================================
// 1. DEPENDENCIES DAN SETUP
// ================================================

import { createClient } from '@supabase/supabase-js'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'

// Load environment variables
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 3000

// ================================================
// 2. MIDDLEWARE SETUP
// ================================================

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use('/api/', limiter)

// Body parser
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Swagger documentation
const swaggerDocument = YAML.load('./expense-tracker-openapi.yaml')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// ================================================
// 3. AUTHENTICATION MIDDLEWARE
// ================================================

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'No valid token provided' 
      })
    }

    const token = authHeader.substring(7)
    
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Invalid token' 
      })
    }

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
// 4. VALIDATION MIDDLEWARE
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
  }

  // Validate category
  const validCategories = ['Food', 'Transport', 'Work', 'Entertainment', 'Health', 'Shopping', 'Bills', 'Other']
  if (!category || !validCategories.includes(category)) {
    errors.push(`Category must be one of: ${validCategories.join(', ')}`)
  }

  // Validate date
  if (!date || isNaN(Date.parse(date))) {
    errors.push('Date is required and must be a valid ISO 8601 date string')
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
// 5. AUTHENTICATION ROUTES
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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
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
// 6. EXPENSE ROUTES
// ================================================

// GET /api/v1/expenses
app.get('/api/v1/expenses', authenticateUser, async (req, res) => {
  try {
    const {
      limit = 50,
      offset = 0,
      category,
      date_from,
      date_to
    } = req.query

    // Build query
    let query = supabase
      .from('expenses')
      .select('*')
      .eq('user_id', req.user.id)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

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

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch expenses'
      })
    }

    // Transform data untuk match API contract
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

    res.json(transformedData)
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
        amount,
        category,
        date
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

    // Transform response untuk match API contract
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
        amount,
        category,
        date
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

// ================================================
// 7. HEALTH CHECK DAN INFO ROUTES
// ================================================

// GET /health
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  })
})

// GET /api/v1/info
app.get('/api/v1/info', (req, res) => {
  res.json({
    name: 'Expense Tracker API',
    version: '1.0.0',
    description: 'Backend API untuk aplikasi expense tracker',
    endpoints: {
      health: '/health',
      docs: '/api-docs',
      auth: {
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
// 8. ERROR HANDLING
// ================================================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`
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
// 9. SERVER STARTUP
// ================================================

app.listen(PORT, () => {
  console.log(`🚀 Expense Tracker API running on port ${PORT}`)
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`)
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`)
})

// ================================================
// 10. ENVIRONMENT VARIABLES TEMPLATE
// ================================================

/*
Create .env file dengan content berikut:

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://yourapp.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
*/

// ================================================
// 11. PACKAGE.JSON DEPENDENCIES
// ================================================

/*
{
  "name": "expense-tracker-api",
  "version": "1.0.0",
  "description": "Backend API untuk expense tracker dengan Supabase",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.38.0",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.8.1",
    "swagger-ui-express": "^5.0.0",
    "yamljs": "^0.3.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.2"
  }
}
*/

export default app
