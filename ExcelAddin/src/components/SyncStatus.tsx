import React from 'react'
import { Stack, PrimaryButton, DefaultButton, MessageBar, MessageBarType } from '@fluentui/react'
import { useDataSync } from '../hooks/useDataSync'
import { useOfflineQueue } from '../utils/OfflineQueue'

const SyncStatus: React.FC = () => {
  const { isSyncing, lastSyncTime, error, syncProgress, pullFromServer, pushToServer, bidirectionalSync } =
    useDataSync()
  const { queue, clearQueue } = useOfflineQueue()

  return (
    <Stack tokens={{ childrenGap: 16 }}>
      {error && <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>}

      {queue.length > 0 && (
        <MessageBar messageBarType={MessageBarType.warning}>
          {queue.length} item(s) pending sync. Click "Sync All" to synchronize.
          <DefaultButton
            text="Clear Queue"
            onClick={clearQueue}
            styles={{ root: { marginLeft: 8 } }}
          />
        </MessageBar>
      )}

      {lastSyncTime && (
        <Stack
          styles={{
            root: {
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
            },
          }}
          tokens={{ childrenGap: 8 }}
        >
          <div>Last sync: {lastSyncTime.toLocaleString()}</div>
        </Stack>
      )}

      <Stack horizontal tokens={{ childrenGap: 8 }}>
        <PrimaryButton
          text="Pull from Server"
          onClick={pullFromServer}
          disabled={isSyncing}
        />
        <PrimaryButton
          text="Push to Server"
          onClick={pushToServer}
          disabled={isSyncing}
        />
        <PrimaryButton
          text="Sync All"
          onClick={bidirectionalSync}
          disabled={isSyncing}
        />
      </Stack>
    </Stack>
  )
}

export default SyncStatus
