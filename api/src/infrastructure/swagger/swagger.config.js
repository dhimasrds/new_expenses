import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Expense Tracker API',
      version: '1.0.0',
      description: 'Clean Architecture API for expense tracking application',
      contact: {
        name: 'API Support',
        email: 'support@expensetracker.com'
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      },
      {
        url: 'https://your-production-url.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['id', 'email', 'created_at'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User unique identifier'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            full_name: {
              type: 'string',
              description: 'User full name'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        Expense: {
          type: 'object',
          required: ['id', 'amount', 'description', 'category', 'date', 'user_id'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Expense unique identifier'
            },
            amount: {
              type: 'number',
              format: 'float',
              minimum: 0,
              description: 'Expense amount'
            },
            description: {
              type: 'string',
              description: 'Expense description'
            },
            category: {
              type: 'string',
              enum: ['food', 'transportation', 'entertainment', 'utilities', 'shopping', 'healthcare', 'education', 'other'],
              description: 'Expense category'
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Expense date'
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              description: 'User who created the expense'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        CreateExpenseRequest: {
          type: 'object',
          required: ['amount', 'description', 'category', 'date'],
          properties: {
            amount: {
              type: 'number',
              format: 'float',
              minimum: 0,
              example: 25.50
            },
            description: {
              type: 'string',
              example: 'Lunch at restaurant'
            },
            category: {
              type: 'string',
              enum: ['food', 'transportation', 'entertainment', 'utilities', 'shopping', 'healthcare', 'education', 'other'],
              example: 'food'
            },
            date: {
              type: 'string',
              format: 'date',
              example: '2024-10-25'
            }
          }
        },
        UpdateExpenseRequest: {
          type: 'object',
          properties: {
            amount: {
              type: 'number',
              format: 'float',
              minimum: 0
            },
            description: {
              type: 'string'
            },
            category: {
              type: 'string',
              enum: ['food', 'transportation', 'entertainment', 'utilities', 'shopping', 'healthcare', 'education', 'other']
            },
            date: {
              type: 'string',
              format: 'date'
            }
          }
        },
        AuthRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 6,
              example: 'password123'
            }
          }
        },
        SignUpRequest: {
          type: 'object',
          required: ['email', 'password', 'full_name'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 6,
              example: 'password123'
            },
            full_name: {
              type: 'string',
              example: 'John Doe'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: {
              $ref: '#/components/schemas/User'
            },
            token: {
              type: 'string',
              description: 'JWT access token'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error type'
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            details: {
              type: 'object',
              description: 'Additional error details'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Success message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        },
        PaginatedExpensesResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Expense'
              }
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  description: 'Current page number'
                },
                limit: {
                  type: 'integer',
                  description: 'Items per page'
                },
                total: {
                  type: 'integer',
                  description: 'Total items count'
                },
                totalPages: {
                  type: 'integer',
                  description: 'Total pages count'
                }
              }
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                error: 'Unauthorized',
                message: 'No valid token provided. Please include Authorization header with Bearer token.'
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                error: 'Validation Error',
                message: 'Invalid request data',
                details: {
                  amount: 'Amount must be a positive number'
                }
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                error: 'Not Found',
                message: 'Expense not found'
              }
            }
          }
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                error: 'Internal Server Error',
                message: 'Something went wrong'
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/presentation/routes/*.js',
    './src/presentation/controllers/*.js'
  ],
};

const specs = swaggerJSDoc(options);

export default specs;