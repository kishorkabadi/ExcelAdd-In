import { ExcelService } from './ExcelWorksheetService'
import { ExcelTableService } from './ExcelTableService'
import { ExcelFormattingService } from './ExcelFormattingService'
import { ExcelChartService } from './ExcelChartService'
import { ExcelNamedRangeService } from './ExcelNamedRangeService'
import { ExcelPrintService } from './ExcelPrintService'
import { ExcelFormulaService } from './ExcelFormulaService'
import { ExcelSelectionService } from './ExcelSelectionService'

/**
 * Unified Excel Service - aggregates all Excel operations
 */
export class UnifiedExcelService {
  static worksheet = ExcelService
  static table = ExcelTableService
  static formatting = ExcelFormattingService
  static chart = ExcelChartService
  static namedRange = ExcelNamedRangeService
  static print = ExcelPrintService
  static formula = ExcelFormulaService
  static selection = ExcelSelectionService
}
