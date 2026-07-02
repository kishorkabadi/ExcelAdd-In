import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SyncService } from '../services/SyncService'
import axios from 'axios'

vi.mock('axios')

describe('SyncService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initClient', () => {
    it('should initialize axios client', () => {
      const client = SyncService['initClient']()
      expect(client).toBeDefined()
    })
  })

  describe('pullData', () => {
    it('should fetch data from server', async () => {
      const mockData = [{ id: 1, name: 'Test', value: 100 }]
      vi.mocked(axios.get).mockResolvedValueOnce({ data: { data: mockData } })

      const result = await SyncService.pullData()
      expect(result).toEqual(mockData)
    })

    it('should handle errors', async () => {
      vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network error'))

      await expect(SyncService.pullData()).rejects.toThrow()
    })
  })

  describe('pushData', () => {
    it('should send data to server', async () => {
      const testData = [{ id: 1, name: 'Test', value: 100 }]
      vi.mocked(axios.post).mockResolvedValueOnce({ data: { success: true } })

      await expect(SyncService.pushData(testData)).resolves.not.toThrow()
    })
  })

  describe('uploadExcelFile', () => {
    it('should upload Excel file', async () => {
      const file = new File(['test'], 'test.xlsx', { type: 'application/vnd.ms-excel' })
      vi.mocked(axios.post).mockResolvedValueOnce({ data: { success: true } })

      await expect(SyncService.uploadExcelFile(file)).resolves.not.toThrow()
    })
  })
})
