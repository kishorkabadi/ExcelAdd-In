export class ExcelService {
  static async writeData(data: any[]): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const range = worksheet.getRange('A1:B' + (data.length + 1))

      // Create headers
      const headers = [['Name', 'Value']]

      // Add data rows
      const rows = data.map((item) => [item.name, item.value])

      // Write to range
      const values = [...headers, ...rows]
      range.values = values

      // Format header row
      const headerRange = worksheet.getRange('A1:B1')
      headerRange.format.font.bold = true
      headerRange.format.fill.color = '#4472C4'
      headerRange.format.font.color = '#FFFFFF'

      await context.sync()
    })
  }

  static async readData(): Promise<any[]> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const usedRange = worksheet.getUsedRange(true)
      usedRange.load('values')

      await context.sync()

      const values = usedRange.values
      const data: any[] = []

      // Skip header row
      for (let i = 1; i < values.length; i++) {
        data.push({
          name: values[i][0],
          value: values[i][1],
        })
      }

      return data
    })
  }

  static async createTable(data: any[], tableName: string): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const range = worksheet.getRange('A1:B' + (data.length + 1))

      // Create headers
      const headers = [['Name', 'Value']]
      const rows = data.map((item) => [item.name, item.value])
      const values = [...headers, ...rows]

      range.values = values

      // Create table
      const table = worksheet.tables.add(range, true)
      table.name = tableName

      await context.sync()
    })
  }

  static async formatCells(range: string, format: any): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const targetRange = worksheet.getRange(range)

      if (format.bold !== undefined) targetRange.format.font.bold = format.bold
      if (format.italic !== undefined) targetRange.format.font.italic = format.italic
      if (format.color !== undefined) targetRange.format.font.color = format.color
      if (format.fillColor !== undefined) targetRange.format.fill.color = format.fillColor

      await context.sync()
    })
  }
}
