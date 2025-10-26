import Joi from 'joi'
import { ExpenseCategory } from '../../../domain/value-objects/ExpenseCategory.js'

/**
 * Validation middleware for HTTP requests
 */
export class ValidationMiddleware {
  /**
   * Validates expense data
   */
  static validateExpenseData() {
    const schema = Joi.object({
      description: Joi.string()
        .trim()
        .required()
        .min(1)
        .max(255)
        .messages({
          'string.empty': 'Description is required',
          'string.min': 'Description cannot be empty',
          'string.max': 'Description must be 255 characters or less',
          'any.required': 'Description is required'
        }),
      
      amount: Joi.number()
        .positive()
        .precision(2)
        .max(999999.99)
        .required()
        .messages({
          'number.positive': 'Amount must be greater than zero',
          'number.max': 'Amount cannot exceed 999,999.99',
          'any.required': 'Amount is required'
        }),
      
      category: Joi.string()
        .valid(...ExpenseCategory.getValidCategories())
        .required()
        .messages({
          'any.only': `Category must be one of: ${ExpenseCategory.getValidCategories().join(', ')}`,
          'any.required': 'Category is required'
        }),
      
      date: Joi.date()
        .iso()
        .min(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)) // 1 year ago
        .max(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)) // 1 year from now
        .required()
        .messages({
          'date.format': 'Date must be a valid ISO 8601 date string',
          'date.min': 'Date cannot be more than one year ago',
          'date.max': 'Date cannot be more than one year in the future',
          'any.required': 'Date is required'
        })
    })

    return this._createValidationMiddleware(schema)
  }

  /**
   * Validates login data
   */
  static validateLoginData() {
    const schema = Joi.object({
      email: Joi.string()
        .email()
        .required()
        .messages({
          'string.email': 'Email must be a valid email format',
          'any.required': 'Email is required'
        }),
      
      password: Joi.string()
        .required()
        .messages({
          'any.required': 'Password is required'
        })
    })

    return this._createValidationMiddleware(schema)
  }

  /**
   * Validates signup data
   */
  static validateSignupData() {
    const schema = Joi.object({
      email: Joi.string()
        .email()
        .required()
        .messages({
          'string.email': 'Email must be a valid email format',
          'any.required': 'Email is required'
        }),
      
      password: Joi.string()
        .min(6)
        .max(128)
        .required()
        .messages({
          'string.min': 'Password must be at least 6 characters long',
          'string.max': 'Password must be 128 characters or less',
          'any.required': 'Password is required'
        }),
      
      name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .optional()
        .messages({
          'string.min': 'Name must be at least 2 characters long',
          'string.max': 'Name must be 100 characters or less'
        })
    })

    return this._createValidationMiddleware(schema)
  }

  /**
   * Validates query parameters for expense listing
   */
  static validateExpenseQuery() {
    const schema = Joi.object({
      limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .optional(),
      
      offset: Joi.number()
        .integer()
        .min(0)
        .optional(),
      
      category: Joi.string()
        .valid(...ExpenseCategory.getValidCategories())
        .optional(),
      
      date_from: Joi.date()
        .iso()
        .optional(),
      
      dateFrom: Joi.date()
        .iso()
        .optional(),
      
      date_to: Joi.date()
        .iso()
        .optional(),
      
      dateTo: Joi.date()
        .iso()
        .optional(),
      
      search: Joi.string()
        .trim()
        .max(255)
        .optional()
    })

    return this._createValidationMiddleware(schema, 'query')
  }

  /**
   * Validates expense ID parameter
   */
  static validateExpenseId() {
    const schema = Joi.object({
      id: Joi.string()
        .pattern(/^exp_/)
        .required()
        .messages({
          'string.pattern.base': 'Invalid expense ID format',
          'any.required': 'Expense ID is required'
        })
    })

    return this._createValidationMiddleware(schema, 'params')
  }

  /**
   * Creates a validation middleware function
   * @param {Joi.Schema} schema 
   * @param {string} property - Property to validate (body, query, params)
   * @returns {Function} Middleware function
   */
  static _createValidationMiddleware(schema, property = 'body') {
    return (req, res, next) => {
      const { error, value } = schema.validate(req[property], {
        abortEarly: false,
        stripUnknown: true
      })

      if (error) {
        const errors = error.details.map(detail => detail.message)
        return res.status(400).json({
          error: 'Validation failed',
          message: 'Please fix the following errors:',
          details: errors
        })
      }

      // Replace the property with the validated and sanitized value
      req[property] = value
      next()
    }
  }
}