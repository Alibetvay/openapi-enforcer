import {
  IExceptionData,
  IExceptionLevel,
  IExceptionReportConfiguration
} from './IException'
import { Exception } from './Exception'
import {
  ErrorReport,
  ExceptionReportLevel,
  IgnoredReport,
  InfoReport,
  WarningReport
} from './ExceptionReport'
import { getMessage } from '../i18n/i18n'
import { convertPathToBreadcrumbs } from '../Loader/loader-common'

interface ICache {
  report: IExceptionReport | null
}

type IExceptionReport = Record<IExceptionLevel, ExceptionReportLevel>

const defaultHeader = 'One or more <level> exceptions exist:'

export class ExceptionStore {
  public exceptions: Exception[]
  public configuration: Required<IExceptionReportConfiguration>
  private readonly cache: ICache

  constructor (configuration?: IExceptionReportConfiguration) {
    this.configuration = {
      header: configuration?.header ?? defaultHeader,
      overwrite: Object.assign({}, configuration?.overwrite)
    }
    this.exceptions = []
    this.cache = {
      report: null
    }
  }

  add (data: IExceptionData): ExceptionStore {
    const exception = new Exception(data)
    this.exceptions.push(exception)

    // invalidate the report cache because we have a new exception
    this.cache.report = null

    return this
  }

  hasErrorByCode (code: string): boolean {
    return this.error?.exceptions?.find(e => e.code === code) !== undefined
  }

  hasErrorById (id: string): boolean {
    return this.error?.exceptions?.find(e => e.id === id) !== undefined
  }

  hasWarningByCode (code: string): boolean {
    return this.warning?.exceptions?.find(e => e.code === code) !== undefined
  }

  hasWarningById (id: string): boolean {
    return this.warning?.exceptions?.find(e => e.id === id) !== undefined
  }

  hasInfoByCode (code: string): boolean {
    return this.info?.exceptions?.find(e => e.code === code) !== undefined
  }

  hasInfoById (id: string): boolean {
    return this.info?.exceptions?.find(e => e.id === id) !== undefined
  }

  hasIgnoredByCode (code: string): boolean {
    return this.ignored?.exceptions?.find(e => e.code === code) !== undefined
  }

  hasIgnoredById (id: string): boolean {
    return this.ignored?.exceptions?.find(e => e.id === id) !== undefined
  }

  get '0' (): ErrorReport | undefined {
    return this.error
  }

  get error (): ErrorReport | undefined {
    const result = this.createReport().error
    return result.exceptions.length === 0 ? undefined : result
  }

  get '1' (): WarningReport | undefined {
    return this.warning
  }

  get warning (): WarningReport | undefined {
    const result = this.createReport().warn
    return result.exceptions.length === 0 ? undefined : result
  }

  get '2' (): InfoReport | undefined {
    return this.info
  }

  get info (): InfoReport | undefined {
    const result = this.createReport().info
    return result.exceptions.length === 0 ? undefined : result
  }

  get '3' (): IgnoredReport | undefined {
    return this.ignored
  }

  get ignored (): IgnoredReport | undefined {
    const result = this.createReport().ignore
    return result.exceptions.length === 0 ? undefined : result
  }

  get hasError (): boolean {
    return this.error !== undefined
  }

  get hasWarning (): boolean {
    return this.warning !== undefined
  }

  get hasInfo (): boolean {
    return this.info !== undefined
  }

  get hasIgnored (): boolean {
    return this.ignored !== undefined
  }

  get length (): 4 {
    return 4
  }

  [Symbol.iterator] (): Iterator<any> {
    throw Error(getMessage('NOT_IMPLEMENTED'))
  }

  private createReport (): IExceptionReport {
    // check for a cached report first
    if (this.cache.report !== null) {
      return this.cache.report
    }

    const header = this.configuration.header ?? defaultHeader
    const overwrite = this.configuration.overwrite ?? {}

    const reports: IExceptionReport = {
      error: new ExceptionReportLevel(header.replace(/<level>/g, 'error')),
      warn: new ExceptionReportLevel(header.replace(/<level>/g, 'warn')),
      info: new ExceptionReportLevel(header.replace(/<level>/g, 'info')),
      ignore: new ExceptionReportLevel(header.replace(/<level>/g, 'ignore'))
    }

    // organize exceptions into level groups
    const levelGroups: Record<IExceptionLevel, Exception[]> = {
      error: [],
      warn: [],
      info: [],
      ignore: []
    }
    this.exceptions.forEach(exception => {
      const id = exception.id
      const level: IExceptionLevel = exception.levelOverwritten
        ? exception.level
        : overwrite[id] ?? exception.level
      levelGroups[level].push(exception)

      // TODO: I'm not sure what I was doing here. Rewritten above. Delete below once tested
      // if (exception.locations.length > 0) {
      //   const usedLevels = new Set<IExceptionLevel>()
      //   exception.locations.forEach(location => {
      //     const level: IExceptionLevel = exception.levelOverwritten
      //       ? exception.level
      //       : overwrite[id] ?? exception.level
      //     usedLevels.add(level)
      //   })
      //   Array.from(usedLevels).forEach(level => {
      //     levelGroups[level].push(exception)
      //   })
      // } else {
      //   levelGroups[exception.level].push(exception)
      // }
    })

    // generate report groups
    ;(['error', 'warn', 'info', 'ignore'] as IExceptionLevel[]).forEach(level => {
      levelGroups[level].forEach(exception => {
        const report = reports[level]
        const reportItems = report.reportItems
        report.exceptions.push(exception)

        // generate and sort path and location data
        const pathObjects: Array<{
          source: string
          line?: number
          column?: number
          path: string
        }> = exception.locations
          .map(loc => {
            return {
              source: loc.root.source,
              path: loc.path,
              line: loc.start?.line,
              column: loc.start?.column
            }
          })
        pathObjects.sort((p1, p2) => {
          if (p1.source < p2.source) return -1
          if (p1.source > p2.source) return 1
          if (p1.line !== undefined && p2.line !== undefined) {
            if (p1.line < p2.line) return -1
            if (p1.line > p2.line) return 1
          }
          if (p1.column !== undefined && p2.column !== undefined) {
            if (p1.column < p2.column) return -1
            if (p1.column > p2.column) return 1
          }
          return p1.path < p2.path ? -1 : 1
        })

        // create locations strings (breadcrumbs + source)
        const paths: string[] = pathObjects
          .map(pathObject => {
            let source = pathObject.source
            if (pathObject.line !== undefined) {
              if (source.length > 0) source += ' '
              source += `${pathObject.line}:${pathObject.column as number}`
            }
            return pathObject.path + (source.length > 0 ? ' (' + source + ')' : '')
          })

        // find and add to a group or create a group if not found
        const found = reportItems.find(r => {
          const length = r.paths.length
          if (length !== paths.length) return false
          for (let i = 0; i < length; i++) {
            if (r.paths[i] !== paths[i]) return false
          }
          return true
        })
        if (found === undefined) {
          reportItems.push({
            paths,
            breadcrumbs: paths.map(convertPathToBreadcrumbs),
            exceptions: [exception]
          })
        } else if (found.exceptions.find(e => e === exception) === undefined) {
          found.exceptions.push(exception)
        }
      })
    })

    this.cache.report = reports
    return reports
  }
}

ExceptionStore.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
