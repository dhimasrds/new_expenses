# Expense Tracker Backend - Clean Architecture

## 🏗️ Architecture Overview

This backend follows **Clean Architecture** principles to ensure:
- **Separation of Concerns**: Each layer has a single responsibility
- **Dependency Inversion**: Dependencies point inward toward the domain
- **Testability**: Easy to unit test business logic
- **Maintainability**: Easy to modify and extend

## 📁 Project Structure

```
backend/
├── src/
│   ├── domain/                    # Enterprise Business Rules
│   │   ├── entities/             # Core business objects
│   │   │   ├── Expense.js
│   │   │   └── User.js
│   │   ├── value-objects/        # Value objects with business rules
│   │   │   ├── Money.js
│   │   │   ├── ExpenseCategory.js
│   │   │   └── ExpenseDate.js
│   │   ├── repositories/         # Repository interfaces
│   │   │   ├── IExpenseRepository.js
│   │   │   └── IUserRepository.js
│   │   └── services/             # Domain services
│   │       ├── ExpenseService.js
│   │       └── UserService.js
│   │
│   ├── application/              # Application Business Rules
│   │   ├── dto/                  # Data Transfer Objects
│   │   │   ├── ExpenseDTO.js
│   │   │   └── UserDTO.js
│   │   ├── interfaces/           # Use case interfaces
│   │   │   ├── IExpenseUseCases.js
│   │   │   └── IAuthUseCases.js
│   │   └── usecases/            # Application use cases
│   │       ├── expense/
│   │       │   ├── CreateExpenseUseCase.js
│   │       │   ├── GetExpensesByUserUseCase.js
│   │       │   ├── GetExpenseByIdUseCase.js
│   │       │   ├── UpdateExpenseUseCase.js
│   │       │   ├── DeleteExpenseUseCase.js
│   │       │   └── GetExpenseSummaryUseCase.js
│   │       └── auth/
│   │           ├── LoginUserUseCase.js
│   │           ├── RegisterUserUseCase.js
│   │           ├── VerifyTokenUseCase.js
│   │           └── GetUserProfileUseCase.js
│   │
│   ├── infrastructure/           # External Interfaces
│   │   ├── database/
│   │   │   └── DatabaseConnection.js
│   │   ├── repositories/
│   │   │   ├── SupabaseExpenseRepository.js
│   │   │   └── SupabaseUserRepository.js
│   │   └── external/
│   │       └── SupabaseAuthService.js
│   │
│   ├── presentation/             # Interface Adapters
│   │   └── http/
│   │       ├── controllers/
│   │       │   ├── ExpenseController.js
│   │       │   └── AuthController.js
│   │       ├── middleware/
│   │       │   ├── AuthenticationMiddleware.js
│   │       │   └── ValidationMiddleware.js
│   │       └── routes/
│   │           ├── expenseRoutes.js
│   │           └── authRoutes.js
│   │
│   ├── shared/                   # Shared utilities
│   │   └── container/
│   │       └── Container.js
│   │
│   ├── config/                   # Configuration
│   │   └── dependencies.js       # Dependency injection setup
│   │
│   └── main.js                   # Application entry point
│
└── package.json
```

## 🔄 Data Flow

1. **HTTP Request** → Controller (Presentation Layer)
2. **Controller** → Use Case (Application Layer)
3. **Use Case** → Domain Service (Domain Layer)
4. **Domain Service** → Repository Interface (Domain Layer)
5. **Repository Implementation** → Database (Infrastructure Layer)

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- Supabase account and project

### Environment Setup
Create a `.env` file in the root directory:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Installation & Running
```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/login       # User login
POST   /api/auth/signup      # User registration
POST   /api/auth/verify-token # Verify JWT token
POST   /api/auth/logout      # User logout
GET    /api/auth/profile     # Get user profile (auth required)
```

### Expenses
```
GET    /api/expenses         # Get user expenses (auth required)
POST   /api/expenses         # Create expense (auth required)
GET    /api/expenses/:id     # Get expense by ID (auth required)
PUT    /api/expenses/:id     # Update expense (auth required)
DELETE /api/expenses/:id     # Delete expense (auth required)
GET    /api/expenses/summary # Get expense summary (auth required)
```

### Health Check
```
GET    /health              # Application health status
```

## 🧪 Testing

The clean architecture makes testing easy:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🔧 Key Features

### Dependency Injection
Uses a custom container for managing dependencies:
```javascript
const container = new Container()
container.registerSingleton('expenseService', ExpenseService, ['expenseRepository'])
```

### Validation
Joi schema validation for all inputs:
```javascript
// Automatic validation in middleware
ValidationMiddleware.validateExpenseData()
```

### Error Handling
Global error handling with proper HTTP status codes:
```javascript
// Automatic error formatting and logging
app.use(globalErrorHandler)
```

### Authentication
JWT-based authentication with Supabase:
```javascript
// Automatic token verification
authMiddleware.authenticate()
```

## 📦 Domain Models

### Expense Entity
```javascript
const expense = new Expense({
  id: 'uuid',
  amount: new Money(100, 'USD'),
  category: new ExpenseCategory('food'),
  date: new ExpenseDate('2024-01-15'),
  description: 'Lunch',
  userId: 'user-uuid'
})
```

### Value Objects
- **Money**: Handles currency and amount validation
- **ExpenseCategory**: Manages expense categories with validation
- **ExpenseDate**: Date handling with business rules

## 🎯 Benefits of This Architecture

1. **Testable**: Business logic is isolated and easy to test
2. **Maintainable**: Changes in one layer don't affect others
3. **Scalable**: Easy to add new features without breaking existing code
4. **Clean**: Clear separation of concerns
5. **Flexible**: Easy to swap implementations (e.g., change from Supabase to PostgreSQL)

## 🔄 Migration from Old Structure

The old monolithic API (`api/index.js`) is preserved for backward compatibility. You can switch between architectures using npm scripts:

```bash
# New clean architecture
npm run dev

# Old monolithic structure
npm run dev:api:old
```

## 🛠️ Development Guidelines

1. **Domain Layer**: Keep business logic pure, no external dependencies
2. **Application Layer**: Orchestrate domain objects, handle use cases
3. **Infrastructure Layer**: Implement technical details, databases, external APIs
4. **Presentation Layer**: Handle HTTP, validation, serialization

## 📈 Future Enhancements

- [ ] Add comprehensive unit tests
- [ ] Implement caching layer
- [ ] Add API documentation with Swagger
- [ ] Implement event sourcing
- [ ] Add logging and monitoring
- [ ] Implement rate limiting per user