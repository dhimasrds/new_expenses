import { ExpenseRepository } from '../../domain/repositories/ExpenseRepository.js'
import { Expense } from '../../domain/entities/Expense.js'

/**
 * Supabase implementation of ExpenseRepository
 */
export class SupabaseExpenseRepository extends ExpenseRepository {
  constructor(databaseConnection) {
    super()
    this.db = databaseConnection.getClient()
  }

  /**
   * Maps database row to Expense entity
   */
  _mapToExpense(row) {
    return new Expense(
      row.id,
      row.user_id,
      row.description,
      parseFloat(row.amount),
      row.category,
      row.date,
      row.created_at,
      row.updated_at
    )
  }

  /**
   * Maps Expense entity to database row
   */
  _mapToRow(expense) {
    return {
      id: expense.id,
      user_id: expense.userId,
      description: expense.description,
      amount: expense.amount.getValue(),
      category: expense.category.getValue(),
      date: expense.date.toISOString(),
      created_at: expense.createdAt,
      updated_at: expense.updatedAt
    }
  }

  async findByIdAndUserId(id, userId) {
    try {
      const { data, error } = await this.db
        .from('expenses')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return null
        }
        throw new Error(`Database error: ${error.message}`)
      }

      return this._mapToExpense(data)
    } catch (error) {
      throw new Error(`Failed to find expense: ${error.message}`)
    }
  }

  async findByUserId(userId, filters = {}, pagination = {}) {
    try {
      const { limit = 50, offset = 0 } = pagination

      // Build query
      let query = this.db
        .from('expenses')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      
      if (filters.dateFrom) {
        query = query.gte('date', filters.dateFrom)
      }
      
      if (filters.dateTo) {
        query = query.lte('date', filters.dateTo)
      }

      if (filters.search) {
        query = query.ilike('description', `%${filters.search}%`)
      }

      const { data, error, count } = await query

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      const expenses = data.map(row => this._mapToExpense(row))

      return {
        expenses,
        total: count || 0
      }
    } catch (error) {
      throw new Error(`Failed to find expenses: ${error.message}`)
    }
  }

  async save(expense) {
    try {
      const row = this._mapToRow(expense)
      delete row.id // Let database generate ID
      delete row.created_at // Let database set timestamp
      delete row.updated_at // Let database set timestamp

      const { data, error } = await this.db
        .from('expenses')
        .insert([row])
        .select()
        .single()

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      return this._mapToExpense(data)
    } catch (error) {
      throw new Error(`Failed to save expense: ${error.message}`)
    }
  }

  async update(expense) {
    try {
      const row = this._mapToRow(expense)
      delete row.created_at // Don't update created_at
      row.updated_at = new Date().toISOString()

      const { data, error } = await this.db
        .from('expenses')
        .update(row)
        .eq('id', expense.id)
        .eq('user_id', expense.userId)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          throw new Error('Expense not found or access denied')
        }
        throw new Error(`Database error: ${error.message}`)
      }

      return this._mapToExpense(data)
    } catch (error) {
      throw new Error(`Failed to update expense: ${error.message}`)
    }
  }

  async deleteByIdAndUserId(id, userId) {
    try {
      const { error } = await this.db
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      return true
    } catch (error) {
      throw new Error(`Failed to delete expense: ${error.message}`)
    }
  }

  async getSummaryByUserId(userId, filters = {}) {
    try {
      // Build query for summary data
      let query = this.db
        .from('expenses')
        .select('amount, category, date')
        .eq('user_id', userId)

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      
      if (filters.dateFrom) {
        query = query.gte('date', filters.dateFrom)
      }
      
      if (filters.dateTo) {
        query = query.lte('date', filters.dateTo)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      // Calculate summary
      const total = data.reduce((sum, expense) => sum + parseFloat(expense.amount), 0)
      const count = data.length

      // Calculate category breakdown
      const categories = data.reduce((acc, expense) => {
        const category = expense.category
        if (!acc[category]) {
          acc[category] = { amount: 0, count: 0 }
        }
        acc[category].amount += parseFloat(expense.amount)
        acc[category].count += 1
        return acc
      }, {})

      // Calculate monthly breakdown
      const monthly = data.reduce((acc, expense) => {
        const date = new Date(expense.date)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        if (!acc[monthKey]) {
          acc[monthKey] = { amount: 0, count: 0 }
        }
        acc[monthKey].amount += parseFloat(expense.amount)
        acc[monthKey].count += 1
        return acc
      }, {})

      return {
        total,
        count,
        average: count > 0 ? total / count : 0,
        categories,
        monthly
      }
    } catch (error) {
      throw new Error(`Failed to get expense summary: ${error.message}`)
    }
  }

  async existsByIdAndUserId(id, userId) {
    try {
      const { data, error } = await this.db
        .from('expenses')
        .select('id')
        .eq('id', id)
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return false
        }
        throw new Error(`Database error: ${error.message}`)
      }

      return !!data
    } catch (error) {
      throw new Error(`Failed to check expense existence: ${error.message}`)
    }
  }
}