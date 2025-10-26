import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

/**
 * Simple Database connection for development
 */
export class SimpleDatabaseConnection {
  constructor() {
    this.client = null
    this.adminClient = null
    this.authClient = null
    this.isConnected = false
    
    try {
      this.initializeClients()
      console.log('✅ Database connection initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize database:', error.message)
      // Don't throw error, allow app to start in development mode
    }
  }

  /**
   * Initialize Supabase clients
   */
  initializeClients() {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl) {
      console.warn('⚠️  SUPABASE_URL not found. Using mock mode.')
      return
    }

    // Main client (anon key)
    if (supabaseAnonKey) {
      this.client = createClient(supabaseUrl, supabaseAnonKey)
      this.authClient = this.client // Use same client for auth
      console.log('✅ Supabase auth client initialized')
    }

    // Admin client (service role key)
    if (supabaseServiceKey) {
      this.adminClient = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })
      console.log('✅ Supabase admin client initialized')
    } else {
      // Fallback to anon client for development
      this.adminClient = this.client
      console.warn('⚠️  Using anon client as admin client (development mode)')
    }

    this.isConnected = true
  }

  /**
   * Get main client
   */
  getClient() {
    if (!this.client) {
      console.warn('⚠️  Database client not available, returning mock')
      return this.getMockClient()
    }
    return this.client
  }

  /**
   * Get admin client for database operations
   */
  getAdminClient() {
    if (!this.adminClient) {
      console.warn('⚠️  Database admin client not available, returning mock')
      return this.getMockClient()
    }
    return this.adminClient
  }

  /**
   * Get auth client for authentication operations
   */
  getAuthClient() {
    if (!this.authClient) {
      console.warn('⚠️  Database auth client not available, returning mock')
      return this.getMockClient()
    }
    return this.authClient
  }

  /**
   * Mock client for development when Supabase is not available
   */
  getMockClient() {
    return {
      from: (table) => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: { id: 'mock-id' }, error: null }),
        update: () => ({ data: { id: 'mock-id' }, error: null }),
        delete: () => ({ data: null, error: null }),
        eq: () => this.getMockClient().from(table),
        order: () => this.getMockClient().from(table),
        limit: () => this.getMockClient().from(table)
      }),
      auth: {
        signInWithPassword: () => ({ 
          data: { user: { id: 'mock-user', email: 'test@example.com' } }, 
          error: null 
        }),
        signUp: () => ({ 
          data: { user: { id: 'mock-user', email: 'test@example.com' } }, 
          error: null 
        }),
        getUser: () => ({ 
          data: { user: { id: 'mock-user', email: 'test@example.com' } }, 
          error: null 
        }),
        signOut: () => ({ data: null, error: null })
      }
    }
  }

  /**
   * Test database connection
   */
  async testConnection() {
    try {
      if (!this.isConnected) {
        return {
          status: 'disconnected',
          message: 'Database not connected',
          timestamp: new Date().toISOString()
        }
      }

      // Simple test query
      const { data, error } = await this.getClient()
        .from('expenses')
        .select('id')
        .limit(1)
      
      if (error) {
        return {
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString()
        }
      }

      return {
        status: 'connected',
        message: 'Database connection successful',
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
  async close() {
    this.client = null
    this.adminClient = null
    this.authClient = null
    this.isConnected = false
    console.log('✅ Database connections closed')
  }
}