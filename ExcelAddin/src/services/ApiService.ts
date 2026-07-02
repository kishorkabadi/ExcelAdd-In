import axios, { AxiosInstance } from 'axios'
import { AuthService } from './AuthService'

export class ApiService {
  private static client: AxiosInstance
  private static readonly API_URL = localStorage.getItem('apiUrl') || 'https://localhost:7001'

  private static initClient(): AxiosInstance {
    if (!this.client) {
      this.client = axios.create({
        baseURL: this.API_URL,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Add request interceptor for auth token
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

      // Add response interceptor for token refresh
      this.client.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config
          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
              const newToken = await AuthService.refreshToken()
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              return this.client(originalRequest)
            } catch {
              return Promise.reject(error)
            }
          }
          return Promise.reject(error)
        },
      )
    }
    return this.client
  }

  static async getData(): Promise<any> {
    const client = this.initClient()
    const response = await client.get('/api/data')
    return response.data
  }

  static async createData(data: any): Promise<any> {
    const client = this.initClient()
    const response = await client.post('/api/data', data)
    return response.data
  }

  static async updateData(id: string, data: any): Promise<any> {
    const client = this.initClient()
    const response = await client.put(`/api/data/${id}`, data)
    return response.data
  }

  static async deleteData(id: string): Promise<void> {
    const client = this.initClient()
    await client.delete(`/api/data/${id}`)
  }
}
