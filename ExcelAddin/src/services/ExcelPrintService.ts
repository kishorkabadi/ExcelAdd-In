export class ExcelPrintService {
  /**
   * Print the current worksheet
   */
  static async printWorksheet(): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      worksheet.activate()

      await context.sync()

      // Note: Print is handled by Excel UI, not API
      // This is a placeholder for future implementation
    })
  }

  /**
   * Get page layout settings
   */
  static async getPageSettings(): Promise<any> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const pageLayout = worksheet.pageLayout
      pageLayout.load('leftMargin,rightMargin,topMargin,bottomMargin,orientation,paperSize')

      await context.sync()

      return {
        leftMargin: pageLayout.leftMargin,
        rightMargin: pageLayout.rightMargin,
        topMargin: pageLayout.topMargin,
        bottomMargin: pageLayout.bottomMargin,
        orientation: pageLayout.orientation,
        paperSize: pageLayout.paperSize,
      }
    })
  }

  /**
   * Set page margins
   */
  static async setPageMargins(top: number, bottom: number, left: number, right: number): Promise<void> {
    return Excel.run(async (context) => {
      const worksheet = context.application.worksheets.getActiveWorksheet()
      const pageLayout = worksheet.pageLayout
      pageLayout.topMargin = top
      pageLayout.bottomMargin = bottom
      pageLayout.leftMargin = left
      pageLayout.rightMargin = right

      await context.sync()
    })
  }
}
