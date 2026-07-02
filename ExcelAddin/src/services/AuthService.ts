import axios from 'axios'

interface AuthToken {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

interface LoginRequest {
  username: string
  password: string
}

interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export class AuthService {
  private static readonly API_URL = localStorage.getItem('apiUrl') || 'https://localhost:7001'

  static async login(credentials: LoginRequest): Promise<AuthToken> {
    try {
      const response = await axios.post<LoginResponse>(`${this.API_URL}/api/auth/login`, credentials)
      const { accessToken, refreshToken, expiresIn } = response.data

      localStorage.setItem('authToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('tokenExpiry', (Date.now() + expiresIn * 1000).toString())

      return { accessToken, refreshToken, expiresIn }
    } catch (error) {
      throw new Error('Login failed')
    }
  }

  static async logout(): Promise<void> {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('tokenExpiry')
  }

  static async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await axios.post<{ accessToken: string; expiresIn: number }>(
        `${this.API_URL}/api/auth/refresh`,
        { refreshToken },
      )
      const { accessToken, expiresIn } = response.data

      localStorage.setItem('authToken', accessToken)
      localStorage.setItem('tokenExpiry', (Date.now() + expiresIn * 1000).toString())

      return accessToken
    } catch (error) {
      throw new Error('Token refresh failed')
    }
  }

  static isTokenExpired(token: string): boolean {
    try {
      const expiry = localStorage.getItem('tokenExpiry')
      return !expiry || Date.now() > parseInt(expiry, 10)
    } catch {
      return true
    }
  }

  static getToken(): string | null {
    const token = localStorage.getItem('authToken')
    if (token && this.isTokenExpired(token)) {
      return null
    }
    return token
  }
}
