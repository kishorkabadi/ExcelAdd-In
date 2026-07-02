export interface CellFormat {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  fontSize?: number
  fontColor?: string
  backgroundColor?: string
  horizontalAlignment?: 'left' | 'center' | 'right' | 'justify'
  verticalAlignment?: 'top' | 'center' | 'bottom'
  numberFormat?: string
  borders?: boolean
}

export class ExcelFormattingService {
  /**
   * Format cells in a range
   */
  static async formatCells(range: string, format: CellFormat): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const targetRange = worksheet.getRange(range)

      if (format.bold !== undefined) {
        targetRange.format.font.bold = format.bold
      }
      if (format.italic !== undefined) {
        targetRange.format.font.italic = format.italic
      }
      if (format.underline !== undefined) {
        targetRange.format.font.underline = format.underline ? 'Single' : 'None'
      }
      if (format.fontSize !== undefined) {
        targetRange.format.font.size = format.fontSize
      }
      if (format.fontColor !== undefined) {
        targetRange.format.font.color = format.fontColor
      }
      if (format.backgroundColor !== undefined) {
        targetRange.format.fill.color = format.backgroundColor
      }
      if (format.horizontalAlignment !== undefined) {
        const alignMap = {
          left: Excel.HorizontalAlignment.left,
          center: Excel.HorizontalAlignment.center,
          right: Excel.HorizontalAlignment.right,
          justify: Excel.HorizontalAlignment.justify,
        }
        targetRange.format.horizontalAlignment = alignMap[format.horizontalAlignment]
      }
      if (format.verticalAlignment !== undefined) {
        const alignMap = {
          top: Excel.VerticalAlignment.top,
          center: Excel.VerticalAlignment.center,
          bottom: Excel.VerticalAlignment.bottom,
        }
        targetRange.format.verticalAlignment = alignMap[format.verticalAlignment]
      }
      if (format.numberFormat !== undefined) {
        targetRange.numberFormat = format.numberFormat
      }
      if (format.borders !== undefined && format.borders) {
        targetRange.format.borders.getItem('EdgeBottom').style = 'Continuous'
        targetRange.format.borders.getItem('EdgeLeft').style = 'Continuous'
        targetRange.format.borders.getItem('EdgeRight').style = 'Continuous'
        targetRange.format.borders.getItem('EdgeTop').style = 'Continuous'
      }

      await context.sync()
    })
  }

  /**
   * Set column width
   */
  static async setColumnWidth(column: string, width: number): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const targetColumn = worksheet.getRange(`${column}:${column}`)
      targetColumn.format.columnWidth = width

      await context.sync()
    })
  }

  /**
   * Set row height
   */
  static async setRowHeight(rowNumber: number, height: number): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const targetRow = worksheet.getRange(`${rowNumber}:${rowNumber}`)
      targetRow.format.rowHeight = height

      await context.sync()
    })
  }

  /**
   * Apply conditional formatting
   */
  static async applyConditionalFormatting(
    range: string,
    rule: 'cellValue' | 'aboveAverage' | 'topBottomRank',
    operator: string,
    value: any,
    format: CellFormat,
  ): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const targetRange = worksheet.getRange(range)

      const conditionalFormat = targetRange.conditionalFormats.add(Excel.ConditionalFormatType.cellValue)
      conditionalFormat.cellValue.formula1 = value
      conditionalFormat.cellValue.operator = operator
      conditionalFormat.cellValue.rule = { formula1: value }

      if (format.backgroundColor) {
        conditionalFormat.cellValue.format.fill.color = format.backgroundColor
      }
      if (format.fontColor) {
        conditionalFormat.cellValue.format.font.color = format.fontColor
      }

      await context.sync()
    })
  }

  /**
   * Merge cells
   */
  static async mergeCells(range: string): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const targetRange = worksheet.getRange(range)
      targetRange.merge(false)

      await context.sync()
    })
  }

  /**
   * Unmerge cells
   */
  static async unmergeCells(range: string): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const targetRange = worksheet.getRange(range)
      targetRange.unmerge()

      await context.sync()
    })
  }

  /**
   * Auto-fit columns
   */
  static async autoFitColumns(range: string): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const targetRange = worksheet.getRange(range)
      targetRange.format.autofitColumns()

      await context.sync()
    })
  }

  /**
   * Auto-fit rows
   */
  static async autoFitRows(range: string): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const targetRange = worksheet.getRange(range)
      targetRange.format.autofitRows()

      await context.sync()
    })
  }
}
