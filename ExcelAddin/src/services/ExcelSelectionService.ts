export class ExcelSelectionService {
  /**
   * Get the current selection
   */
  static async getSelection(): Promise<string> {
    return Excel.run(async (context) => {
      const range = context.application.getActiveCell()
      range.load('address')

      await context.sync()

      return range.address
    })
  }

  /**
   * Select a range
   */
  static async selectRange(range: string): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const targetRange = worksheet.getRange(range)
      targetRange.select()

      await context.sync()
    })
  }

  /**
   * Get selected values
   */
  static async getSelectedValues(): Promise<any[][]> {
    return Excel.run(async (context) => {
      const range = context.application.getActiveCell()
      range.load('values')

      await context.sync()

      return range.values || []
    })
  }

  /**
   * Clear selection
   */
  static async clearSelection(): Promise<void> {
    return Excel.run(async (context) => {
      const range = context.application.getActiveCell()
      range.clear()

      await context.sync()
    })
  }
}
