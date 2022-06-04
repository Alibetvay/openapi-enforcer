import { componentValidate, OASComponent } from './index'
import { BuilderData, Component, ComponentSchema, ValidatorData, Version } from './helpers/builder-validator-types'
import { DefinitionException } from '../Exception'
import { addParameterToOperation, Operation, reportParameterNamespaceConflicts } from './Operation'
import { Server } from './v3/Server'
import {
  PathItem2 as Definition2,
  PathItem3 as Definition3,
  Parameter2, Parameter3,
  Operation2, Operation3
} from './helpers/definition-types'
import { Method } from './helpers/function-interfaces'

export const methods2: Method[] = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch']
export const methods3: Method[] = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']

type Definition = Definition2 | Definition3
type ParameterDefinition = Parameter2 | Parameter3
type OperationDefinition = Operation2 | Operation3

interface ComponentsMap {
  Operation: Component
  Parameter: Component
}

export function schemaGenerator (components: ComponentsMap, methods: string[]): ComponentSchema {
  return new ComponentSchema<any, any>({
    allowsSchemaExtensions: true,
    builder: {
      after (data) {
        const built = data.context.built as PathItem<any>

        // make sure that all operations have the path parameters too
        const parameters = built.parameters
        if (parameters !== undefined) {
          methods.forEach(method => {
            // @ts-expect-error
            const operation: Operation | undefined = built[method] as Operation
            if (operation !== undefined) {
              parameters.forEach((parameter: any) => {
                addParameterToOperation(operation, parameter)
              })
            }
          })
        }
      }
    },
    validator: {
      after (data) {
        const { built, definition, exception, key } = data.context

        const length = methods.length
        let hasMethod = false
        for (let i = 0; i < length; i++) {
          if (methods[i] in built) {
            hasMethod = true
            break
          }
        }
        if (!hasMethod) {
          exception.add.pathMissingMethods(data, { node: definition }, key)
        }

        // check for unique parameter names per location, also check for formData/body conflict for v2
        methods.forEach(method => {
          if (method in built) {
            const operation = built[method] as OperationDefinition
            const parameters = (built.parameters ?? []).slice(0).concat(operation.parameters ?? [])
            reportParameterNamespaceConflicts(data, operation, parameters)
          }
        })

        // TODO: call Exception.add.pathParameterMismatch

        // create the shared parameters map
        // TODO: create the shared parameters map
        const sharedParameters: ParameterDefinition[] = built.parameters ?? []
        methods.forEach(method => {
          if (method in built) {
            const parameters = sharedParameters.slice(0)
            const operation = built[method] as OperationDefinition
            operation.parameters?.forEach(parameter => {
              const index = parameters.findIndex(p => p.in === parameter.in && p.name === parameter.name)
            })
          }
        })

        // check for parameter name conflicts
        // TODO: check parameter name conflicts, including parameters from parent PathItem definition
      }
    },
    properties: [
      {
        name: 'parameters',
        schema: {
          type: 'array',
          items: {
            type: 'component',
            allowsRef: true,
            component: components.Parameter
          }
        }
      },
      {
        name: 'delete',
        schema: {
          type: 'component',
          allowsRef: false,
          component: components.Operation
        }
      },
      {
        name: 'description',
        versions: ['3.x.x'],
        schema: {
          type: 'string'
        }
      },
      {
        name: 'get',
        schema: {
          type: 'component',
          allowsRef: false,
          component: components.Operation
        }
      },
      {
        name: 'head',
        schema: {
          type: 'component',
          allowsRef: false,
          component: components.Operation
        }
      },
      {
        name: 'options',
        schema: {
          type: 'component',
          allowsRef: false,
          component: components.Operation
        }
      },
      {
        name: 'patch',
        schema: {
          type: 'component',
          allowsRef: false,
          component: components.Operation
        }
      },
      {
        name: 'put',
        schema: {
          type: 'component',
          allowsRef: false,
          component: components.Operation
        }
      },
      {
        name: 'post',
        schema: {
          type: 'component',
          allowsRef: false,
          component: components.Operation
        }
      },
      {
        name: 'trace',
        versions: ['3.x.x'],
        schema: {
          type: 'component',
          allowsRef: false,
          component: components.Operation
        }
      },
      {
        name: 'servers',
        versions: ['3.x.x'],
        schema: {
          type: 'array',
          items: {
            type: 'component',
            allowsRef: false,
            component: Server
          }
        }
      },
      {
        name: 'summary',
        versions: ['3.x.x'],
        schema: {
          type: 'string'
        }
      }
    ]
  })
}

export class PathItem<Operation> extends OASComponent {
  extensions!: Record<string, any>
  delete?: Operation
  get?: Operation
  head?: Operation
  options?: Operation
  parameters?: any[] // Parameter.Parameter - see inheriting classes for specifics
  patch?: Operation
  put?: Operation
  post?: Operation

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor (Component: Component, definition: Definition, version?: Version, data?: BuilderData) {
    super(Component, definition, version, data)
  }

  static validate (definition: Definition, version?: Version, data?: ValidatorData): DefinitionException {
    // @ts-expect-error
    return componentValidate(this, definition, version, data)
  }
}
