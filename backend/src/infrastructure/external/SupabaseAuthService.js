/**
 * Supabase Authentication Service
 * Infrastructure layer implementation for authentication
 */
export class SupabaseAuthService {
  constructor(dbConnection) {
    this.supabase = dbConnection.getAuthClient()
  }

  /**
   * Authenticate user with email and password
   */
  async login(email, password) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw new Error(`Authentication failed: ${error.message}`)
      }

      return {
        user: data.user,
        session: data.session,
        access_token: data.session.access_token
      }
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`)
    }
  }

  /**
   * Register new user
   */
  async register(email, password, userData = {}) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })

      if (error) {
        throw new Error(`Registration failed: ${error.message}`)
      }

      return {
        user: data.user,
        session: data.session
      }
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`)
    }
  }

  /**
   * Verify JWT token
   */
  async verifyToken(token) {
    try {
      const { data, error } = await this.supabase.auth.getUser(token)

      if (error) {
        throw new Error(`Token verification failed: ${error.message}`)
      }

      return data.user
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`)
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      const { error } = await this.supabase.auth.signOut()
      
      if (error) {
        throw new Error(`Logout failed: ${error.message}`)
      }

      return { success: true }
    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`)
    }
  }

  /**
   * Get current user session
   */
  async getCurrentSession() {
    try {
      const { data, error } = await this.supabase.auth.getSession()
      
      if (error) {
        throw new Error(`Session retrieval failed: ${error.message}`)
      }

      return data.session
    } catch (error) {
      throw new Error(`Session retrieval failed: ${error.message}`)
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    try {
      const { data, error } = await this.supabase.auth.refreshSession({
        refresh_token: refreshToken
      })

      if (error) {
        throw new Error(`Token refresh failed: ${error.message}`)
      }

      return {
        session: data.session,
        user: data.user
      }
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`)
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email) {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email)
      
      if (error) {
        throw new Error(`Password reset failed: ${error.message}`)
      }

      return { success: true }
    } catch (error) {
      throw new Error(`Password reset failed: ${error.message}`)
    }
  }

  /**
   * Update password
   */
  async updatePassword(newPassword) {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) {
        throw new Error(`Password update failed: ${error.message}`)
      }

      return { success: true }
    } catch (error) {
      throw new Error(`Password update failed: ${error.message}`)
    }
  }
}