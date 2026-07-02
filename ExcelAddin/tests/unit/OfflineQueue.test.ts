import { describe, it, expect, beforeEach } from 'vitest'
import { OfflineQueue } from '../utils/OfflineQueue'

describe('OfflineQueue', () => {
  beforeEach(() => {
    OfflineQueue.clearQueue()
  })

  describe('addToQueue', () => {
    it('should add item to queue', () => {
      const item = OfflineQueue.addToQueue('create', { name: 'Test' })
      expect(item).toBeDefined()
      expect(item.action).toBe('create')
      expect(item.data).toEqual({ name: 'Test' })
    })
  })

  describe('getQueue', () => {
    it('should return all queued items', () => {
      OfflineQueue.addToQueue('create', { name: 'Item1' })
      OfflineQueue.addToQueue('update', { name: 'Item2' })
      const queue = OfflineQueue.getQueue()
      expect(queue.length).toBe(2)
    })
  })

  describe('removeFromQueue', () => {
    it('should remove item from queue', () => {
      const item = OfflineQueue.addToQueue('create', { name: 'Test' })
      OfflineQueue.removeFromQueue(item.id)
      const queue = OfflineQueue.getQueue()
      expect(queue.length).toBe(0)
    })
  })

  describe('clearQueue', () => {
    it('should clear all items', () => {
      OfflineQueue.addToQueue('create', { name: 'Item1' })
      OfflineQueue.addToQueue('delete', { name: 'Item2' })
      OfflineQueue.clearQueue()
      const queue = OfflineQueue.getQueue()
      expect(queue).toEqual([])
    })
  })
})
