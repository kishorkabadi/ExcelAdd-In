export class ExcelFormulaService {
  /**
   * Add a formula to a cell
   */
  static async setFormula(cell: string, formula: string): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const targetCell = worksheet.getRange(cell)
      targetCell.formulas = [[formula]]

      await context.sync()
    })
  }

  /**
   * Get formula from a cell
   */
  static async getFormula(cell: string): Promise<string> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const targetCell = worksheet.getRange(cell)
      targetCell.load('formulas')

      await context.sync()

      return targetCell.formulas[0]?.[0] || ''
    })
  }

  /**
   * Add formulas to a range
   */
  static async setFormulas(range: string, formulas: string[][]): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const targetRange = worksheet.getRange(range)
      targetRange.formulas = formulas

      await context.sync()
    })
  }

  /**
   * Calculate all formulas
   */
  static async recalculate(): Promise<void> {
    return Excel.run(async (context) => {
      context.application.calculate()
      await context.sync()
    })
  }

  /**
   * Evaluate a formula
   */
  static async evaluateFormula(formula: string): Promise<any> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const tempCell = worksheet.getRange('Z9999')
      tempCell.formulas = [[formula]]
      tempCell.load('values')

      await context.sync()

      const result = tempCell.values[0]?.[0]
      tempCell.clear()
      await context.sync()

      return result
    })
  }
}
