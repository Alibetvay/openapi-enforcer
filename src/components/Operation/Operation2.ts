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
import * as ISchema from '../IComponentSchema'
import { IOperationSchemaProcessor } from '../IInternalTypes'
import {
  ExternalDocumentation2,
  IExternalDocumentation2,
  IExternalDocumentation2Definition,
  IOperation2,
  IOperation2Definition,
  IParameter2,
  IParameter2Definition,
  IResponses2,
  IResponses2Definition,
  ISecurityRequirement2,
  ISecurityRequirement2Definition,
  Parameter2,
  Responses2,
  SecurityRequirement2
} from '../'
// <!# Custom Content Begin: HEADER #!>
import { after, getMergedParameters } from './common'
import { getLocation } from '../../Locator/Locator'
import { findAncestorComponentData } from '../common'
import { ISchemaProcessor } from '../ISchemaProcessor'
import { ISwagger2Definition } from '../Swagger'
import { ContentType } from '../../ContentType/ContentType'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.IDefinition<IOperation2Definition, IOperation2> | null = null

export class Operation extends EnforcerComponent implements IOperation2 {
  [extension: `x-${string}`]: any
  tags?: string[]
  summary?: string
  description?: string
  externalDocs?: IExternalDocumentation2
  operationId?: string
  consumes?: string[]
  produces?: string[]
  parameters?: IParameter2[]
  responses!: IResponses2
  schemes?: Array<'http'|'https'|'ws'|'wss'>
  deprecated?: boolean
  security?: ISecurityRequirement2[]

  constructor (definition: IOperation2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#operation-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchema (_data: IOperationSchemaProcessor): ISchema.IDefinition<IOperation2Definition, IOperation2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const tags: ISchema.IProperty<ISchema.IArray<ISchema.IString>> = {
      name: 'tags',
      schema: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    }

    const summary: ISchema.IProperty<ISchema.IString> = {
      name: 'summary',
      schema: {
        type: 'string'
      }
    }

    const description: ISchema.IProperty<ISchema.IString> = {
      name: 'description',
      schema: {
        type: 'string'
      }
    }

    const externalDocs: ISchema.IProperty<ISchema.IComponent<IExternalDocumentation2Definition, IExternalDocumentation2>> = {
      name: 'externalDocs',
      schema: {
        type: 'component',
        allowsRef: false,
        component: ExternalDocumentation2
      }
    }

    const operationId: ISchema.IProperty<ISchema.IString> = {
      name: 'operationId',
      schema: {
        type: 'string'
      }
    }

    const consumes: ISchema.IProperty<ISchema.IArray<ISchema.IString>> = {
      name: 'consumes',
      schema: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    }

    const produces: ISchema.IProperty<ISchema.IArray<ISchema.IString>> = {
      name: 'produces',
      schema: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    }

    const parameters: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<IParameter2Definition, IParameter2>>> = {
      name: 'parameters',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: true,
          component: Parameter2
        }
      }
    }

    const responses: ISchema.IProperty<ISchema.IComponent<IResponses2Definition, IResponses2>> = {
      name: 'responses',
      required: true,
      schema: {
        type: 'component',
        allowsRef: false,
        component: Responses2
      }
    }

    const schemes: ISchema.IProperty<ISchema.IArray<ISchema.IString>> = {
      name: 'schemes',
      schema: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['http', 'https', 'ws', 'wss']
        }
      }
    }

    const deprecated: ISchema.IProperty<ISchema.IBoolean> = {
      name: 'deprecated',
      schema: {
        type: 'boolean'
      }
    }

    const security: ISchema.IProperty<ISchema.IArray<ISchema.IComponent<ISecurityRequirement2Definition, ISecurityRequirement2>>> = {
      name: 'security',
      schema: {
        type: 'array',
        items: {
          type: 'component',
          allowsRef: false,
          component: SecurityRequirement2
        }
      }
    }

    const result: ISchema.IDefinition<IOperation2Definition, IOperation2> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        tags,
        summary,
        description,
        externalDocs,
        operationId,
        consumes,
        produces,
        parameters,
        responses,
        schemes,
        deprecated,
        security
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    result.after = function (data, mode) {
      const { chain, definition, exception, id, reference } = data
      after(definition, data, mode)

      if (mode === 'validate') {
        const parameters = getMergedParameters(data)
        const bodies: IParameter2Definition[] = []
        const forms: IParameter2Definition[] = []
        parameters.forEach(parameter => {
          if (parameter.in === 'body') {
            bodies.push(parameter)
          } else if (parameter.in === 'formData') {
            forms.push(parameter)
          }
        })

        if (bodies.length > 1) {
          exception.add({
            id: id + '_BODY_NOT_UNIQUE',
            level: 'error',
            locations: bodies.map(parameter => getLocation(parameter)),
            message: 'Only one body parameter allowed.',
            metadata: { bodyParameters: parameters },
            reference
          })
        }

        if (bodies.length > 0 && forms.length > 0) {
          exception.add({
            id: id + '_BODY_FORM_DATA_CONFLICT',
            level: 'error',
            locations: bodies.map(parameter => getLocation(parameter))
              .concat(forms.map(parameter => getLocation(parameter))),
            message: 'The body parameter and formData parameter are mutually exclusive.',
            metadata: { bodyParameters: parameters, formDataParameters: forms },
            reference
          })
        }

        const swaggerData: ISchemaProcessor<ISwagger2Definition, any, any> | undefined =
          findAncestorComponentData(chain, 'Swagger') as ISchemaProcessor<ISwagger2Definition, any, any>
        const consumes = (definition.consumes ?? []).concat(swaggerData?.definition.consumes ?? [])
        const accepts = consumes.map(c => ContentType.fromString(c))

        // check consumes values for form data
        if (forms.length > 0) {
          const matchTypes = [
            ContentType.fromString('multipart/form-data'),
            ContentType.fromString('application/x-www-form-urlencoded')
          ]
          const consumesFormData = accepts.find(v => v?.findMatches(matchTypes) !== undefined)
          if (consumesFormData === undefined) {
            exception.add({
              id: id + '_FORM_DATA_CONSUMES',
              level: 'warn',
              locations: [getLocation(definition)],
              message: 'Input parameters in formData or file should also be accompanied with a consumes property value of either "multipart/form-data" or "application/x-www-form-urlencoded',
              metadata: { consumes }
            })
          }
        }

        if (bodies.length === 1) {
          const body = bodies[0]
          if ((body.schema?.type === 'array' || body.schema?.type === 'object')) {
            working here
          }
        }
      }
    }
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IOperation2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
