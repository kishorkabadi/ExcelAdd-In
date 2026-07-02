import { useState, useCallback } from 'react'
import { useAuthStore } from '../store/authStore'
import { AuthService } from '../services/AuthService'

export const useAuth = () => {
  const { user, token, isAuthenticated, setUser, setToken, clearAuth } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(
    async (username: string, password: string) => {
      setLoading(true)
      setError(null)
      try {
        const result = await AuthService.login({ username, password })
        setToken(result.accessToken)
        return result
      } catch (err: any) {
        const message = err.message || 'Login failed'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [setToken],
  )

  const logout = useCallback(async () => {
    setLoading(true)
    try {
      await AuthService.logout()
      clearAuth()
    } catch (err: any) {
      const message = err.message || 'Logout failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [clearAuth])

  const refreshToken = useCallback(async () => {
    setLoading(true)
    try {
      const newToken = await AuthService.refreshToken()
      setToken(newToken)
      return newToken
    } catch (err: any) {
      const message = err.message || 'Token refresh failed'
      setError(message)
      clearAuth()
      throw err
    } finally {
      setLoading(false)
    }
  }, [setToken, clearAuth])

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    refreshToken,
  }
}
