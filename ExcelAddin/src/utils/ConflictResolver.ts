import { useEffect, useCallback } from 'react'
import { useUIStore } from '../store/uiStore'

interface ConflictResolution {
  strategy: 'server-wins' | 'local-wins' | 'merge' | 'prompt'
}

export class ConflictResolver {
  static resolveConflicts(
    localData: any[],
    serverData: any[],
    strategy: ConflictResolution['strategy'],
  ): any[] {
    switch (strategy) {
      case 'server-wins':
        return serverData

      case 'local-wins':
        return localData

      case 'merge':
        return this.mergeData(localData, serverData)

      case 'prompt':
        // This would typically open a dialog for user input
        return serverData // Default to server-wins if not handled

      default:
        return serverData
    }
  }

  private static mergeData(local: any[], server: any[]): any[] {
    const merged = new Map()

    // Add server data first
    server.forEach((item) => {
      merged.set(item.id, { ...item, source: 'server' })
    })

    // Merge local data
    local.forEach((item) => {
      const existing = merged.get(item.id)
      if (existing) {
        // Keep the most recently updated
        if (new Date(item.updatedAt) > new Date(existing.updatedAt)) {
          merged.set(item.id, { ...item, source: 'local' })
        }
      } else {
        merged.set(item.id, { ...item, source: 'local' })
      }
    })

    return Array.from(merged.values())
  }

  static detectConflicts(localData: any[], serverData: any[]): any[] {
    const conflicts: any[] = []
    const serverMap = new Map(serverData.map((item) => [item.id, item]))

    localData.forEach((localItem) => {
      const serverItem = serverMap.get(localItem.id)
      if (serverItem) {
        if (
          JSON.stringify(localItem) !== JSON.stringify(serverItem) &&
          new Date(localItem.updatedAt) !== new Date(serverItem.updatedAt)
        ) {
          conflicts.push({
            id: localItem.id,
            local: localItem,
            server: serverItem,
          })
        }
      }
    })

    return conflicts
  }
}

export const useConflictResolution = () => {
  const { setNotification } = useUIStore()

  const handleConflict = useCallback(
    (conflicts: any[], strategy: ConflictResolution['strategy']) => {
      if (conflicts.length === 0) return []

      const resolved = ConflictResolver.resolveConflicts(
        conflicts.map((c) => c.local),
        conflicts.map((c) => c.server),
        strategy,
      )

      setNotification({
        type: 'warning',
        message: `Resolved ${conflicts.length} conflict(s)`,
      })

      return resolved
    },
    [setNotification],
  )

  return { handleConflict }
}
