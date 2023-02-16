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
import { EnforcerComponent, SetProperty, GetProperty } from '../Component'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import * as ISchema from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import * as I from '../IInternalTypes'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IDiscriminator3Definition, I.IDiscriminator3> | null = null

interface IValidatorsMap {
  propertyName: ISchema.IProperty<ISchema.IString>
  mapping: ISchema.IProperty<ISchema.IObject<ISchema.IString>>
}

export class Discriminator extends EnforcerComponent<I.IDiscriminator3Definition> implements I.IDiscriminator3 {
  constructor (definition: I.IDiscriminator3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'DISCRIMINATOR3'

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#discriminator-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#discriminator-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#discriminator-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#discriminator-object'
  }

  static getSchemaDefinition (_data: I.IDiscriminatorSchemaProcessor): ISchema.ISchemaDefinition<I.IDiscriminator3Definition, I.IDiscriminator3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISchema.ISchemaDefinition<I.IDiscriminator3Definition, I.IDiscriminator3> = {
      type: 'object',
      allowsSchemaExtensions: false,
      properties: [
        validators.propertyName,
        validators.mapping
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    result.validate = function (processor) {
      const { definition, exception } = processor
      const { id, reference } = processor.component

      const l = processor.getLocation()
      console.log(l)

      // if (processor.parent !== null) {
      //   processor.store.discriminators.push(processor.parent)
      // }
      //
      // processor.lastly.addSingleton(Discriminator.id, () => {
      //   processor.store.discriminatorSchemas.forEach(({ processor, used }) => {
      //     // if there is no OpenAPI document then we can't make a fair assessment for the validity, so we skip
      //     const openapi = processor.upTo('OpenAPI')
      //     if (openapi === undefined) return
      //
      //
      //   })
      // })
      //
      //
      //
      //
      //
      // const openapi = processor.upTo('OpenAPI')
      // if (openapi === undefined) return
      //
      // const oneOfRefs = (processor.getSiblingValue('oneOf') ?? []) as string[]
      //
      // Object.keys(definition.mapping ?? {})
      //   .forEach(key => {
      //     const ref = definition.mapping?.[key] as string
      //
      //     if (!oneOfRefs.includes(ref)) {
      //       exception.add({
      //         id,
      //         code: 'DISCRIMINATOR_MAPPING_INVALID',
      //         level: 'error',
      //         locations: [getLocation(definition)],
      //         metadata: {
      //           expectedType: processor.component.name,
      //           value: definition
      //         },
      //         reference
      //       })
      //     }
      //
      //     // TODO: validate the the mapping paths have been loaded
      //   })
    }

    // Put your code here.

    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<I.IDiscriminator3Definition> | Discriminator | undefined): Discriminator {
    if (definition instanceof Discriminator) {
      return new Discriminator(Object.assign({}, definition))
    } else {
      return new Discriminator(Object.assign({
        propertyName: ''
      }, definition) as I.IDiscriminator3Definition)
    }
  }

  static createDefinition<T extends Partial<I.IDiscriminator3Definition>> (definition?: T | undefined): I.IDiscriminator3Definition & T {
    return Object.assign({
      propertyName: ''
    }, definition) as I.IDiscriminator3Definition & T
  }

  static validate (definition: I.IDiscriminator3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get propertyName (): string {
    return this[GetProperty]('propertyName')
  }

  set propertyName (value: string) {
    this[SetProperty]('propertyName', value)
  }

  get mapping (): Record<string, string> | undefined {
    return this[GetProperty]('mapping')
  }

  set mapping (value: Record<string, string> | undefined) {
    this[SetProperty]('mapping', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

function getValidatorsMap (): IValidatorsMap {
  return {
    propertyName: {
      name: 'propertyName',
      required: true,
      schema: {
        type: 'string'
      }
    },
    mapping: {
      name: 'mapping',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'string'
        }
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
