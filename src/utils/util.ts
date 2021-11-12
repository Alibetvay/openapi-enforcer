import rx from './rx'
import { ExceptionMessageData, Level } from '../DefinitionException/types'
import { Location } from 'json-to-ast'
import { SpecMap, Version } from '../components'

export interface EnforcerDirective {
  exceptionCodeLevels: Record<string, Level>
}

interface BooleanMap {
  [key: string]: boolean
}

interface ObjectMap {
  [k: string]: any
}

export interface Semver {
  string: string
  major: number
  minor: number
  patch: number
  hasPatch: boolean
}

interface ToPlainObjectOptions {
  allowInheritedProperties?: boolean
  preserve?: Function[] | Set<Function>
}

interface ToPlainObjectResult {
  set: boolean
  value?: any
}

export function addExceptionLocation (message: ExceptionMessageData, ...locations: Array<Location|undefined>): void {
  const filtered: Location[] = locations.filter(l => l !== undefined) as Location[]
  if (filtered.length > 0) {
    if (!Array.isArray(message.locations)) message.locations = []
    message.locations.push(...filtered)
  }
}

export function booleanMapToStringArray (map: BooleanMap): string[] {
  const array: string[] = []
  Object.keys(map).forEach(key => {
    if (map[key]) array.push(key)
  })
  return array
}

export function copy<T> (value: T, map = new Map()): T {
  if (value instanceof Date) {
    // @ts-expect-error
    return new Date(value)
  } else if (value instanceof Buffer) {
    // @ts-expect-error
    return value.slice(0)
  } else if (Array.isArray(value)) {
    let result = map.get(value)
    if (result !== undefined) return result
    result = []
    map.set(value, result)
    value.forEach(v => result.push(copy(v, map)))
    return result
  } else if (isObject(value)) {
    let result = map.get(value)
    if (result !== undefined) return result
    result = {}
    map.set(value, result)
    Object.keys(value).forEach(key => {
      // @ts-expect-error
      result[key] = copy(value[key], map)
    })
    return result
  } else {
    return value
  }
}

export function edgeSlashes (value: string, start: boolean, end: boolean): string {
  value = value.replace(/^\//, '').replace(/\/$/, '')
  if (value.length === 0 && (start || end)) return '/'
  if (start) value = '/' + value
  if (end) value += '/'
  return value
}

export function getLatestSpecVersion (specMap: SpecMap, major?: number): Version | undefined {
  let versions: Semver[] = Object.keys(specMap).map(semver)
  if (major !== undefined) versions = versions.filter(v => v.major === major)
  versions.sort((a, b) => {
    if (a.major === b.major) {
      if (a.minor === b.minor) {
        return a.patch < b.patch ? -1 : 1
      } else if (a.minor < b.minor) {
        return -1
      } else {
        return 1
      }
    } else if (a.major < b.major) {
      return -1
    } else {
      return 1
    }
  })
  const latest = versions.pop()
  return latest === undefined
    ? undefined
    : latest.string as Version
}

function isDate (value: any): boolean {
  return value !== null && typeof value === 'object' && !isNaN(value) && value instanceof Date
}

export function isNumber (value: any): boolean {
  return typeof value === 'number' && !isNaN(value)
}

export function isObject (v: any): boolean {
  return v !== null && typeof v === 'object' && Object.prototype.toString.call(v) === '[object Object]'
}

export function isPlainObject (value: any): boolean {
  if (!isObject(value)) return false

  // check for modified constructor or no constructor
  const constructor = value.constructor
  if (typeof constructor !== 'function') return false

  // check for modified prototype
  const prototype = constructor.prototype
  if (!isObject(prototype)) return false

  // check constructor for Object-specific method
  // eslint-disable-next-line no-prototype-builtins
  return prototype.hasOwnProperty('isPrototypeOf')
}

export function isValidDateString (format: 'date' | 'date-time', value: string): boolean {
  const date = new Date(value)
  if (!isNaN(date.getTime())) return false
  const isoDate = format === 'date' ? date.toISOString().substring(0, 10) : date.toISOString()
  const match = rx[format].exec(isoDate)
  if (match === null) return false

  const year = +match[1]
  const month = +match[2] - 1
  const day = +match[3]
  const hour = match[4] !== undefined ? +match[4] : 0
  const minute = match[5] !== undefined ? +match[5] : 0
  const second = match[6] !== undefined ? +match[6] : 0
  const millisecond = match[7] !== undefined ? +match[7] : 0
  return !!(date.getUTCFullYear() === year &&
    date.getUTCMonth() === month &&
    date.getUTCDate() === day &&
    date.getUTCHours() === hour &&
    date.getUTCMinutes() === minute &&
    date.getUTCSeconds() === second &&
    date.getUTCMilliseconds() === millisecond)
}

export function merge (input: any, source: any): any {
  if (Array.isArray(input)) {
    if (source === undefined) return input
    if (Array.isArray(source)) {
      const length = input.length > source.length ? input.length : source.length
      const result: any[] = []
      for (let i = 0; i < length; i++) {
        if (input[i] === undefined) {
          result.push(source)
        } else {
          result.push(merge(input[i], source[i]))
        }
      }
      return result
    }
  } else if (typeof input === 'object') {
    if (input === null) return null
    if (typeof source === 'object') {
      if (source === null) return input
      const keys = Array.from(new Set(Object.keys(input).concat(Object.keys(source))))
      const result: any = {}
      keys.forEach(key => {
        if (input[key] === undefined) {
          result[key] = source[key]
        } else {
          result[key] = merge(input[key], source[key])
        }
      })
      return result
    } else {
      return input
    }
  } else {
    return input
  }
}

export function no (): false {
  return false
}

export function noop (): void {}

export function parseEnforcerExtensionDirective (directive: string): EnforcerDirective {
  const result: EnforcerDirective = {
    exceptionCodeLevels: {} // Example: "exception: ERCODE=warn CODEN2=ignore"
  }
  directive
    .split(';')
    .forEach(v => {
      const [directive, data] = v.split(':').map(v => v.trim())
      if (directive === 'exception') {
        data.split(/ +/)
          .forEach(set => {
            const [code, value] = set.split(/ *= */).map(v => v.trim())
            if (value === 'ignore' || value === 'opinion' || value === 'warn' || value === 'error') {
              result.exceptionCodeLevels[code] = value
            }
          })
      }
    })
  return result
}

export function required (isRequired?: any): boolean {
  if (isRequired === undefined) isRequired = true
  return isRequired === true
}

export function round (number: number, decimalPlaces = 0): number {
  const multiplier = Math.pow(10, decimalPlaces)
  return Math.round(number * multiplier) / multiplier
}

export function same (v1: any, v2: any): boolean {
  if (v1 === v2) return true

  if (typeof v1 !== typeof v2) return false

  if (Array.isArray(v1)) {
    if (!Array.isArray(v2)) return false

    const length = v1.length
    if (length !== v2.length) return false

    for (let i = 0; i < length; i++) {
      if (!same(v1[i], v2[i])) return false
    }

    return true
  } else if (Buffer.isBuffer(v1)) {
    return Buffer.isBuffer(v2) && v1.toString() === v2.toString()
  } else if (isDate(v1)) {
    return isDate(v2) && +v2 === +v1
  } else if (v1 !== null && typeof v1 === 'object') {
    if (v2 === null) return false

    const keys = Object.keys(v1)
    const length = keys.length
    if (length !== Object.keys(v2).length) return false

    for (let i = 0; i < length; i++) {
      const key = keys[i]
      if (!same(v1[key], v2[key])) return false
    }

    return true
  } else {
    return false
  }
}

export function semver (version: string): Semver {
  const match = rx.semver.exec(version)
  return match !== null
    ? {
        string: version,
        major: +match[1],
        minor: +match[2],
        patch: +(match[3] === undefined ? 0 : match[3]),
        hasPatch: match[3] !== undefined
      }
    : { string: version, major: 0, minor: 0, patch: 0, hasPatch: false }
}

export function smart (value: any): string {
  const type = typeof value
  if (type === 'string') return '"' + (value as string).replace(/"/g, '\\"') + '"'
  if (value instanceof Date) return isNaN(+value) ? 'invalid date object' : value.toISOString()
  if (Array.isArray(value)) {
    let result = '[' + String(value) + ']'
    const length = result.length
    if (length > 15) {
      const excess = length - 15
      const offTop = Math.floor(excess / 2)
      const offBottom = excess - offTop
      const middle = Math.ceil(length / 2)
      result = result.substr(0, middle - offBottom) + '...' + result.substr(middle + offTop)
    }
    return result
  }
  if (value !== null && type === 'object') {
    const name = 'constructor' in value ? value.constructor.name : ''
    return '[object' + (name.length > 0 ? ' ' + (name as string) : '') + ']'
  }
  return String(value)
}

export function stringArrayToBooleanMap (array: string[]): BooleanMap {
  const result: BooleanMap = {}
  array.forEach(key => {
    result[key] = true
  })
  return result
}

export function toPlainObject<T> (value: T, options?: ToPlainObjectOptions): T {
  const map = new Map()
  if (options === undefined) options = {}
  if (typeof options !== 'object') throw Error('Parameter "options" must be an object')
  if (!('allowInheritedProperties' in options)) options.allowInheritedProperties = false
  if (!('preserve' in options)) options.preserve = []

  if (!Array.isArray(options.preserve) && !(options.preserve instanceof Set)) throw Error('Option "preserve" must be an Array or a Set')
  options.preserve = new Set(options.preserve)
  options.preserve.add(Date)

  const result = toPlainObjectRecursive(value, options, map)
  if (!result.set) throw Error('Unable to convert value to plain object')
  return result.value as T
}

function toPlainObjectRecursive (value: any, options: ToPlainObjectOptions, map: Map<object, ToPlainObjectResult>): ToPlainObjectResult {
  if (typeof value === 'function' && 'constructor' in value && (options.preserve as Set<Function>).has(value.constructor)) {
    return { set: true, value }
  } else if (Array.isArray(value)) {
    if (map.has(value)) return map.get(value) as ToPlainObjectResult
    const result: ToPlainObjectResult = { set: true, value: [] }
    map.set(value, result)
    value.forEach(v => {
      const r = toPlainObjectRecursive(v, options, map)
      if (r.set) result.value.push(r.value)
    })
    return result
  } else if (value !== null && typeof value === 'object') {
    if (map.has(value)) return map.get(value) as ToPlainObjectResult
    const result: { set: boolean, value: ObjectMap } = { set: true, value: {} }
    map.set(value, result)
    for (const k in value) {
      if (options.allowInheritedProperties === true || k in value) {
        const r = toPlainObjectRecursive(value[k], options, map)
        if (r.set) result.value[k] = r.value
      }
    }
    return result
  } else if (value instanceof Object) {
    return { set: false }
  } else {
    return { set: true, value }
  }
}

export function yes (): true {
  return true
}

// export function validateMaxMin (exception: DefinitionException, schema: { [key: string]: any, exclusiveMaximum?: boolean, exclusiveMinimum?: boolean }, type: string, maxProperty: string, minProperty: string, exclusives: boolean, value: any, maximum: number, minimum: number): void {
//   if (maxProperty in schema) {
//     if (exclusives && schema.exclusiveMaximum === true && value >= maximum) {
//       exception.message('Expected ' + type + ' to be less than ' +
//         smart(schema.serialize(schema[maxProperty]).value) + '. Received: ' +
//         smart(schema.serialize(value).value), '')
//     } else if (value > maximum) {
//       exception.message('Expected ' + type + ' to be less than or equal to ' +
//         smart(schema.serialize(schema[maxProperty]).value) + '. Received: ' +
//         smart(schema.serialize(value).value))
//     }
//   }
//
//   if (minProperty in schema) {
//     if (exclusives && schema.exclusiveMinimum === true && value <= minimum) {
//       exception.message('Expected ' + type + ' to be greater than ' +
//         smart(schema.serialize(schema[minProperty]).value) + '. Received: ' +
//         smart(schema.serialize(value).value))
//     } else if (value < minimum) {
//       exception.message('Expected ' + type + ' to be greater than or equal to ' +
//         smart(schema.serialize(schema[minProperty]).value) + '. Received: ' +
//         smart(schema.serialize(value).value))
//     }
//   }
// }