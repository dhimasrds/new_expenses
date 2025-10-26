import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

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
        url: process.env.VERCEL_URL 
          ? `https://${process.env.VERCEL_URL}` 
          : process.env.API_URL || 'http://localhost:3001',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      },
      {
        url: 'http://localhost:3001',
        description: 'Local development server'
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
    './backend/src/presentation/http/controllers/*.js',
    './backend/src/presentation/http/routes/*.js'
  ],
};

const specs = swaggerJSDoc(options);

/**
 * Setup Swagger documentation for Express app
 * @param {import('express').Application} app - Express application
 */
export function setupSwagger(app) {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve);
  app.get('/api-docs', swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Expense Tracker API Documentation'
  }));

  // JSON schema endpoint
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log('📚 Swagger documentation setup complete');
  console.log('📖 API Docs available at: /api-docs');
}

export default specs;