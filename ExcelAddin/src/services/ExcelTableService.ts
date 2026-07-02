export class ExcelTableService {
  /**
   * Create a table from data
   */
  static async createTable(range: string, data: any[][], tableName: string, hasHeaders = true): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const targetRange = worksheet.getRange(range)
      targetRange.values = data

      const table = worksheet.tables.add(targetRange, hasHeaders)
      table.name = tableName

      await context.sync()
    })
  }

  /**
   * Get all table names in the worksheet
   */
  static async getTableNames(): Promise<string[]> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const tables = worksheet.tables
      tables.load('items/name')

      await context.sync()

      return tables.items.map((t) => t.name)
    })
  }

  /**
   * Read data from a table
   */
  static async readTable(tableName: string): Promise<any[][]> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const table = worksheet.tables.getItem(tableName)
      const range = table.getDataBodyRange()
      range.load('values')

      await context.sync()

      return range.values || []
    })
  }

  /**
   * Add rows to a table
   */
  static async addTableRows(tableName: string, data: any[][]): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const table = worksheet.tables.getItem(tableName)
      table.rows.add(undefined, data)

      await context.sync()
    })
  }

  /**
   * Clear table data (keeps headers)
   */
  static async clearTableData(tableName: string): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const table = worksheet.tables.getItem(tableName)
      const dataRange = table.getDataBodyRange()
      dataRange.clear()

      await context.sync()
    })
  }

  /**
   * Delete a table
   */
  static async deleteTable(tableName: string): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const table = worksheet.tables.getItem(tableName)
      table.delete()

      await context.sync()
    })
  }

  /**
   * Get table headers
   */
  static async getTableHeaders(tableName: string): Promise<string[]> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const table = worksheet.tables.getItem(tableName)
      const headerRange = table.getHeaderRowRange()
      headerRange.load('values')

      await context.sync()

      return (headerRange.values?.[0] || []) as string[]
    })
  }

  /**
   * Apply table style
   */
  static async applyTableStyle(tableName: string, styleName: string): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const table = worksheet.tables.getItem(tableName)
      table.tableStyle = styleName

      await context.sync()
    })
  }
}
