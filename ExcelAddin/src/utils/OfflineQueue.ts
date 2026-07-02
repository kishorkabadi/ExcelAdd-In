import { useState, useCallback } from 'react'

interface QueueItem {
  id: string
  action: 'create' | 'update' | 'delete'
  data: any
  timestamp: Date
  retries: number
  maxRetries: number
}

export class OfflineQueue {
  private static queue: QueueItem[] = []
  private static readonly STORAGE_KEY = 'excel_sync_queue'

  static addToQueue(action: QueueItem['action'], data: any, maxRetries = 3): QueueItem {
    const item: QueueItem = {
      id: `${Date.now()}_${Math.random()}`,
      action,
      data,
      timestamp: new Date(),
      retries: 0,
      maxRetries,
    }

    this.queue.push(item)
    this.persistQueue()
    return item
  }

  static removeFromQueue(id: string): void {
    this.queue = this.queue.filter((item) => item.id !== id)
    this.persistQueue()
  }

  static getQueue(): QueueItem[] {
    return [...this.queue]
  }

  static clearQueue(): void {
    this.queue = []
    this.persistQueue()
  }

  static incrementRetries(id: string): void {
    const item = this.queue.find((q) => q.id === id)
    if (item) {
      item.retries++
      this.persistQueue()
    }
  }

  private static persistQueue(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.queue))
  }

  static loadQueue(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY)
    if (stored) {
      try {
        this.queue = JSON.parse(stored)
      } catch (error) {
        console.error('Failed to load queue from storage', error)
      }
    }
  }
}

export const useOfflineQueue = () => {
  const [queue, setQueue] = useState<QueueItem[]>(OfflineQueue.getQueue())

  const addToQueue = useCallback((action: QueueItem['action'], data: any) => {
    const item = OfflineQueue.addToQueue(action, data)
    setQueue(OfflineQueue.getQueue())
    return item
  }, [])

  const removeFromQueue = useCallback((id: string) => {
    OfflineQueue.removeFromQueue(id)
    setQueue(OfflineQueue.getQueue())
  }, [])

  const clearQueue = useCallback(() => {
    OfflineQueue.clearQueue()
    setQueue([])
  }, [])

  const retryItem = useCallback((id: string) => {
    OfflineQueue.incrementRetries(id)
    setQueue(OfflineQueue.getQueue())
  }, [])

  return {
    queue,
    addToQueue,
    removeFromQueue,
    clearQueue,
    retryItem,
  }
}
