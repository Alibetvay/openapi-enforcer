import rx from './rx'

export function copy<T> (value: T, map: Map<any, any> = new Map()): T {
  if (value instanceof Date) {
    return new Date(+value) as unknown as T
  } else if (value instanceof Buffer) {
    return value.slice(0) as unknown as T
  } else if (Array.isArray(value)) {
    let result = map.get(value)
    if (result !== undefined) return result
    result = []
    map.set(value, result)
    value.forEach(v => result.push(copy(v, map)))
    return result
  } else if (value !== null && typeof value === 'object') {
    let result = map.get(value)
    if (result !== undefined) return result
    result = {}
    map.set(value, result)
    Object.keys(value).forEach(key => {
      result[key] = copy((value as any)[key], map)
    })
    return result
  } else {
    return value
  }
}

/**
 * If a function has been deprecated, use this function to provide a console message once every 10 minutes when
 * called.
 * @param oldName The name of the old function.
 * @param newName The name of the new function
 * @param fn The deprecated function
 */
export function deprecated<F extends Function> (oldName: string, newName: string, fn: F): F {
  let lastRun = 0
  return function (...args: any[]) {
    const now = Date.now()
    if (lastRun < now - 600000) {
      console.warn('The function ' + oldName + ' has been deprecated. Please start using ' + newName)
      lastRun = now
    }
    return fn(...args)
  } as unknown as F
}

export function getDateFromValidDateString (format: 'date' | 'date-time', string: string): Date | null {
  const date = new Date(string)
  if (isNaN(date.getTime())) return null

  const isoDate = date.toISOString()
  const match = format === 'date'
    ? rx.date.exec(isoDate.substring(0, 10))
    : rx['date-time'].exec(isoDate)
  if (match === null) return null

  // if the day of the month doesn't match then someone put too many days on the date string. Ex: 2000-02-31 - February never has 31 days.
  const day = +match[3]
  return date.getUTCDate() === day ? date : null
}

/**
 * Takes a value and converts it to a string, optionally adding quotation marks around string values.
 * @param value The value to convert to a string.
 * @param options
 * @param [options.addQuotationMarksToStrings] Set to true to wrap string values in quotation marks.
 * @param [options.wrapArray] Set to true to put square brackets around arrays.
 */
export function smart (value: any, options?: { addQuotationMarksToStrings?: boolean, wrapArray?: boolean }): string {
  const addQuotationMarksToStrings = options?.addQuotationMarksToStrings ?? true
  const wrapArray = options?.wrapArray ?? false

  if (typeof value === 'string') {
    return addQuotationMarksToStrings
      ? '"' + value.replace(/"/g, '\\"') + '"'
      : value
  } else if (value instanceof Date) {
    return isNaN(+value) ? 'invalid date object' : value.toISOString()
  } else if (Array.isArray(value)) {
    const result = value.map(v => smart(v, options)).join(', ')
    return wrapArray ? '[' + result + ']' : result
  } else {
    return String(value)
  }
}
