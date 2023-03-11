import { ILineEnding, ILoader, ILoaderFunction, ILoaderMetadata, ILoaderOptions } from './ILoader'
import { Result } from '../Result'
import { appendToPath, map, normalizeLoaderMetadata, normalizeLoaderOptions, traverse } from './loader-common'
import jsonParser, { ValueNode } from 'json-to-ast'
import { safeLoad as loadYaml } from 'yaml-ast-parser/dist/src/loader'
import { getMessage } from '../i18n/i18n'
import {
  Kind as YamlKind,
  YAMLMapping as YamlMapping,
  YAMLNode as YamlNode,
  YAMLSequence as YamlSequence
} from 'yaml-ast-parser/dist/src/yamlAST'
import { ILookupLocationArray, ILookupLocationObject, IPosition } from '../Locator/ILocator'
import { Adapter } from '../Adapter/Adapter'
import { load } from './loader'

const loaders: ILoader[] = []
const rxJson = /\.json$/
const rxYaml = /\.ya?ml$/

export function define (name: string, loader: ILoaderFunction): void {
  loaders.unshift({ name, loader })
}

/**
 * Accepts a path or object and resolves any $ref instances. This method is also used to associate location information
 * with an object.
 * @param definition The path or object to load.
 * @param [options] Load options.
 * @param [options.dereference=true] Whether to resolve $ref values.
 * @returns Promise<Result> with the value of the loaded object.
 */
export async function loadAsync (definition: string | object, options?: Partial<ILoaderOptions>): Promise<Result> {
  const opts = normalizeLoaderOptions(options)
  const data = normalizeLoaderMetadata(arguments[2])

  if (typeof definition === 'string') {
    const node = data.cache[definition] ?? await runLoadersAsync(definition, data)
    if (data.exceptionStore.hasError) return new Result(null, data.exceptionStore)
    data.cache[definition] = node

    if (opts.dereference) await processLoadedDataAsync('#', node, normalizeLoaderOptions(options), data)

    return new Result(node, data.exceptionStore)
  } else if (opts.dereference) {
    await processLoadedDataAsync('#', definition, normalizeLoaderOptions(options), data)
    return new Result(definition, data.exceptionStore)
  } else {
    return load(definition, opts)
  }
}

/**
 * Accepts a path or object and resolves any $ref instances. This method is also used to associate location information
 * with an object. If an error is encountered then it will be thrown.
 * @param definition The path or object to load.
 * @param [options] Load options.
 * @param [options.dereference=true] Whether to resolve $ref values.
 * @returns The loaded object.
 */
export async function loadAsyncAndThrow<T=any> (definition: string | object, options?: ILoaderOptions): Promise<T> {
  // @ts-expect-error
  const { value, error } = await loadAsync(definition, options, arguments[2])
  if (error !== undefined) throw Error(error.toString())
  return value
}

function getLocationFromPosition (pos: number, lineEndings: ILineEnding[]): IPosition {
  const result: IPosition = {
    line: 1,
    column: 1,
    offset: pos
  }
  let lastLine: ILineEnding = lineEndings[0]

  const length = lineEndings.length
  let found: boolean = false
  for (let i = 0; i < length; i++) {
    const lineEnding = lineEndings[i]
    if (lineEnding.pos > pos) {
      const prev = lineEndings[i - 1]
      result.column = prev === undefined
        ? pos + 1
        : pos - (prev.pos + prev.len) + 1
      lastLine = prev
      found = true
      break
    } else {
      result.line++
    }
  }

  if (!found) {
    const prev = lineEndings[length - 1]
    result.column = pos - (prev.pos + prev.len) + 1
  }

  if (result.column <= 0) {
    result.line--
    result.column = lastLine.lineLength + 1
  }

  return result
}

function processJsonAst (ast: ValueNode, path: string, meta: ILoaderMetadata): any {
  if (ast.type === 'Array') {
    const node: any[] = []
    const lookup: ILookupLocationArray = {
      type: 'array',
      loc: {
        path,
        end: ast.loc?.end as IPosition,
        root: meta.root,
        start: ast.loc?.start as IPosition
      },
      items: []
    }
    map.set(node, lookup)

    ast.children.forEach((astChild, index) => {
      const pathPlus = appendToPath(path, String(index))
      const childNode = processJsonAst(astChild, pathPlus, meta)
      node.push(childNode)
      lookup.items.push({
        path: pathPlus,
        root: meta.root,
        start: astChild.loc?.start as IPosition,
        end: astChild.loc?.end as IPosition
      })
    })
    return node
  } else if (ast.type === 'Literal') {
    return ast.value
  } else if (ast.type === 'Object') {
    const node: Record<string, any> = {}
    const lookup: ILookupLocationObject = {
      type: 'object',
      loc: {
        path,
        root: meta.root,
        start: ast.loc?.start as IPosition,
        end: ast.loc?.end as IPosition
      },
      properties: {}
    }

    ast.children.forEach(childAst => {
      const propertyName = childAst.key.value
      const pathPlus = appendToPath(path, propertyName)
      node[propertyName] = processJsonAst(childAst.value, pathPlus, meta)
      lookup.properties[propertyName] = {
        key: {
          path: pathPlus,
          root: meta.root,
          end: childAst.key.loc?.end as IPosition,
          start: childAst.key.loc?.start as IPosition
        },
        value: {
          path: pathPlus,
          root: meta.root,
          end: childAst.value.loc?.end as IPosition,
          start: childAst.value.loc?.start as IPosition
        }
      }
    })
    return node
  }
}

async function processLoadedDataAsync (path: string, node: object, options: ILoaderOptions, data: ILoaderMetadata): Promise<void> {
  const promises: Array<Promise<void>> = []
  if (Array.isArray(node)) {
    const length = node.length
    for (let index = 0; index < length; index++) {
      const i = String(index)
      promises.push(processLoadedDataAsync(appendToPath(path, String(i)), node[index], options, data))
    }
  } else if (node !== null && typeof node === 'object') {
    const n = node as Record<string, any>
    if (n.$ref === undefined) {
      Object.keys(node)
        .forEach(key => {
          promises.push(processLoadedDataAsync(appendToPath(path, key), n[key], options, data))
        })
    } else if (typeof n.$ref === 'string' && options.dereference) {
      const ref = n.$ref

      // local reference
      if (ref.startsWith('#/')) {
        const found = traverse(data.root.node, ref)
        if (found !== undefined) {
          Object.assign(node, found)
          delete n.$ref
        }

      // reference to other location
      } else {
        const [childPath, subRef] = ref.split('#/')
        const dirPath = Adapter.path.dirname(data.root.source)
        const absoluteChildPath = Adapter.path.resolve(dirPath, childPath)

        // @ts-expect-error
        const result = await loadAsync(absoluteChildPath, options, data)
        if (result.hasError && result.exceptionStore !== undefined) {
          data.exceptionStore.exceptions.push(...result.exceptionStore.exceptions)
        } else if (result.value !== undefined) {
          const newNode = result.value
          if (subRef === undefined) {
            Object.assign(n, newNode)
            delete n.$ref
          } else {
            const found = traverse(newNode, '#/' + subRef)
            if (found !== undefined) {
              Object.assign(n, found)
              delete n.$ref
            }
          }
        }
      }
    }
  }
  await Promise.all(promises)
}

async function runLoadersAsync (path: string, data: ILoaderMetadata): Promise<any> {
  const length = loaders.length
  const reasons: string[] = []
  for (let i = 0; i < length; i++) {
    const loader = loaders[i]
    const result = await loader.loader(path, data)
    if (!result.loaded) {
      reasons.push(loader.name + ': ' + result.reason)
    } else {
      // if type is not known then maybe the path can tell us
      if (result.type === undefined) {
        if (rxJson.test(path)) {
          result.type = 'json'
        } else if (rxYaml.test(path)) {
          result.type = 'yaml'
        }
      }

      // make a final attempt to determine type
      if (result.type === undefined) {
        try {
          JSON.parse(result.content)
          result.type = 'json'
        } catch (e) {
          result.type = 'yaml'
        }
      }

      if (result.type === 'json' || result.type === undefined) {
        let value: any
        if (result.type === undefined) {
          try {
            value = JSON.parse(result.content)
          } catch (e) {
            if (result.type === 'json') throw e
          }
        } else {
          value = result.content
        }

        if (value !== undefined) {
          const ast = jsonParser(result.content, { source: path })
          return processJsonAst(ast, '#', data)
        }
      }

      if (result.type === 'yaml' || result.type === undefined) {
        const rx = /\r\n|\r|\n/g
        const content = result.content
        const lineEndings: ILineEnding[] = []
        let linePos = 0
        let match
        while ((match = rx.exec(content)) !== null) {
          lineEndings.push({
            pos: match.index,
            len: match[0].length,
            lineLength: match.index - linePos
          })
          linePos = match.index + match[0].length
        }
        const ast = loadYaml(result.content)
        if (ast.errors.length > 0) throw Error(getMessage('LOADER_YAML_PARSE_ERROR', { reasons: ast.errors.join('\r  ') }))
        const built = yamlAstToObject(ast)
        yamlAstToLocations(ast, built, built, path, lineEndings, '#', data)
        return built
      }
    }
  }

  data.exceptionStore?.add({
    id: 'LOADER',
    code: 'LOADER_NOT_FOUND',
    level: 'error',
    locations: [],
    metadata: {
      caller: data.root.source,
      resource: path,
      reasons
    }
  })
}

function yamlAstToObject (data: YamlNode): any {
  if (data.kind === YamlKind.MAP) {
    // YamlKind.MAP === object
    const built: Record<string, any> = {}
    data.mappings.forEach((o: YamlMapping) => {
      const key = o.key.value
      built[key] = yamlAstToObject(o.value)
    })
    return built
  } else if (data.kind === YamlKind.SCALAR) {
    // YamlKind.SCALAR === non-object (number, string, etc.)
    return 'valueObject' in data ? data.valueObject : data.value
  } else if (data.kind === YamlKind.SEQ) {
    // YamlKind.SEQ === Array
    const built: any[] = []
    ;(data as YamlSequence).items.forEach((o: YamlNode) => {
      built.push(yamlAstToObject(o))
    })
    return built
  } else {
    throw Error(getMessage('LOADER_YAML_SUPPORT_ERROR'))
  }
}

function yamlAstToLocations (data: YamlNode, built: any, rootNode: any, source: string, lineEndings: ILineEnding[], path: string, meta: ILoaderMetadata): void {
  // object
  if (data.kind === YamlKind.MAP) {
    const lookup: ILookupLocationObject = {
      type: 'object',
      loc: {
        path,
        root: meta.root,
        start: getLocationFromPosition(data.startPosition, lineEndings),
        end: getLocationFromPosition(data.endPosition, lineEndings)
      },
      properties: {}
    }
    map.set(built, lookup)

    data.mappings.forEach((o: YamlMapping) => {
      const k = o.key
      const v = o.value as YamlNode['value']
      const key = k.value
      const value = built[key]
      const pathPlus = appendToPath(path, key)
      lookup.properties[key] = {
        key: {
          path: pathPlus,
          root: meta.root,
          start: getLocationFromPosition(k.startPosition, lineEndings),
          end: getLocationFromPosition(k.endPosition, lineEndings)
        },
        value: {
          path: pathPlus,
          root: meta.root,
          start: getLocationFromPosition(v.startPosition, lineEndings),
          end: getLocationFromPosition(v.endPosition, lineEndings)
        }
      }
      yamlAstToLocations(o.value, value, rootNode, source, lineEndings, pathPlus, meta)
    })

    // array
  } else if (data.kind === YamlKind.SEQ) {
    const lookup: ILookupLocationArray = {
      type: 'array',
      loc: {
        path,
        root: meta.root,
        start: getLocationFromPosition(data.startPosition, lineEndings),
        end: getLocationFromPosition(data.endPosition, lineEndings)
      },
      items: []
    }
    map.set(built, lookup)

    ;(data as YamlSequence).items.forEach((o: YamlNode, index: number) => {
      const pathPlus = appendToPath(path, String(index))
      const value = built[index]
      lookup.items.push({
        path: pathPlus,
        root: meta.root,
        start: getLocationFromPosition(o.startPosition, lineEndings),
        end: getLocationFromPosition(o.endPosition, lineEndings)
      })
      yamlAstToLocations(o, value, rootNode, source, lineEndings, pathPlus, meta)
    })
  } else if (data.kind !== YamlKind.SCALAR) {
    throw Error(getMessage('LOADER_YAML_SUPPORT_ERROR'))
  }
}
