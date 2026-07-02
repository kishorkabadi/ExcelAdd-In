import axios, { AxiosInstance, AxiosError } from 'axios'
import { AuthService } from './AuthService'

export class SyncService {
  private static client: AxiosInstance
  private static readonly API_URL = localStorage.getItem('apiUrl') || 'https://localhost:7001'

  static initClient(): AxiosInstance {
    if (!this.client) {
      this.client = axios.create({
        baseURL: this.API_URL,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Request interceptor
      this.client.interceptors.request.use(
        (config) => {
          const token = AuthService.getToken()
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
          return config
        },
        (error) => Promise.reject(error),
      )

      // Response interceptor
      this.client.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
          const originalRequest = error.config as any

          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
              const newToken = await AuthService.refreshToken()
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              return this.client(originalRequest)
            } catch {
              // Redirect to login
              window.location.href = '/login'
              return Promise.reject(error)
            }
          }
          return Promise.reject(error)
        },
      )
    }
    return this.client
  }

  static async syncData(data: any[]): Promise<any> {
    const client = this.initClient()
    try {
      const response = await client.post('/api/data/sync', { items: data })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  static async pullData(): Promise<any[]> {
    const client = this.initClient()
    try {
      const response = await client.get('/api/data')
      return response.data.data || []
    } catch (error) {
      throw this.handleError(error)
    }
  }

  static async pushData(data: any[]): Promise<void> {
    const client = this.initClient()
    try {
      await client.post('/api/data/batch', { items: data })
    } catch (error) {
      throw this.handleError(error)
    }
  }

  static async uploadExcelFile(file: File): Promise<any> {
    const client = this.initClient()
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await client.post('/api/data/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  static async downloadExcel(): Promise<Blob> {
    const client = this.initClient()
    try {
      const response = await client.get('/api/data/export', {
        responseType: 'blob',
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  private static handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message
      return new Error(message)
    }
    return new Error('An error occurred during sync')
  }
}
