import { OASComponent, initializeData, SchemaObject, SpecMap, Version, ValidateResult } from './'
import { no, yes } from '../util'
import * as E from '../Exception/methods'
import * as Definitions from './Definitions'
import * as ExternalDocumentation from './ExternalDocumentation'
import * as Info from './Info'
import * as Parameter from './Parameter'
import * as Paths from './Paths'
import * as Response from './Response'
import * as SecurityScheme from './SecurityScheme'
import * as SecurityRequirement from './SecurityRequirement'
import * as Tag from './Tag'

const rxHostParts = /^((?:https?|wss?):\/\/)?(.+?)(\/.+)?$/

export interface Definition {
  [extension: string]: any
  basePath?: string
  consumes?: string[]
  definitions?: Definitions.Definition
  externalDocs?: ExternalDocumentation.Definition
  host?: string
  info: Info.Definition
  parameters?: Record<string, Parameter.Definition>
  paths: Paths.Definition
  produces?: string[]
  responses?: Record<string, Response.Definition2>
  security?: SecurityRequirement.Definition[]
  securityDefinitions?: Record<string, SecurityScheme.Definition>
  schemes?: string[]
  swagger: '2.0'
  tags?: Tag.Definition[]
}

export class Swagger extends OASComponent {
  readonly [extension: string]: any
  basePath?: string
  consumes?: string[]
  definitions?: Definitions.Definitions
  externalDocs?: ExternalDocumentation.ExternalDocumentation
  host?: string
  info!: Info.Info
  parameters?: Record<string, Parameter.Parameter>
  paths!: Paths.Paths
  produces?: string[]
  responses?: Record<string, Response.Response>
  security?: SecurityRequirement.SecurityRequirement[]
  securityDefinitions?: Record<string, SecurityScheme.SecurityScheme>
  schemes?: string[]
  swagger!: '2.0'
  tags?: Tag.Tag[]

  constructor (definition: Definition, version?: Version) {
    const data = initializeData('constructing Swagger object', definition, version, arguments[2])
    super(data)
  }

  static get spec (): SpecMap {
    return {
      '2.0': 'http://spec.openapis.org/oas/v2.0#swagger-object'
    }
  }

  static schemaGenerator (): SchemaObject {
    return {
      type: 'object',
      allowsSchemaExtensions: yes,
      properties: [
        {
          name: 'basePath',
          schema: {
            type: 'string',
            after ({ exception, definition, reference }) {
              if (definition[0] !== '/') exception.message(E.swaggerBasePathInvalid(reference, definition))
            }
          }
        },
        {
          name: 'consumes',
          schema: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        {
          name: 'definitions',
          schema: {
            type: 'component',
            allowsRef: false,
            component: Definitions.Definitions
          }
        },
        {
          name: 'externalDocs',
          schema: {
            type: 'component',
            allowsRef: false,
            component: ExternalDocumentation.ExternalDocumentation
          }
        },
        {
          name: 'host',
          schema: {
            type: 'string',
            after ({ exception, definition, reference }) {
              const match = rxHostParts.exec(definition)
              if (match !== undefined && match !== null) {
                if (match[1] !== undefined) exception.message(E.swaggerHostHasScheme(reference, definition, match[1]))
                if (match[3] !== undefined) exception.message(E.swaggerHostHasSubPath(reference, definition, match[3]))
              }
            }
          }
        },
        {
          name: 'info',
          required: yes,
          schema: {
            type: 'component',
            allowsRef: false,
            component: Info.Info
          }
        },
        {
          name: 'parameters',
          schema: {
            type: 'object',
            allowsSchemaExtensions: no,
            additionalProperties: {
              type: 'component',
              allowsRef: false,
              component: Parameter.Parameter
            }
          }
        },
        {
          name: 'paths',
          required: yes,
          schema: {
            type: 'component',
            allowsRef: false,
            component: Paths.Paths
          }
        },
        {
          name: 'produces',
          schema: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        {
          name: 'responses',
          schema: {
            type: 'object',
            allowsSchemaExtensions: no,
            additionalProperties: {
              type: 'component',
              allowsRef: false,
              component: Response.Response
            }
          }
        },
        {
          name: 'schemes',
          schema: {
            type: 'array',
            items: {
              type: 'string',
              enum: () => ['http', 'https', 'ws', 'wss']
            }
          }
        },
        {
          name: 'security',
          schema: {
            type: 'array',
            items: {
              type: 'component',
              allowsRef: false,
              component: SecurityRequirement.SecurityRequirement
            }
          }
        },
        {
          name: 'securityDefinitions',
          schema: {
            type: 'object',
            allowsSchemaExtensions: no,
            additionalProperties: {
              type: 'component',
              allowsRef: false,
              component: SecurityScheme.SecurityScheme
            }
          }
        },
        {
          name: 'swagger',
          required: yes,
          schema: {
            type: 'string',
            enum: () => ['2.0']
          }
        },
        {
          name: 'tags',
          schema: {
            type: 'array',
            items: {
              type: 'component',
              allowsRef: false,
              component: Tag.Tag
            }
          }
        }
      ]
    }
  }

  static validate (definition: Definition, version?: Version): ValidateResult {
    return super.validate(definition, version, arguments[2])
  }
}