import { createClient } from '@supabase/supabase-js'

/**
 * Database connection and configuration
 */
export class DatabaseConnection {
  constructor() {
    this.adminClient = null
    this.authClient = null
    this.isConnected = false
    // Auto-initialize connection
    this.connect()
  }

  /**
   * Initialize database connections
   */
  connect() {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL environment variable is required')
    }

    // Admin client for database operations
    if (supabaseServiceKey) {
      this.adminClient = createClient(supabaseUrl, supabaseServiceKey, {
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
      console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY not found. Database operations will not work.')
    }

    // Auth client for authentication operations
    if (supabaseAnonKey) {
      this.authClient = createClient(supabaseUrl, supabaseAnonKey, {
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
      console.warn('⚠️  SUPABASE_ANON_KEY not found. Authentication will not work.')
    }

    this.isConnected = true
    console.log('✅ Database connection initialized')
  }

  /**
   * Get admin client for database operations
   */
  getAdminClient() {
    if (!this.adminClient) {
      throw new Error('Database admin client not initialized')
    }
    return this.adminClient
  }

  /**
   * Get auth client for authentication operations
   */
  getAuthClient() {
    if (!this.authClient) {
      throw new Error('Database auth client not initialized')
    }
    return this.authClient
  }

  /**
   * Test database connection
   */
  async testConnection() {
    try {
      if (this.adminClient) {
        const { data, error } = await this.adminClient
          .from('expenses')
          .select('count')
          .limit(1)
        
        if (error) {
          throw new Error(`Database connection test failed: ${error.message}`)
        }
      }

      return {
        status: 'connected',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Close database connections
   */
  async disconnect() {
    // Supabase clients don't need explicit disconnection
    this.adminClient = null
    this.authClient = null
  }
}