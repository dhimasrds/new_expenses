import { UserRepository } from '../../domain/repositories/UserRepository.js'
import { User } from '../../domain/entities/User.js'

/**
 * Supabase implementation of UserRepository
 * Note: This is mainly for domain user data, auth is handled by Supabase Auth
 */
export class SupabaseUserRepository extends UserRepository {
  constructor(databaseConnection) {
    super()
    this.db = databaseConnection.getClient()
  }

  /**
   * Maps database row to User entity
   */
  _mapToUser(row) {
    return new User(
      row.id,
      row.email,
      row.encrypted_password, // This will be null as Supabase manages passwords
      row.name,
      row.created_at,
      row.updated_at
    )
  }

  /**
   * Maps User entity to database row
   */
  _mapToRow(user) {
    return {
      id: user.id,
      email: user.email,
      encrypted_password: user.password, // Will be null for Supabase auth users
      name: user.name,
      created_at: user.createdAt,
      updated_at: user.updatedAt
    }
  }

  async findById(id) {
    try {
      const { data, error } = await this.db
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return null
        }
        throw new Error(`Database error: ${error.message}`)
      }

      return this._mapToUser(data)
    } catch (error) {
      throw new Error(`Failed to find user by ID: ${error.message}`)
    }
  }

  async findByEmail(email) {
    try {
      const { data, error } = await this.db
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single()

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return null
        }
        throw new Error(`Database error: ${error.message}`)
      }

      return this._mapToUser(data)
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error.message}`)
    }
  }

  async save(user) {
    try {
      const row = this._mapToRow(user)
      
      // Use upsert to handle cases where Supabase Auth already created the user
      const { data, error } = await this.db
        .from('users')
        .upsert([row], {
          onConflict: 'id',
          ignoreDuplicates: false
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      return this._mapToUser(data)
    } catch (error) {
      throw new Error(`Failed to save user: ${error.message}`)
    }
  }

  async update(user) {
    try {
      const row = this._mapToRow(user)
      delete row.created_at // Don't update created_at
      row.updated_at = new Date().toISOString()

      const { data, error } = await this.db
        .from('users')
        .update(row)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          throw new Error('User not found')
        }
        throw new Error(`Database error: ${error.message}`)
      }

      return this._mapToUser(data)
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`)
    }
  }

  async deleteById(id) {
    try {
      const { error } = await this.db
        .from('users')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      return true
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`)
    }
  }

  async existsByEmail(email) {
    try {
      const { data, error } = await this.db
        .from('users')
        .select('id')
        .eq('email', email.toLowerCase())
        .single()

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return false
        }
        throw new Error(`Database error: ${error.message}`)
      }

      return !!data
    } catch (error) {
      throw new Error(`Failed to check user existence by email: ${error.message}`)
    }
  }

  async existsById(id) {
    try {
      const { data, error } = await this.db
        .from('users')
        .select('id')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return false
        }
        throw new Error(`Database error: ${error.message}`)
      }

      return !!data
    } catch (error) {
      throw new Error(`Failed to check user existence by ID: ${error.message}`)
    }
  }
}