# API Response Structure Standard

## Overview
All API endpoints follow a consistent response structure based on REST API best practices (Zalando Guidelines).

## Response Formats

### Success Response
```json
{
  "data": { ... }
}
```

### Success with Metadata
```json
{
  "data": [ ... ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

### Error Response
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }  // Optional
  }
}
```

## Standard Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `INVALID_CREDENTIALS` | 401 | Wrong email/password |
| `TOKEN_EXPIRED` | 401 | JWT token has expired |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `INVALID_INPUT` | 400 | Invalid input data |
| `NOT_FOUND` | 404 | Resource not found |
| `ALREADY_EXISTS` | 409 | Resource already exists |
| `INTERNAL_ERROR` | 500 | Server internal error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |
| `OPERATION_FAILED` | 500 | Business operation failed |

## Examples by Endpoint

### Authentication

#### POST /api/auth/login
**Success (200):**
```json
{
  "data": {
    "user": {
      "id": "56bd5008-dd82-4893-abaf-05be9798b3d6",
      "email": "user@example.com"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error (401):**
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

#### POST /api/auth/signup
**Success (201):**
```json
{
  "data": {
    "user": {
      "id": "56bd5008-dd82-4893-abaf-05be9798b3d6",
      "email": "user@example.com"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error (409):**
```json
{
  "error": {
    "code": "ALREADY_EXISTS",
    "message": "User already exists with this email"
  }
}
```

### Expenses

#### GET /api/expenses
**Success (200):**
```json
{
  "data": [
    {
      "id": "exp_fb549f73b13f4578b9eca2e20c46c12c",
      "userId": "56bd5008-dd82-4893-abaf-05be9798b3d6",
      "description": "Grocery Shopping",
      "amount": 89.3,
      "category": "Shopping",
      "date": "2024-10-20T10:15:00.000Z",
      "createdAt": "2025-10-22T09:21:23.571681+00:00",
      "updatedAt": "2025-10-22T09:21:23.571681+00:00"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

#### GET /api/expenses/:id
**Success (200):**
```json
{
  "data": {
    "id": "exp_fb549f73b13f4578b9eca2e20c46c12c",
    "userId": "56bd5008-dd82-4893-abaf-05be9798b3d6",
    "description": "Grocery Shopping",
    "amount": 89.3,
    "category": "Shopping",
    "date": "2024-10-20T10:15:00.000Z",
    "createdAt": "2025-10-22T09:21:23.571681+00:00",
    "updatedAt": "2025-10-22T09:21:23.571681+00:00"
  }
}
```

**Error (404):**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Expense not found"
  }
}
```

#### POST /api/expenses
**Success (201):**
```json
{
  "data": {
    "id": "exp_new123...",
    "userId": "56bd5008-dd82-4893-abaf-05be9798b3d6",
    "description": "Grocery Shopping",
    "amount": 89.5,
    "category": "Shopping",
    "date": "2024-10-26T00:00:00.000Z",
    "createdAt": "2025-10-26T10:00:00.000Z",
    "updatedAt": "2025-10-26T10:00:00.000Z"
  }
}
```

**Error (400):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed: amount must be a positive number"
  }
}
```

#### PUT /api/expenses/:id
**Success (200):**
```json
{
  "data": {
    "id": "exp_fb549f73b13f4578b9eca2e20c46c12c",
    "userId": "56bd5008-dd82-4893-abaf-05be9798b3d6",
    "description": "Updated Description",
    "amount": 95.0,
    "category": "Shopping",
    "date": "2024-10-26T00:00:00.000Z",
    "createdAt": "2025-10-22T09:21:23.571681+00:00",
    "updatedAt": "2025-10-26T10:00:00.000Z"
  }
}
```

#### DELETE /api/expenses/:id
**Success (204 No Content):**
```
(empty response body)
```

**Error (404):**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Expense not found"
  }
}
```

#### GET /api/expenses/summary
**Success (200):**
```json
{
  "data": {
    "total": 89.3,
    "count": 1,
    "byCategory": [
      {
        "category": "Shopping",
        "total": 89.3,
        "count": 1
      }
    ]
  }
}
```

## Frontend Integration

### Handling Success Response
```typescript
const response = await fetch('/api/expenses');
const result = await response.json();

if (response.ok) {
  const expenses = result.data;  // Access data directly
  const pagination = result.meta?.pagination;  // Access metadata
}
```

### Handling Error Response
```typescript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});

const result = await response.json();

if (!response.ok) {
  const errorCode = result.error.code;  // e.g., "INVALID_CREDENTIALS"
  const errorMessage = result.error.message;  // e.g., "Invalid email or password"
  const errorDetails = result.error.details;  // Optional additional info
}
```

### TypeScript Types
```typescript
// Success response
interface ApiSuccessResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// Error response
interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

## Key Changes from Old Structure

### Before (Inconsistent):
```json
// Auth endpoint
{
  "success": true,
  "data": {
    "user": { ... },
    "access_token": "...",
    "session": { ... }
  },
  "message": "Login successful"
}

// Expenses endpoint
{
  "success": true,
  "data": {
    "expenses": [ ... ],
    "total": 50
  },
  "message": "Expenses retrieved successfully"
}

// Error (inconsistent)
{
  "error": "Unauthorized",
  "message": "Invalid token"
}
```

### After (Standardized):
```json
// Auth endpoint
{
  "data": {
    "user": { "id": "...", "email": "..." },
    "accessToken": "..."
  }
}

// Expenses endpoint
{
  "data": [ ... ],
  "meta": {
    "pagination": { ... }
  }
}

// Error (consistent)
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid token"
  }
}
```

## Benefits

1. **Consistency**: Same structure across all endpoints
2. **Simplicity**: Less nesting, easier to parse
3. **Standards Compliant**: Follows REST API best practices
4. **Type Safety**: Clear TypeScript types
5. **Error Handling**: Standard error codes and messages
6. **Metadata Support**: Clean separation of data and metadata
7. **Frontend Friendly**: Easy to integrate and handle

## References

- Based on [Zalando RESTful API Guidelines](https://github.com/zalando/restful-api-guidelines)
- Follows REST API best practices for response structure
- Implements standard error handling patterns
- Uses semantic HTTP status codes
