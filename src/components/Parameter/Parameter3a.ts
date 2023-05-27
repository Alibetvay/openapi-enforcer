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
import { ExceptionStore } from '../../Exception/ExceptionStore'
import { ISDSchemaDefinition } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { loadAsync, loadAsyncAndThrow } from '../../Loader'
import { Schema3a, ISchema3a, ISchema3aDefinition } from '../Schema'
import { Reference3a, IReference3a, IReference3aDefinition } from '../Reference'
import { Record<Example|Reference>3a, IRecord<Example|Reference>3a, IRecord<Example|Reference>3aDefinition } from '../Record<Example|Reference>'
import { Record<MediaType>3a, IRecord<MediaType>3a, IRecord<MediaType>3aDefinition } from '../Record<MediaType>'
import { Parameter as ParameterBase } from './Parameter'
import { IParameter3a, IParameter3aDefinition, IParameter3aSchemaProcessor, IParameterValidatorsMap3a as IValidatorsMap } from './IParameter'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IParameter3aDefinition, IParameter3a> | null = null

export class Parameter extends ParameterBase implements IParameter3a {
  public extensions: Record<string, any> = {}
  public name?: string!
  public in!: 'cookie' | 'header' | 'path' | 'query'
  public description?: string
  public required?: boolean
  public deprecated?: boolean
  public allowEmptyValue?: boolean
  public style?: 'deepObject' | 'form' | 'label' | 'matrix' | 'pipeDelimited' | 'simple' | 'spaceDelimited'
  public explode?: boolean
  public allowReserved?: boolean
  public schema?: ISchema3a | IReference3a
  public example?: any
  public examples?: IRecord<Example|Reference>3a
  public content?: IRecord<MediaType>3a

  constructor (definition: IParameter3aDefinition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'PARAMETER3A'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true,
    '3.1.0': 'https://spec.openapis.org/oas/v3.1.0#parameter-object'
  }

  static getSchemaDefinition (_data: IParameter3aSchemaProcessor): ISDSchemaDefinition<IParameter3aDefinition, IParameter3a> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISDSchemaDefinition<IParameter3aDefinition, IParameter3a> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.name,
        validators._in,
        validators.description,
        validators.required,
        validators.deprecated,
        validators.allowEmptyValue,
        validators.style,
        validators.explode,
        validators.allowReserved,
        validators.schema,
        validators.example,
        validators.examples,
        validators.content
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<IParameter3aDefinition> | Parameter | undefined): Parameter {
    if (definition instanceof Parameter) {
      return new Parameter(Object.assign({}, definition as unknown) as IParameter3aDefinition)
    } else {
      return new Parameter(Object.assign({
        in: 'cookie'
      }, definition) as IParameter3aDefinition)
    }
  }

  static async createAsync (definition?: Partial<IParameter3aDefinition> | Parameter | string | undefined): Promise<Parameter> {
    if (definition instanceof Parameter) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IParameter3aDefinition>)
    }
  }

  static createDefinition<T extends Partial<IParameter3aDefinition>> (definition?: T | undefined): IParameter3aDefinition & T {
    return Object.assign({
      in: 'cookie'
    }, definition) as IParameter3aDefinition & T
  }

  static validate (definition: IParameter3aDefinition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IParameter3aDefinition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: AFTER_COMPONENT #!>
// Put your code here.
// <!# Custom Content End: AFTER_COMPONENT #!>

function getValidatorsMap (): IValidatorsMap {
  return {
    name: {
      name: 'name',
      schema: {
        type: 'string!'
      }
    },
    _in: {
      name: 'in',
      required: true,
      schema: {
        type: 'string',
        enum: ['cookie', 'header', 'path', 'query']
      }
    },
    description: {
      name: 'description',
      schema: {
        type: 'string'
      }
    },
    required: {
      name: 'required',
      schema: {
        type: 'boolean'
      }
    },
    deprecated: {
      name: 'deprecated',
      schema: {
        type: 'boolean'
      }
    },
    allowEmptyValue: {
      name: 'allowEmptyValue',
      schema: {
        type: 'boolean'
      }
    },
    style: {
      name: 'style',
      schema: {
        type: 'string',
        enum: ['deepObject', 'form', 'label', 'matrix', 'pipeDelimited', 'simple', 'spaceDelimited']
      }
    },
    explode: {
      name: 'explode',
      schema: {
        type: 'boolean'
      }
    },
    allowReserved: {
      name: 'allowReserved',
      schema: {
        type: 'boolean'
      }
    },
    schema: {
      name: 'schema',
      schema: {
        type: 'component',
        allowsRef: true,
        component: Schema3a
      }
    },
    example: {
      name: 'example',
      schema: {
        type: 'any'
      }
    },
    examples: {
      name: 'examples',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Record<Example|Reference>3a
      }
    },
    content: {
      name: 'content',
      schema: {
        type: 'component',
        allowsRef: false,
        component: Record<MediaType>3a
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
