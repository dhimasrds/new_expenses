/**
 * Supabase Authentication Service
 * Handles authentication operations with Supabase Auth
 */
export class SupabaseAuthService {
  constructor(databaseConnection) {
    this.authClient = databaseConnection.getAuthClient()
  }

  /**
   * Sign in user with email and password
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>} Authentication result
   */
  async signIn(email, password) {
    try {
      const { data, error } = await this.authClient.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      })

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || null,
          createdAt: data.user.created_at
        },
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Sign up user with email and password
   * @param {string} email 
   * @param {string} password 
   * @param {Object} metadata Additional user metadata
   * @returns {Promise<Object>} Authentication result
   */
  async signUp(email, password, metadata = {}) {
    try {
      const { data, error } = await this.authClient.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: metadata,
          emailRedirectTo: undefined // Disable email confirmation for now
        }
      })

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: metadata.name || null,
          createdAt: data.user.created_at
        },
        accessToken: data.session?.access_token || null,
        refreshToken: data.session?.refresh_token || null,
        expiresIn: data.session?.expires_in || null
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Get user from access token
   * @param {string} token 
   * @returns {Promise<Object>} User data
   */
  async getUser(token) {
    try {
      const { data: { user }, error } = await this.authClient.auth.getUser(token)

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      if (!user) {
        return {
          success: false,
          error: 'Invalid or expired token'
        }
      }

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || null,
          createdAt: user.created_at
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Sign out user
   * @param {string} token 
   * @returns {Promise<Object>} Result
   */
  async signOut(token) {
    try {
      // Set the session before signing out
      await this.authClient.auth.setSession({
        access_token: token,
        refresh_token: null
      })

      const { error } = await this.authClient.auth.signOut()

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Refresh access token
   * @param {string} refreshToken 
   * @returns {Promise<Object>} New tokens
   */
  async refreshToken(refreshToken) {
    try {
      const { data, error } = await this.authClient.auth.refreshSession({
        refresh_token: refreshToken
      })

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Reset password
   * @param {string} email 
   * @returns {Promise<Object>} Result
   */
  async resetPassword(email) {
    try {
      const { error } = await this.authClient.auth.resetPasswordForEmail(email)

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true,
        message: 'Password reset email sent'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}