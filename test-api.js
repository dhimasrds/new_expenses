#!/usr/bin/env node

// ================================================
// API TEST SCRIPT
// ================================================
// Script untuk testing API endpoints secara programatic

import fetch from 'node-fetch'

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'

class APITester {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
    this.token = null
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      })

      const data = await response.json()
      
      return {
        status: response.status,
        data,
        ok: response.ok
      }
    } catch (error) {
      return {
        status: 0,
        error: error.message,
        ok: false
      }
    }
  }

  async login(email, password) {
    console.log('🔐 Testing login...')
    const result = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })

    if (result.ok) {
      this.token = result.data.access_token
      console.log('✅ Login successful')
      return true
    } else {
      console.log('❌ Login failed:', result.data.message)
      return false
    }
  }

  async testHealthCheck() {
    console.log('🏥 Testing health check...')
    const result = await this.request('/health')
    
    if (result.ok) {
      console.log('✅ Health check passed:', result.data.status)
    } else {
      console.log('❌ Health check failed')
    }
    
    return result.ok
  }

  async testCreateExpense() {
    console.log('💰 Testing create expense...')
    const expenseData = {
      description: 'Test Coffee Purchase',
      amount: 5.75,
      category: 'Food',
      date: new Date().toISOString()
    }

    const result = await this.request('/api/v1/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData)
    })

    if (result.ok) {
      console.log('✅ Expense created:', result.data.id)
      return result.data
    } else {
      console.log('❌ Create expense failed:', result.data.message)
      return null
    }
  }

  async testGetExpenses() {
    console.log('📋 Testing get expenses...')
    const result = await this.request('/api/v1/expenses')
    
    if (result.ok) {
      console.log(`✅ Got ${result.data.data.length} expenses`)
      return result.data.data
    } else {
      console.log('❌ Get expenses failed:', result.data.message)
      return null
    }
  }

  async testUpdateExpense(expenseId) {
    console.log('📝 Testing update expense...')
    const updateData = {
      description: 'Updated Test Coffee Purchase',
      amount: 6.25,
      category: 'Food',
      date: new Date().toISOString()
    }

    const result = await this.request(`/api/v1/expenses/${expenseId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    })

    if (result.ok) {
      console.log('✅ Expense updated successfully')
      return result.data
    } else {
      console.log('❌ Update expense failed:', result.data.message)
      return null
    }
  }

  async testDeleteExpense(expenseId) {
    console.log('🗑️  Testing delete expense...')
    const result = await this.request(`/api/v1/expenses/${expenseId}`, {
      method: 'DELETE'
    })

    if (result.ok) {
      console.log('✅ Expense deleted successfully')
      return true
    } else {
      console.log('❌ Delete expense failed:', result.data.message)
      return false
    }
  }

  async runAllTests() {
    console.log(`🚀 Starting API tests against ${this.baseUrl}\n`)

    // Test 1: Health Check
    await this.testHealthCheck()
    console.log('')

    // Test 2: Login (skip if no credentials)
    const email = process.env.TEST_EMAIL
    const password = process.env.TEST_PASSWORD

    if (!email || !password) {
      console.log('⚠️  Skipping authenticated tests - no credentials provided')
      console.log('   Set TEST_EMAIL and TEST_PASSWORD environment variables to run full tests')
      return
    }

    const loginSuccess = await this.login(email, password)
    if (!loginSuccess) return

    console.log('')

    // Test 3: Create Expense
    const createdExpense = await this.testCreateExpense()
    if (!createdExpense) return

    console.log('')

    // Test 4: Get Expenses
    const expenses = await this.testGetExpenses()
    console.log('')

    // Test 5: Update Expense
    const updatedExpense = await this.testUpdateExpense(createdExpense.id)
    console.log('')

    // Test 6: Delete Expense
    await this.testDeleteExpense(createdExpense.id)
    console.log('')

    console.log('🎉 All tests completed!')
  }
}

// Run tests
const tester = new APITester(API_BASE_URL)
tester.runAllTests().catch(console.error)