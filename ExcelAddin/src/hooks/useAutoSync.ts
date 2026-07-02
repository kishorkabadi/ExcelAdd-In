import { useCallback, useEffect, useState } from 'react'
import { SyncService } from '../services/SyncService'

interface AutoSyncConfig {
  interval: number // milliseconds
  enabled: boolean
  direction: 'pull' | 'push' | 'bidirectional'
}

export const useAutoSync = (config: AutoSyncConfig) => {
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const performSync = useCallback(async () => {
    if (isSyncing) return

    setIsSyncing(true)
    setError(null)

    try {
      if (config.direction === 'pull') {
        await SyncService.pullData()
      } else if (config.direction === 'push') {
        // Implementation for push
      } else if (config.direction === 'bidirectional') {
        // Implementation for bidirectional
      }
      setLastSync(new Date())
    } catch (err: any) {
      setError(err.message)
      console.error('Auto sync error:', err)
    } finally {
      setIsSyncing(false)
    }
  }, [config.direction, isSyncing])

  useEffect(() => {
    if (!config.enabled) return

    const interval = setInterval(performSync, config.interval)
    return () => clearInterval(interval)
  }, [config.enabled, config.interval, performSync])

  return { lastSync, isSyncing, error, performSync }
}
