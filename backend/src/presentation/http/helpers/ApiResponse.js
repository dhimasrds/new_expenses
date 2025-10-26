/**
 * Standard API Response Structure
 * Based on REST API best practices (Zalando Guidelines)
 * 
 * Success Response:
 * {
 *   data: {...},
 *   meta?: {...}
 * }
 * 
 * Error Response:
 * {
 *   error: {
 *     code: string,
 *     message: string,
 *     details?: any
 *   }
 * }
 */

export class ApiResponse {
  /**
   * Success response with data
   * @param {any} data - Response data
   * @param {object} meta - Optional metadata (pagination, etc)
   */
  static success(data, meta = null) {
    const response = { data }
    if (meta) {
      response.meta = meta
    }
    return response
  }

  /**
   * Error response
   * @param {string} code - Error code (e.g., 'VALIDATION_ERROR', 'NOT_FOUND')
   * @param {string} message - Human-readable error message
   * @param {any} details - Optional error details
   */
  static error(code, message, details = null) {
    const response = {
      error: {
        code,
        message
      }
    }
    if (details) {
      response.error.details = details
    }
    return response
  }

  /**
   * Paginated response with metadata
   * @param {Array} items - Array of items
   * @param {number} total - Total count of items
   * @param {number} page - Current page number
   * @param {number} limit - Items per page
   */
  static paginated(items, total, page, limit) {
    return {
      data: items,
      meta: {
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(total),
          totalPages: Math.ceil(total / limit)
        }
      }
    }
  }
}

/**
 * Standard Error Codes
 */
export const ErrorCodes = {
  // Authentication & Authorization
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // Resources
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  
  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  
  // Business Logic
  OPERATION_FAILED: 'OPERATION_FAILED'
}
