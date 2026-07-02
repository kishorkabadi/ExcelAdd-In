import React, { useEffect, useState } from 'react'
import { Stack, MessageBar, MessageBarType, ProgressIndicator } from '@fluentui/react'
import { useDataSync } from '../hooks/useDataSync'

interface DataSyncProviderProps {
  children: React.ReactNode
  autoSync?: boolean
  syncInterval?: number
}

const DataSyncProvider: React.FC<DataSyncProviderProps> = ({
  children,
  autoSync = true,
  syncInterval = 5 * 60 * 1000, // 5 minutes
}) => {
  const { isSyncing, lastSyncTime, error, syncProgress, bidirectionalSync } = useDataSync()
  const [showSyncStatus, setShowSyncStatus] = useState(false)

  useEffect(() => {
    if (!autoSync) return

    const interval = setInterval(() => {
      bidirectionalSync()
    }, syncInterval)

    return () => clearInterval(interval)
  }, [autoSync, syncInterval, bidirectionalSync])

  return (
    <Stack>
      {isSyncing && (
        <Stack
          styles={{
            root: {
              padding: '12px',
              backgroundColor: '#e7f3ff',
              borderBottom: '1px solid #d0e8ff',
            },
          }}
          tokens={{ childrenGap: 8 }}
        >
          <ProgressIndicator percentComplete={syncProgress / 100} label="Syncing data..." />
        </Stack>
      )}

      {error && (
        <MessageBar messageBarType={MessageBarType.error} onDismiss={() => setShowSyncStatus(false)}>
          Sync failed: {error}
        </MessageBar>
      )}

      {lastSyncTime && !isSyncing && (
        <Stack
          styles={{
            root: {
              padding: '8px 12px',
              backgroundColor: '#e8f5e9',
              fontSize: '12px',
              color: '#2e7d32',
            },
          }}
        >
          Last sync: {lastSyncTime.toLocaleTimeString()}
        </Stack>
      )}

      {children}
    </Stack>
  )
}

export default DataSyncProvider
