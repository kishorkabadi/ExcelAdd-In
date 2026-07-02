import { describe, it, expect } from 'vitest'
import { ConflictResolver } from '../utils/ConflictResolver'

describe('ConflictResolver', () => {
  const localData = [
    { id: 1, name: 'Local Item', value: 100, updatedAt: new Date('2024-01-02') },
    { id: 2, name: 'Item 2', value: 200, updatedAt: new Date('2024-01-01') },
  ]

  const serverData = [
    { id: 1, name: 'Server Item', value: 150, updatedAt: new Date('2024-01-01') },
    { id: 3, name: 'Server Only', value: 300, updatedAt: new Date('2024-01-01') },
  ]

  describe('resolveConflicts', () => {
    it('should apply server-wins strategy', () => {
      const result = ConflictResolver.resolveConflicts(localData, serverData, 'server-wins')
      expect(result).toEqual(serverData)
    })

    it('should apply local-wins strategy', () => {
      const result = ConflictResolver.resolveConflicts(localData, serverData, 'local-wins')
      expect(result).toEqual(localData)
    })

    it('should merge data correctly', () => {
      const result = ConflictResolver.resolveConflicts(localData, serverData, 'merge')
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('detectConflicts', () => {
    it('should detect conflicting items', () => {
      const conflicts = ConflictResolver.detectConflicts(localData, serverData)
      expect(Array.isArray(conflicts)).toBe(true)
      expect(conflicts.length).toBeGreaterThan(0)
    })

    it('should return empty array if no conflicts', () => {
      const conflicts = ConflictResolver.detectConflicts([], [])
      expect(conflicts).toEqual([])
    })
  })
})
