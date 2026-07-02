import { useCallback } from 'react'
import { UnifiedExcelService } from '../services/UnifiedExcelService'
import { SyncService } from '../services/SyncService'

export interface DataOrchestrationConfig {
  enableAutoFormat: boolean
  enableValidation: boolean
  enableTransformation: boolean
}

export class DataOrchestrator {
  static async orchestrateSync(
    config: DataOrchestrationConfig,
  ): Promise<void> {
    try {
      // Step 1: Read current data from Excel
      const currentData = await UnifiedExcelService.worksheet.readWorksheet()

      // Step 2: Transform data if enabled
      let processedData = currentData
      if (config.enableTransformation) {
        processedData = this.transformData(currentData)
      }

      // Step 3: Validate data if enabled
      if (config.enableValidation) {
        const validationResult = this.validateData(processedData)
        if (!validationResult.isValid) {
          throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`)
        }
      }

      // Step 4: Push to server
      await SyncService.pushData(processedData)

      // Step 5: Pull latest from server
      const serverData = await SyncService.pullData()

      // Step 6: Format Excel if enabled
      if (config.enableAutoFormat) {
        await this.formatExcelData()
      }

      // Step 7: Write data back to Excel
      await UnifiedExcelService.worksheet.writeToRange('A1', this.dataToRange(serverData))
    } catch (error) {
      console.error('Data orchestration failed:', error)
      throw error
    }
  }

  private static transformData(data: any[][]): any[] {
    // Implement data transformation logic
    return data.flat()
  }

  private static validateData(data: any[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    data.forEach((item, index) => {
      if (!item.name || item.name.trim() === '') {
        errors.push(`Row ${index + 1}: Name is required`)
      }
      if (item.value === undefined || item.value === '') {
        errors.push(`Row ${index + 1}: Value is required`)
      }
    })

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  private static async formatExcelData(): Promise<void> {
    // Apply formatting to Excel
    await UnifiedExcelService.formatting.autoFitColumns('A:Z')
  }

  private static dataToRange(data: any[]): any[][] {
    return [
      ['ID', 'Name', 'Value', 'Created', 'Updated'],
      ...data.map((item) => [
        item.id,
        item.name,
        item.value,
        new Date(item.createdAt).toLocaleDateString(),
        item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : '',
      ]),
    ]
  }
}

export const useDataOrchestration = () => {
  const orchestrate = useCallback(
    async (config: DataOrchestrationConfig) => {
      await DataOrchestrator.orchestrateSync(config)
    },
    [],
  )

  return { orchestrate }
}
