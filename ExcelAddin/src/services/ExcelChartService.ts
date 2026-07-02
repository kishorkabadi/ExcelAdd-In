export interface ChartConfig {
  type: 'ColumnClustered' | 'LineStacked' | 'PieExploded' | 'BarStacked' | 'AreaStacked'
  title: string
  legend?: boolean
  hasLegend?: boolean
}

export class ExcelChartService {
  /**
   * Create a chart
   */
  static async createChart(
    dataRange: string,
    config: ChartConfig,
    chartName: string,
  ): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const sourceData = worksheet.getRange(dataRange)

      const chart = worksheet.charts.add(Excel.ChartType[config.type], sourceData)
      chart.setPosition('G2', 'L10')
      chart.title.text = config.title
      chart.name = chartName

      if (config.hasLegend !== undefined) {
        chart.legend.include = config.hasLegend
      }

      await context.sync()
    })
  }

  /**
   * Delete a chart
   */
  static async deleteChart(chartName: string): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const chart = worksheet.charts.getItem(chartName)
      chart.delete()

      await context.sync()
    })
  }

  /**
   * Get all chart names
   */
  static async getChartNames(): Promise<string[]> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const charts = worksheet.charts
      charts.load('items/name')

      await context.sync()

      return charts.items.map((c) => c.name)
    })
  }

  /**
   * Update chart title
   */
  static async updateChartTitle(chartName: string, newTitle: string): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const chart = worksheet.charts.getItem(chartName)
      chart.title.text = newTitle

      await context.sync()
    })
  }

  /**
   * Update chart data range
   */
  static async updateChartData(chartName: string, newDataRange: string): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const chart = worksheet.charts.getItem(chartName)
      const sourceData = worksheet.getRange(newDataRange)
      chart.setData(sourceData)

      await context.sync()
    })
  }
}
