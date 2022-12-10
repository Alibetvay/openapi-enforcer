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
import { IComponentsSchemaProcessor } from '../IInternalTypes'
import {
  Callback3,
  Example3,
  Header3,
  ICallback3,
  ICallback3Definition,
  IComponents3,
  IComponents3Definition,
  IExample3,
  IExample3Definition,
  IHeader3,
  IHeader3Definition,
  ILink3,
  ILink3Definition,
  IParameter3,
  IParameter3Definition,
  IRequestBody3,
  IRequestBody3Definition,
  IResponse3,
  IResponse3Definition,
  ISchema3,
  ISchema3Definition,
  ISecurityScheme3,
  ISecurityScheme3Definition,
  Link3,
  Parameter3,
  RequestBody3,
  Response3,
  Schema3,
  SecurityScheme3
} from '../'
// <!# Custom Content Begin: HEADER #!>
import { getLocation } from '../../Locator/Locator'
import { smart } from '../../util'

const rxPropertyName = /^[a-zA-Z0-9._-]+$/
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<IComponents3Definition, IComponents3> | null = null

interface IValidatorsMap {
  schemas: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<ISchema3Definition, ISchema3>>>
  responses: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<IResponse3Definition, IResponse3>>>
  parameters: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<IParameter3Definition, IParameter3>>>
  examples: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<IExample3Definition, IExample3>>>
  requestBodies: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<IRequestBody3Definition, IRequestBody3>>>
  headers: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<IHeader3Definition, IHeader3>>>
  securitySchemes: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<ISecurityScheme3Definition, ISecurityScheme3>>>
  links: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<ILink3Definition, ILink3>>>
  callbacks: ISchema.IProperty<ISchema.IObject<ISchema.IComponent<ICallback3Definition, ICallback3>>>
}

const validators: IValidatorsMap = {
  schemas: {
    name: 'schemas',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'component',
        allowsRef: true,
        component: Schema3
      }
    }
  },
  responses: {
    name: 'responses',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'component',
        allowsRef: true,
        component: Response3
      }
    }
  },
  parameters: {
    name: 'parameters',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'component',
        allowsRef: true,
        component: Parameter3
      }
    }
  },
  examples: {
    name: 'examples',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'component',
        allowsRef: true,
        component: Example3
      }
    }
  },
  requestBodies: {
    name: 'requestBodies',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'component',
        allowsRef: true,
        component: RequestBody3
      }
    }
  },
  headers: {
    name: 'headers',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'component',
        allowsRef: true,
        component: Header3
      }
    }
  },
  securitySchemes: {
    name: 'securitySchemes',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'component',
        allowsRef: true,
        component: SecurityScheme3
      }
    }
  },
  links: {
    name: 'links',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'component',
        allowsRef: true,
        component: Link3
      }
    }
  },
  callbacks: {
    name: 'callbacks',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'component',
        allowsRef: true,
        component: Callback3
      }
    }
  }
}

export class Components extends EnforcerComponent<IComponents3Definition, IComponents3> implements IComponents3 {
  [extension: `x${string}`]: any

  constructor (definition: IComponents3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'COMPONENTS3'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#components-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#components-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#components-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#components-object'
  }

  static getSchemaDefinition (_data: IComponentsSchemaProcessor): ISchema.ISchemaDefinition<IComponents3Definition, IComponents3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<IComponents3Definition, IComponents3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.schemas,
        validators.responses,
        validators.parameters,
        validators.examples,
        validators.requestBodies,
        validators.headers,
        validators.securitySchemes,
        validators.links,
        validators.callbacks
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    result.validate = (data) => {
      const { definition, exception, reference, id } = data
      const properties: Array<keyof IComponents3Definition> = ['schemas', 'responses',
        'parameters', 'examples', 'requestBodies', 'headers', 'securitySchemes', 'links', 'callbacks']
      properties.forEach(key => {
        if (definition[key] !== undefined) {
          Object.keys(definition[key]).forEach(name => {
            if (!rxPropertyName.test(name)) {
              exception.add({
                id: id + '_FIELD_MAPPED_NAME_INVALID',
                level: 'error',
                locations: [getLocation(definition[key], name, 'key')],
                message: 'The property name ' + smart(name) + ' can only contain letters, numbers, dots, dashes, and underscores.',
                metadata: {
                  field: key,
                  name
                },
                reference
              })
            }
          })
        }
      })
    }
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IComponents3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get schemas (): Record<string, ISchema3> | undefined {
    return this.getProperty('schemas')
  }

  set schemas (value: Record<string, ISchema3> | undefined) {
    this.setProperty('schemas', value)
  }

  get responses (): Record<string, IResponse3> | undefined {
    return this.getProperty('responses')
  }

  set responses (value: Record<string, IResponse3> | undefined) {
    this.setProperty('responses', value)
  }

  get parameters (): Record<string, IParameter3> | undefined {
    return this.getProperty('parameters')
  }

  set parameters (value: Record<string, IParameter3> | undefined) {
    this.setProperty('parameters', value)
  }

  get examples (): Record<string, IExample3> | undefined {
    return this.getProperty('examples')
  }

  set examples (value: Record<string, IExample3> | undefined) {
    this.setProperty('examples', value)
  }

  get requestBodies (): Record<string, IRequestBody3> | undefined {
    return this.getProperty('requestBodies')
  }

  set requestBodies (value: Record<string, IRequestBody3> | undefined) {
    this.setProperty('requestBodies', value)
  }

  get headers (): Record<string, IHeader3> | undefined {
    return this.getProperty('headers')
  }

  set headers (value: Record<string, IHeader3> | undefined) {
    this.setProperty('headers', value)
  }

  get securitySchemes (): Record<string, ISecurityScheme3> | undefined {
    return this.getProperty('securitySchemes')
  }

  set securitySchemes (value: Record<string, ISecurityScheme3> | undefined) {
    this.setProperty('securitySchemes', value)
  }

  get links (): Record<string, ILink3> | undefined {
    return this.getProperty('links')
  }

  set links (value: Record<string, ILink3> | undefined) {
    this.setProperty('links', value)
  }

  get callbacks (): Record<string, ICallback3> | undefined {
    return this.getProperty('callbacks')
  }

  set callbacks (value: Record<string, ICallback3> | undefined) {
    this.setProperty('callbacks', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
