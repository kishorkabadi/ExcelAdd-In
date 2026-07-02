import { useEffect } from 'react'

interface NetworkStatus {
  isOnline: boolean
}

export const useNetworkStatus = (): NetworkStatus => {
  const [isOnline, setIsOnline] = useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOnline: typeof window !== 'undefined' ? navigator.onLine : true }
}
