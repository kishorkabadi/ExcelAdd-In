import { describe, it, expect, beforeEach } from 'vitest'
import { ExcelService } from '../services/ExcelWorksheetService'
import { SyncService } from '../services/SyncService'

describe('ExcelService', () => {
  beforeEach(() => {
    // Setup
  })

  describe('readWorksheet', () => {
    it('should read all data from active worksheet', async () => {
      const data = await ExcelService.readWorksheet()
      expect(Array.isArray(data)).toBe(true)
    })
  })

  describe('writeToRange', () => {
    it('should write data to specific range', async () => {
      const testData = [['Name', 'Value'], ['Item1', 100]]
      await ExcelService.writeToRange('A1:B2', testData)
      const result = await ExcelService.readRange('A1:B2')
      expect(result).toEqual(testData)
    })
  })

  describe('clearRange', () => {
    it('should clear a range', async () => {
      await ExcelService.writeToRange('A1:B2', [['test']])
      await ExcelService.clearRange('A1:B2')
      const result = await ExcelService.readRange('A1:B2')
      expect(result.every((row) => row.every((cell) => !cell))).toBe(true)
    })
  })

  describe('appendData', () => {
    it('should append data to end of worksheet', async () => {
      const newData = [['New Item', 200]]
      await ExcelService.appendData(newData)
      // Verify data was appended
    })
  })

  describe('getWorksheetNames', () => {
    it('should return list of worksheet names', async () => {
      const names = await ExcelService.getWorksheetNames()
      expect(Array.isArray(names)).toBe(true)
      expect(names.length).toBeGreaterThan(0)
    })
  })

  describe('createWorksheet', () => {
    it('should create a new worksheet', async () => {
      const name = await ExcelService.createWorksheet('TestSheet')
      expect(name).toBe('TestSheet')
    })
  })
})
