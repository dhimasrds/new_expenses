/**
 * Data Transfer Objects for Expense operations
 * These DTOs define the structure of data flowing between layers
 */

export class CreateExpenseDTO {
  constructor(userId, description, amount, category, date) {
    this.userId = userId
    this.description = description
    this.amount = amount
    this.category = category
    this.date = date
  }

  static fromRequest(userId, requestBody) {
    return new CreateExpenseDTO(
      userId,
      requestBody.description,
      requestBody.amount,
      requestBody.category,
      requestBody.date
    )
  }
}

export class UpdateExpenseDTO {
  constructor(id, userId, description, amount, category, date) {
    this.id = id
    this.userId = userId
    this.description = description
    this.amount = amount
    this.category = category
    this.date = date
  }

  static fromRequest(id, userId, requestBody) {
    return new UpdateExpenseDTO(
      id,
      userId,
      requestBody.description,
      requestBody.amount,
      requestBody.category,
      requestBody.date
    )
  }
}

export class ExpenseFilterDTO {
  constructor(userId, category = null, dateFrom = null, dateTo = null, search = null) {
    this.userId = userId
    this.category = category
    this.dateFrom = dateFrom
    this.dateTo = dateTo
    this.search = search
  }

  static fromQuery(userId, queryParams) {
    return new ExpenseFilterDTO(
      userId,
      queryParams.category,
      queryParams.date_from || queryParams.dateFrom,
      queryParams.date_to || queryParams.dateTo,
      queryParams.search
    )
  }

  hasFilters() {
    return !!(this.category || this.dateFrom || this.dateTo || this.search)
  }
}

export class PaginationDTO {
  constructor(limit = 50, offset = 0) {
    this.limit = Math.min(Math.max(parseInt(limit) || 50, 1), 100)
    this.offset = Math.max(parseInt(offset) || 0, 0)
  }

  static fromQuery(queryParams) {
    return new PaginationDTO(
      queryParams.limit,
      queryParams.offset
    )
  }

  getPage() {
    return Math.floor(this.offset / this.limit) + 1
  }

  hasMore(total) {
    return total > this.offset + this.limit
  }
}

export class ExpenseResponseDTO {
  constructor(expense) {
    this.id = expense.id
    this.userId = expense.userId
    this.description = expense.description
    this.amount = expense.amount.getValue()
    this.category = expense.category.getValue()
    this.date = expense.date.toDateString()
    this.createdAt = expense.createdAt
    this.updatedAt = expense.updatedAt
  }

  static fromExpense(expense) {
    return new ExpenseResponseDTO(expense)
  }

  static fromExpenses(expenses) {
    return expenses.map(expense => new ExpenseResponseDTO(expense))
  }
}

export class ExpenseListResponseDTO {
  constructor(expenses, total, pagination) {
    this.data = ExpenseResponseDTO.fromExpenses(expenses)
    this.pagination = {
      total,
      limit: pagination.limit,
      offset: pagination.offset,
      page: pagination.getPage(),
      hasMore: pagination.hasMore(total)
    }
  }
}

export class ExpenseSummaryResponseDTO {
  constructor(summary) {
    this.total = summary.total
    this.count = summary.count
    this.average = summary.average
    this.mostExpensive = summary.mostExpensive
    this.categories = summary.categories
    this.monthly = summary.monthly
  }

  static fromSummary(summary) {
    return new ExpenseSummaryResponseDTO(summary)
  }
}