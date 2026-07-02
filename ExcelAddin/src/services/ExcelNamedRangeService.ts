export class ExcelNamedRangeService {
  /**
   * Create a named range
   */
  static async createNamedRange(name: string, range: string, comment?: string): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const targetRange = worksheet.getRange(range)
      const namedRange = context.application.names.add(name, targetRange)
      if (comment) {
        namedRange.comment = comment
      }

      await context.sync()
    })
  }

  /**
   * Get all named ranges
   */
  static async getNamedRanges(): Promise<Array<{ name: string; range: string; comment: string }>> {
    return Excel.run(async (context) => {
      const namedRanges = context.application.names
      namedRanges.load('items/name,items/address,items/comment')

      await context.sync()

      return namedRanges.items.map((nr) => ({
        name: nr.name,
        range: nr.address,
        comment: nr.comment,
      }))
    })
  }

  /**
   * Get a specific named range
   */
  static async getNamedRange(name: string): Promise<string> {
    return Excel.run(async (context) => {
      const namedRange = context.application.names.getItem(name)
      namedRange.load('address')

      await context.sync()

      return namedRange.address
    })
  }

  /**
   * Delete a named range
   */
  static async deleteNamedRange(name: string): Promise<void> {
    return Excel.run(async (context) => {
      const namedRange = context.application.names.getItem(name)
      namedRange.delete()

      await context.sync()
    })
  }

  /**
   * Read data from a named range
   */
  static async readNamedRange(name: string): Promise<any[][]> {
    return Excel.run(async (context) => {
      const namedRange = context.application.names.getItem(name)
      const range = namedRange.getRange()
      range.load('values')

      await context.sync()

      return range.values || []
    })
  }
}
