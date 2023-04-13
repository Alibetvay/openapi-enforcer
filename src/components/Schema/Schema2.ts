/*
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!   IMPORTANT   !!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 *  A portion of this file has been created from a template. You can only edit
 *  content in some regions within this file. Look for a region that begins with
 *  // <!# Custom Content Begin: *** #!>
 *  and ends with
 *  // <!# Custom Content End: *** #!>
 *  where the *** is replaced by a string of some value. Within these custom
 *  content regions you can edit the file without worrying about a loss of your
 *  code.
 */

import { IComponentSpec, IVersion } from '../IComponent'
import { EnforcerComponent } from '../Component'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import * as ISchema from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import * as Loader from '../../Loader'
import * as I from '../IInternalTypes'
import * as S from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
import * as common from './common'
import { ISchemaHookHandler, ISchemaHookResult, ISchemaHookType, ISchemaPopulateOptions, ISchemaRandomOptions, ISchemaValidateOptions } from './ISchema'
import { Result } from '../../Result'
// <!# Custom Content End: HEADER #!>

interface IValidatorsMap {
  format: ISchema.IProperty<ISchema.IString>
  title: ISchema.IProperty<ISchema.IString>
  description: ISchema.IProperty<ISchema.IString>
  _default: ISchema.IProperty<any>
  maximum: ISchema.IProperty<ISchema.INumber>
  exclusiveMaximum: ISchema.IProperty<ISchema.IBoolean>
  minimum: ISchema.IProperty<ISchema.INumber>
  exclusiveMinimum: ISchema.IProperty<ISchema.IBoolean>
  maxLength: ISchema.IProperty<ISchema.INumber>
  minLength: ISchema.IProperty<ISchema.INumber>
  pattern: ISchema.IProperty<ISchema.IString>
  maxItems: ISchema.IProperty<ISchema.INumber>
  minItems: ISchema.IProperty<ISchema.INumber>
  maxProperties: ISchema.IProperty<ISchema.INumber>
  minProperties: ISchema.IProperty<ISchema.INumber>
  uniqueItems: ISchema.IProperty<ISchema.IBoolean>
  _enum: ISchema.IProperty<ISchema.IArray<any>>
  multipleOf: ISchema.IProperty<ISchema.INumber>
  required: ISchema.IProperty<ISchema.IArray<ISchema.IString>>
  type: ISchema.IProperty<ISchema.IString>
  items: ISchema.IProperty<ISchema.IComponent<I.ISchema2Definition, I.ISchema2>>
  allOf: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<I.ISchema2Definition, I.ISchema2>>>
  properties: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<I.ISchema2Definition, I.ISchema2>>>
  additionalProperties: ISchema.IProperty<ISchema.IOneOf>
  discriminator: ISchema.IProperty<ISchema.IString>
  readOnly: ISchema.IProperty<ISchema.IBoolean>
  xml: ISchema.IProperty<ISchema.IComponent<I.IXml2Definition, I.IXml2>>
  externalDocs: ISchema.IProperty<ISchema.IComponent<I.IExternalDocumentation2Definition, I.IExternalDocumentation2>>
  example: ISchema.IProperty<any>
}

export class Schema extends EnforcerComponent<I.ISchema2Definition> implements I.ISchema2 {
  [S.Extensions]: Record<string, any> = {}
  public format?: string
  public title?: string
  public description?: string
  public default?: any
  public maximum?: number
  public exclusiveMaximum?: boolean
  public minimum?: number
  public exclusiveMinimum?: boolean
  public maxLength?: number
  public minLength?: number
  public pattern?: string
  public maxItems?: number
  public minItems?: number
  public maxProperties?: number
  public minProperties?: number
  public uniqueItems?: boolean
  public enum?: any[]
  public multipleOf?: number
  public required?: string[]
  public type?: string
  public items?: I.ISchema2
  public allOf?: I.ISchema2[]
  public properties?: Record<string, I.ISchema2>
  public additionalProperties?: I.ISchema2 | boolean
  public discriminator?: string
  public readOnly?: boolean
  public xml?: I.IXml2
  public externalDocs?: I.IExternalDocumentation2
  public example?: any

  constructor (definition: I.ISchema2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'SCHEMA2'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#schema-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchemaDefinition (_data: I.ISchemaSchemaProcessor): ISchema.ISchemaDefinition<I.ISchema2Definition, I.ISchema2> {
    const validators = getValidatorsMap()
    const result: ISchema.ISchemaDefinition<I.ISchema2Definition, I.ISchema2> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.format,
        validators.title,
        validators.description,
        validators._default,
        validators.maximum,
        validators.exclusiveMaximum,
        validators.minimum,
        validators.exclusiveMinimum,
        validators.maxLength,
        validators.minLength,
        validators.pattern,
        validators.maxItems,
        validators.minItems,
        validators.maxProperties,
        validators.minProperties,
        validators.uniqueItems,
        validators._enum,
        validators.multipleOf,
        validators.required,
        validators.type,
        validators.items,
        validators.allOf,
        validators.properties,
        validators.additionalProperties,
        validators.discriminator,
        validators.readOnly,
        validators.xml,
        validators.externalDocs,
        validators.example
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    return result
  }

  static create (definition?: Partial<I.ISchema2Definition> | Schema | undefined): Schema {
    return new Schema(Object.assign({}, definition) as I.ISchema2Definition)
  }

  static async createAsync (definition?: Partial<I.ISchema2Definition> | Schema | string | undefined): Promise<Schema> {
    if (definition instanceof Schema) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await Loader.loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.ISchema2Definition>)
    }
  }

  static createDefinition<T extends Partial<I.ISchema2Definition>> (definition?: T | undefined): I.ISchema2Definition & T {
    return Object.assign({}, definition) as I.ISchema2Definition & T
  }

  static validate (definition: I.ISchema2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.ISchema2Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await Loader.loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  hook (type: ISchemaHookType, handler: ISchemaHookHandler): ISchemaHookResult {
    return {
      done: false,
      hasException: false,
      value: null
    }
  }

  deserialize (value: string, options: { strict: boolean } | undefined): any {
    return common.deserialize(value, options)
  }

  discriminate (value: object): { key: string, name: string, schema: I.Schema2 } {
    return common.discriminate<I.Schema2>(value)
  }

  populate (params: Record<string, any>, value: object, options?: ISchemaPopulateOptions): Result<object> {
    return new Result({})
  }

  random (value: any, options?: ISchemaRandomOptions): Result<object> {
    return new Result({})
  }

  serialize (value: any): Result {
    return new Result({})
  }

  unhook (type: ISchemaHookType, handler: ISchemaHookHandler): void {

  }

  validate (value: any, options?: ISchemaValidateOptions): ExceptionStore | undefined {
    return undefined
  }
  // <!# Custom Content End: BODY #!>
}

function getValidatorsMap (): IValidatorsMap {
  return {
    format: {
      name: 'format',
      schema: {
        type: 'string'
      }
    },
    title: {
      name: 'title',
      schema: {
        type: 'string'
      }
    },
    description: {
      name: 'description',
      schema: {
        type: 'string'
      }
    },
    _default: {
      name: 'default',
      schema: {
        type: 'any'
      }
    },
    maximum: {
      name: 'maximum',
      schema: {
        type: 'number'
      }
    },
    exclusiveMaximum: {
      name: 'exclusiveMaximum',
      schema: {
        type: 'boolean'
      }
    },
    minimum: {
      name: 'minimum',
      schema: {
        type: 'number'
      }
    },
    exclusiveMinimum: {
      name: 'exclusiveMinimum',
      schema: {
        type: 'boolean'
      }
    },
    maxLength: {
      name: 'maxLength',
      schema: {
        type: 'number'
      }
    },
    minLength: {
      name: 'minLength',
      schema: {
        type: 'number'
      }
    },
    pattern: {
      name: 'pattern',
      schema: {
        type: 'string'
      }
    },
    maxItems: {
      name: 'maxItems',
      schema: {
        type: 'number'
      }
    },
    minItems: {
      name: 'minItems',
      schema: {
        type: 'number'
      }
    },
    maxProperties: {
      name: 'maxProperties',
      schema: {
        type: 'number'
      }
    },
    minProperties: {
      name: 'minProperties',
      schema: {
        type: 'number'
      }
    },
    uniqueItems: {
      name: 'uniqueItems',
      schema: {
        type: 'boolean'
      }
    },
    _enum: {
      name: 'enum',
      schema: {
        type: 'array',
        items: {
          type: 'any'
        }
      }
    },
    multipleOf: {
      name: 'multipleOf',
      schema: {
        type: 'number'
      }
    },
    required: {
      name: 'required',
      schema: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    },
    type: {
      name: 'type',
      schema: {
        type: 'string'
      }
    },
    items: {
      name: 'items',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.Schema2
      }
    },
    allOf: {
      name: 'allOf',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: true,
          component: I.Schema2
        }
      }
    },
    properties: {
      name: 'properties',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'component',
          allowsRef: true,
          component: I.Schema2
        }
      }
    },
    additionalProperties: {
      name: 'additionalProperties',
      schema: {
        type: 'oneOf',
        oneOf: [
          {
            condition: () => true,
            schema: {
              type: 'component',
              allowsRef: true,
              component: I.Schema2
            }
          },
          {
            condition: () => false,
            schema: {
              type: 'boolean'
            }
          }
        ]
      }
    },
    discriminator: {
      name: 'discriminator',
      schema: {
        type: 'string'
      }
    },
    readOnly: {
      name: 'readOnly',
      schema: {
        type: 'boolean'
      }
    },
    xml: {
      name: 'xml',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.Xml2
      }
    },
    externalDocs: {
      name: 'externalDocs',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.ExternalDocumentation2
      }
    },
    example: {
      name: 'example',
      schema: {
        type: 'any'
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
