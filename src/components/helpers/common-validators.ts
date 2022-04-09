import { ValidatorData } from './builder-validator-types'
import { Schema } from '../Schema'
import { Exception, LocationInput } from '../../Exception'

export function defaultRequiredConflict (data: ValidatorData): boolean {
  const { built, exception } = data.context
  let success = true

  if (built.required === true && 'default' in built) {
    const locations: LocationInput[] = [
      { key: 'default', type: 'key' },
      { key: 'required', type: 'key' }
    ]
    const { level } = exception.add.defaultRequiredConflict(data, locations)
    if (level === 'error') success = false
  }

  return success
}

export function exampleExamplesConflict (data: ValidatorData): boolean {
  const { built, exception } = data.context
  let success = true

  if (built.example !== undefined && built.examples !== undefined) {
    const locations: LocationInput[] = [
      { key: 'example', type: 'key' },
      { key: 'examples', type: 'key' }
    ]
    const { level } = exception.add.propertiesMutuallyExclusive(data, locations, ['example', 'examples'])
    if (level === 'error') success = false
  }

  return success
}

export function examplesMatchSchema (data: ValidatorData, SchemaClass: any): true {
  const { built, definition, exception } = data.context
  const { lastly, version } = data.root

  // if the schema still has a $ref then there is nothing we can validate
  const schemaHasRef = definition.schema?.$ref !== undefined
  if (schemaHasRef) return true

  if (built.example !== undefined || built.examples !== undefined) {
    lastly.push(() => {
      if (!exception.hasError) {
        let schema: Schema | null = null
        if (definition.schema !== undefined) {
          schema = new SchemaClass(definition.schema, version)
        } else if (definition.content !== undefined) {
          const key = Object.keys(definition.content)[0]
          const schemaDefinition = definition.content[key].schema
          if (schemaDefinition !== undefined) {
            schema = new SchemaClass(schemaDefinition, version)
          }
        }

        // validate that example matches schema
        if ('example' in built) {
          exampleMatchesSchema(data, ['example'], built.example, schema)
        }

        // validate that example matches schema
        if ('examples' in built) {
          lastly.push(() => {
            const examples = built.examples ?? {}
            Object.keys(examples).forEach(key => {
              exampleMatchesSchema(data, ['examples', key], built.examples[key].value, schema)
            })
          })
        }
      }
    })
  }

  return true
}

export function parameterSchemaContent (data: ValidatorData): boolean {
  const { built, exception } = data.context
  let success = true

  // properties "schema" and "content" are mutually exclusive
  if (built.schema !== undefined && built.content !== undefined) {
    const locations: LocationInput[] = [
      { key: 'schema', type: 'key' },
      { key: 'content', type: 'key' }
    ]
    const { level } = exception.add.propertiesMutuallyExclusive(data, locations, ['content', 'schema'])
    if (level === 'error') success = false
  }

  // must have either "schema" or "content" defined
  if (built.schema === undefined && built.content === undefined) {
    const { level } = exception.add.parameterSchemaContentRequired(data, { type: 'both' })
    if (level === 'error') success = false
  }

  // check that exactly one media type is specified
  if (built.content !== undefined) {
    const types = Object.keys(built.content)
    if (types.length !== 1) {
      const locations: LocationInput[] = []
      if (types.length === 0) {
        locations.push({ key: 'content', type: 'value' })
      } else {
        const node = data.context.definition.content
        types.forEach(key => {
          locations.push({ node, key, type: 'key' })
        })
      }
      const { level } = exception.add.parameterContentMediaTypeCount(data, locations, types)
      if (level === 'error') success = false
    }
  }

  return success
}

function exampleMatchesSchema (data: ValidatorData, keys: string[], example: any, schema: Schema | null): boolean {
  const { exception } = data.context
  let success = true

  // determine the node and key for location lookup
  const length = keys.length
  const key = keys[length - 1]
  let node = data.context.definition
  for (let i = 0; i < length - 1; i++) {
    node = node?.[keys[i]]
  }

  if (schema === null) {
    const { level } = exception.add.exampleWithoutSchema(data, { node, key, type: 'value' })
    if (level === 'error') success = false
  } else {
    const serialized = schema.serialize(example)
    if (serialized?.hasError) {
      const { level } = exception.at(key).add.exampleNotSerializable(data, { node, key, type: 'value' }, example, schema, serialized.exception as Exception)
      if (level === 'error') success = false
    } else {
      const subException = schema.validate(serialized.value, {
        exceptionLevels: {
          'OAE-ESCIGPR': 'error' // error for additional properties so we can add it as a warning to the "exampleNotValid" message.
        }
      })
      if (subException.hasError) {
        const { level } = exception.at(key).add.exampleNotValid(data, { node, key, type: 'value' }, example, schema, subException)
        if (level === 'error') success = false
      }
    }
  }

  return success
}