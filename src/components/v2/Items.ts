import { DefinitionException } from '../../Exception'
import { componentValidate } from '../index'
import { ComponentSchema, Version } from '../helpers/builder-validator-types'
import * as PartialSchema from '../helpers/PartialSchema'
import { Items2 as Definition } from '../helpers/definition-types'

let itemsSchema: ComponentSchema<Definition>

export class Items extends PartialSchema.PartialSchema<Items> {
  extensions!: Record<string, any>
  collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes'
  type!: 'array' | 'boolean' | 'integer' | 'number' | 'string'

  constructor (definition: Definition, version?: Version) {
    super(Items, definition, version, arguments[2])
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#items-object'
  }

  static get schema (): ComponentSchema<Definition> {
    if (itemsSchema === undefined) {
      itemsSchema = PartialSchema.schemaGenerator(Items)

      // type property is required
      itemsSchema.adjustProperty('type', schema => {
        schema.required = true
      })

      // add collectionFormat property
      itemsSchema.properties?.push({
        name: 'collectionFormat',
        notAllowed ({ built }) {
          return built.type !== 'array' ? 'The "collectionFormat" can only be applied with the type is "array"' : undefined
        },
        schema: {
          type: 'string',
          enum: ['csv', 'ssv', 'tsv', 'pipes'],
          default: 'csv'
        }
      })
    }
    return itemsSchema
  }

  static validate (definition: Definition, version?: Version): DefinitionException {
    return componentValidate(this, definition, version, arguments[2])
  }
}