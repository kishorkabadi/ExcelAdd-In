import { create } from 'zustand'

interface UIState {
  isLoading: boolean
  notification: {
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
  } | null
  setLoading: (loading: boolean) => void
  setNotification: (notification: UIState['notification']) => void
  clearNotification: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  notification: null,
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setNotification: (notification) => set({ notification }),
  clearNotification: () => set({ notification: null }),
}))
