import { create } from 'zustand'

interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setUser: (user: User) => void
  setToken: (token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('authToken'),
  isAuthenticated: !!localStorage.getItem('authToken'),
  setUser: (user: User) => set({ user }),
  setToken: (token: string) => {
    localStorage.setItem('authToken', token)
    set({ token, isAuthenticated: true })
  },
  clearAuth: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('tokenExpiry')
    set({ user: null, token: null, isAuthenticated: false })
  },
}))
