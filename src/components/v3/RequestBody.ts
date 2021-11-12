import { OASComponent, Version, DefinitionException, ComponentSchema } from '../index'
import { MediaType } from './MediaType'
import { RequestBody3 as Definition } from '../helpers/DefinitionTypes'

const requestBodySchema: ComponentSchema<Definition> = {
  allowsSchemaExtensions: true,
  properties: [
    {
      name: 'description',
      schema: { type: 'string' }
    },
    {
      name: 'content',
      required: true,
      schema: {
        type: 'object',
        allowsSchemaExtensions: true,
        additionalProperties: {
          type: 'component',
          allowsRef: false,
          component: MediaType
        }
      }
    },
    {
      name: 'required',
      schema: { type: 'boolean' }
    }
  ]
}

export class RequestBody extends OASComponent {
  readonly [key: `x-${string}`]: any
  description?: string
  content!: Record<string, MediaType>
  required?: boolean

  constructor (definition: Definition, version?: Version) {
    super(RequestBody, definition, version, arguments[2])
  }

  static spec = {
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#request-body-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#request-body-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#request-body-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#request-body-object'
  }

  static schemaGenerator (): ComponentSchema<Definition> {
    return requestBodySchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return super.validate(definition, version, arguments[2])
  }
}