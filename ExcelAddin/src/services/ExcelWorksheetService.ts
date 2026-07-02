export class ExcelService {
  /**
   * Read all data from the active worksheet
   */
  static async readWorksheet(): Promise<any[]> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const usedRange = worksheet.getUsedRange(true)
      usedRange.load('values,address')

      await context.sync()

      return usedRange.values || []
    })
  }

  /**
   * Write data to a specific range
   */
  static async writeToRange(range: string, data: any[][]): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const targetRange = worksheet.getRange(range)
      targetRange.values = data

      await context.sync()
    })
  }

  /**
   * Read data from a specific range
   */
  static async readRange(range: string): Promise<any[][]> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const targetRange = worksheet.getRange(range)
      targetRange.load('values')

      await context.sync()

      return targetRange.values || []
    })
  }

  /**
   * Clear a range
   */
  static async clearRange(range: string): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const targetRange = worksheet.getRange(range)
      targetRange.clear()

      await context.sync()
    })
  }

  /**
   * Append data to the end of the worksheet
   */
  static async appendData(data: any[][]): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const usedRange = worksheet.getUsedRange(true)
      usedRange.load('rowCount')

      await context.sync()

      const startRow = usedRange.rowCount + 1
      const endRow = startRow + data.length - 1
      const endCol = data[0]?.length || 1
      const range = worksheet.getRange(`A${startRow}:${String.fromCharCode(64 + endCol)}${endRow}`)
      range.values = data

      await context.sync()
    })
  }

  /**
   * Insert a row at a specific index
   */
  static async insertRow(rowIndex: number, data: any[]): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const range = worksheet.getRange(`${rowIndex}:${rowIndex}`)
      range.insert(Excel.InsertShiftDirection.down)

      const dataRange = worksheet.getRange(`A${rowIndex}:${String.fromCharCode(64 + data.length)}${rowIndex}`)
      dataRange.values = [data]

      await context.sync()
    })
  }

  /**
   * Delete a row
   */
  static async deleteRow(rowIndex: number): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const range = worksheet.getRange(`${rowIndex}:${rowIndex}`)
      range.delete(Excel.DeleteShiftDirection.up)

      await context.sync()
    })
  }

  /**
   * Get all worksheet names
   */
  static async getWorksheetNames(): Promise<string[]> {
    return Excel.run(async (context) => {
      const worksheets = context.application.worksheets
      worksheets.load('items/name')

      await context.sync()

      return worksheets.items.map((ws) => ws.name)
    })
  }

  /**
   * Create a new worksheet
   */
  static async createWorksheet(name: string): Promise<string> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.add(name)
      worksheet.activate()

      await context.sync()

      return worksheet.name
    })
  }

  /**
   * Delete a worksheet
   */
  static async deleteWorksheet(name: string): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getItem(name)
      worksheet.delete()

      await context.sync()
    })
  }

  /**
   * Get the active worksheet name
   */
  static async getActiveWorksheetName(): Promise<string> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      worksheet.load('name')

      await context.sync()

      return worksheet.name
    })
  }
}
