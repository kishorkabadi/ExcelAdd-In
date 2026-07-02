import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import axios from 'axios'

const API_URL = 'https://localhost:7001/api'

let authToken = ''
let testUserId = 0

describe('API Integration Tests', () => {
  beforeAll(async () => {
    // Login and get token
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      username: 'testuser',
      password: 'password123',
    })
    authToken = loginResponse.data.data.accessToken
    testUserId = loginResponse.data.data.user.id
  })

  const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })

  describe('Data Endpoints', () => {
    it('should GET all data items', async () => {
      const response = await apiClient.get('/data')
      expect(response.status).toBe(200)
      expect(response.data.success).toBe(true)
      expect(Array.isArray(response.data.data)).toBe(true)
    })

    it('should POST create new data item', async () => {
      const response = await apiClient.post('/data', {
        name: 'Integration Test Item',
        value: 999.99,
      })
      expect(response.status).toBe(201)
      expect(response.data.success).toBe(true)
      expect(response.data.data.id).toBeDefined()
    })

    it('should GET data item by ID', async () => {
      // First create an item
      const createResponse = await apiClient.post('/data', {
        name: 'Test Item',
        value: 100,
      })
      const itemId = createResponse.data.data.id

      // Then retrieve it
      const getResponse = await apiClient.get(`/data/${itemId}`)
      expect(getResponse.status).toBe(200)
      expect(getResponse.data.data.id).toBe(itemId)
    })

    it('should PUT update data item', async () => {
      // First create an item
      const createResponse = await apiClient.post('/data', {
        name: 'Test Item',
        value: 100,
      })
      const itemId = createResponse.data.data.id

      // Then update it
      const updateResponse = await apiClient.put(`/data/${itemId}`, {
        name: 'Updated Item',
        value: 200,
      })
      expect(updateResponse.status).toBe(200)
      expect(updateResponse.data.data.name).toBe('Updated Item')
    })

    it('should DELETE data item', async () => {
      // First create an item
      const createResponse = await apiClient.post('/data', {
        name: 'Test Item',
        value: 100,
      })
      const itemId = createResponse.data.data.id

      // Then delete it
      const deleteResponse = await apiClient.delete(`/data/${itemId}`)
      expect(deleteResponse.status).toBe(200)
    })
  })

  describe('Auth Endpoints', () => {
    it('should register new user', async () => {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        firstName: 'Test',
        lastName: 'User',
        password: 'password123',
      })
      expect(response.status).toBe(200)
      expect(response.data.data.id).toBeDefined()
    })

    it('should refresh token', async () => {
      const response = await axios.post(`${API_URL}/auth/refresh`, {
        refreshToken: 'valid_refresh_token_here',
      })
      expect(response.status).toBe(200)
      expect(response.data.data.accessToken).toBeDefined()
    })
  })

  describe('User Endpoints', () => {
    it('should GET user profile', async () => {
      const response = await apiClient.get('/user/profile')
      expect(response.status).toBe(200)
      expect(response.data.data.id).toBeDefined()
      expect(response.data.data.username).toBeDefined()
    })

    it('should PUT update user profile', async () => {
      const response = await apiClient.put('/user/profile', {
        firstName: 'Updated',
        lastName: 'User',
        email: 'updated@example.com',
      })
      expect(response.status).toBe(200)
      expect(response.data.data.firstName).toBe('Updated')
    })
  })
})
