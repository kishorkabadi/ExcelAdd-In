import { useCallback, useState } from 'react'
import { SyncService } from '../services/SyncService'
import { ExcelService } from '../services/ExcelService'

interface SyncState {
  isSyncing: boolean
  lastSyncTime: Date | null
  syncProgress: number
  error: string | null
}

export const useDataSync = () => {
  const [state, setState] = useState<SyncState>({
    isSyncing: false,
    lastSyncTime: null,
    syncProgress: 0,
    error: null,
  })

  const pullFromServer = useCallback(async () => {
    setState((prev) => ({ ...prev, isSyncing: true, error: null, syncProgress: 25 }))
    try {
      setState((prev) => ({ ...prev, syncProgress: 50 }))
      const data = await SyncService.pullData()
      setState((prev) => ({ ...prev, syncProgress: 75 }))
      await ExcelService.writeData(data)
      setState((prev) => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
        syncProgress: 100,
      }))
      setTimeout(() => setState((prev) => ({ ...prev, syncProgress: 0 })), 1000)
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isSyncing: false,
        error: error.message || 'Sync failed',
        syncProgress: 0,
      }))
    }
  }, [])

  const pushToServer = useCallback(async () => {
    setState((prev) => ({ ...prev, isSyncing: true, error: null, syncProgress: 25 }))
    try {
      setState((prev) => ({ ...prev, syncProgress: 50 }))
      const data = await ExcelService.readData()
      setState((prev) => ({ ...prev, syncProgress: 75 }))
      await SyncService.pushData(data)
      setState((prev) => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
        syncProgress: 100,
      }))
      setTimeout(() => setState((prev) => ({ ...prev, syncProgress: 0 })), 1000)
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isSyncing: false,
        error: error.message || 'Sync failed',
        syncProgress: 0,
      }))
    }
  }, [])

  const bidirectionalSync = useCallback(async () => {
    setState((prev) => ({ ...prev, isSyncing: true, error: null, syncProgress: 10 }))
    try {
      // Step 1: Get local data
      setState((prev) => ({ ...prev, syncProgress: 25 }))
      const localData = await ExcelService.readData()

      // Step 2: Push local changes
      setState((prev) => ({ ...prev, syncProgress: 50 }))
      await SyncService.pushData(localData)

      // Step 3: Pull server data
      setState((prev) => ({ ...prev, syncProgress: 75 }))
      const serverData = await SyncService.pullData()

      // Step 4: Merge and write
      setState((prev) => ({ ...prev, syncProgress: 90 }))
      await ExcelService.writeData(serverData)

      setState((prev) => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
        syncProgress: 100,
      }))
      setTimeout(() => setState((prev) => ({ ...prev, syncProgress: 0 })), 1000)
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isSyncing: false,
        error: error.message || 'Sync failed',
        syncProgress: 0,
      }))
    }
  }, [])

  return {
    ...state,
    pullFromServer,
    pushToServer,
    bidirectionalSync,
  }
}
