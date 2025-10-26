import { SimpleDatabaseConnection } from '../infrastructure/database/SimpleDatabaseConnection.js'
import { SupabaseExpenseRepository } from '../infrastructure/repositories/SupabaseExpenseRepository.js'
import { SupabaseUserRepository } from '../infrastructure/repositories/SupabaseUserRepository.js'
import { SupabaseAuthService } from '../infrastructure/external/SupabaseAuthService.js'
import { ExpenseService } from '../domain/services/ExpenseService.js'
import { UserService } from '../domain/services/UserService.js'
import { CreateExpenseUseCase } from '../application/usecases/expense/CreateExpenseUseCase.js'
import { GetExpensesByUserUseCase } from '../application/usecases/expense/GetExpensesByUserUseCase.js'
import { GetExpenseByIdUseCase } from '../application/usecases/expense/GetExpenseByIdUseCase.js'
import { UpdateExpenseUseCase } from '../application/usecases/expense/UpdateExpenseUseCase.js'
import { DeleteExpenseUseCase } from '../application/usecases/expense/DeleteExpenseUseCase.js'
import { GetExpenseSummaryUseCase } from '../application/usecases/expense/GetExpenseSummaryUseCase.js'
import { LoginUserUseCase } from '../application/usecases/auth/LoginUserUseCase.js'
import { RegisterUserUseCase } from '../application/usecases/auth/RegisterUserUseCase.js'
import { VerifyTokenUseCase } from '../application/usecases/auth/VerifyTokenUseCase.js'
import { GetUserProfileUseCase } from '../application/usecases/auth/GetUserProfileUseCase.js'
import { ExpenseController } from '../presentation/http/controllers/ExpenseController.js'
import { AuthController } from '../presentation/http/controllers/AuthController.js'
import { AuthenticationMiddleware } from '../presentation/http/middleware/AuthenticationMiddleware.js'

/**
 * Setup all application dependencies in the container
 */
export async function setupDependencies(container) {
  // Infrastructure - Database
  container.registerSingleton('dbConnection', () => {
    return new SimpleDatabaseConnection()
  })

  // Infrastructure - Repositories
  container.registerSingleton('expenseRepository', (dbConnection) => {
    return new SupabaseExpenseRepository(dbConnection)
  }, ['dbConnection'])

  container.registerSingleton('userRepository', (dbConnection) => {
    return new SupabaseUserRepository(dbConnection)
  }, ['dbConnection'])

  // Infrastructure - External Services
  container.registerSingleton('authService', (dbConnection) => {
    return new SupabaseAuthService(dbConnection)
  }, ['dbConnection'])

  // Domain Services
  container.registerSingleton('expenseService', (expenseRepository) => {
    return new ExpenseService(expenseRepository)
  }, ['expenseRepository'])

  container.registerSingleton('userService', (userRepository) => {
    return new UserService(userRepository)
  }, ['userRepository'])

  // Application - Use Cases - Expense
  container.register('createExpenseUseCase', (expenseService) => {
    return new CreateExpenseUseCase(expenseService)
  }, { dependencies: ['expenseService'] })

  container.register('getExpensesByUserUseCase', (expenseService) => {
    return new GetExpensesByUserUseCase(expenseService)
  }, { dependencies: ['expenseService'] })

  container.register('getExpenseByIdUseCase', (expenseService) => {
    return new GetExpenseByIdUseCase(expenseService)
  }, { dependencies: ['expenseService'] })

  container.register('updateExpenseUseCase', (expenseService) => {
    return new UpdateExpenseUseCase(expenseService)
  }, { dependencies: ['expenseService'] })

  container.register('deleteExpenseUseCase', (expenseService) => {
    return new DeleteExpenseUseCase(expenseService)
  }, { dependencies: ['expenseService'] })

  container.register('getExpenseSummaryUseCase', (expenseService) => {
    return new GetExpenseSummaryUseCase(expenseService)
  }, { dependencies: ['expenseService'] })

  // Application - Use Cases - Auth
  container.register('loginUserUseCase', (authService, userService) => {
    return new LoginUserUseCase(authService, userService)
  }, { dependencies: ['authService', 'userService'] })

  container.register('registerUserUseCase', (authService, userService) => {
    return new RegisterUserUseCase(authService, userService)
  }, { dependencies: ['authService', 'userService'] })

  container.register('verifyTokenUseCase', (authService) => {
    return new VerifyTokenUseCase(authService)
  }, { dependencies: ['authService'] })

  container.register('getUserProfileUseCase', (userService) => {
    return new GetUserProfileUseCase(userService)
  }, { dependencies: ['userService'] })

  // Presentation - Controllers
  container.register('expenseController', (
    createExpenseUseCase,
    getExpensesByUserUseCase,
    getExpenseByIdUseCase,
    updateExpenseUseCase,
    deleteExpenseUseCase,
    getExpenseSummaryUseCase
  ) => {
    return new ExpenseController(
      createExpenseUseCase,
      getExpensesByUserUseCase,
      getExpenseByIdUseCase,
      updateExpenseUseCase,
      deleteExpenseUseCase,
      getExpenseSummaryUseCase
    )
  }, { 
    dependencies: [
      'createExpenseUseCase',
      'getExpensesByUserUseCase',
      'getExpenseByIdUseCase',
      'updateExpenseUseCase',
      'deleteExpenseUseCase',
      'getExpenseSummaryUseCase'
    ] 
  })

  container.register('authController', (
    loginUserUseCase,
    registerUserUseCase,
    verifyTokenUseCase,
    getUserProfileUseCase
  ) => {
    return new AuthController(
      loginUserUseCase,
      registerUserUseCase,
      verifyTokenUseCase,
      getUserProfileUseCase
    )
  }, { 
    dependencies: [
      'loginUserUseCase',
      'registerUserUseCase',
      'verifyTokenUseCase',
      'getUserProfileUseCase'
    ] 
  })

  // Presentation - Middleware
  container.register('authMiddleware', (verifyTokenUseCase) => {
    return new AuthenticationMiddleware(verifyTokenUseCase)
  }, { dependencies: ['verifyTokenUseCase'] })

  console.log('✅ All dependencies registered successfully')
}