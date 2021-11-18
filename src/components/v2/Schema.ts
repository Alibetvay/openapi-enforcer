import { ComponentSchema, Data, Dereferenced, Enforcer, Version } from '../index'
import * as Core from '../Schema'
import * as Discriminator from '../v3/Discriminator'
import { Schema2 as Definition } from '../helpers/DefinitionTypes'
import { Swagger } from './Swagger'
import * as SchemaHelper from '../helpers/schema-functions'

export class Schema<HasReference=Dereferenced> extends Core.Schema<HasReference> {
  readonly discriminator?: string

  constructor (definition: Definition, version?: Version) {
    super(Schema, definition, version, arguments[2])
  }

  discriminate<Schema> (value: any): SchemaHelper.DiscriminateResult<Schema> {
    if (this.discriminator === undefined) {
      throw Error('Unable to discriminate on an object with no discriminator.')
    } else {
      const key = this.discriminator
      const name = value?.[key] ?? ''
      if (name === '') return { key, name, schema: null }

      const swagger = this[Enforcer].findAncestor<Swagger>(Swagger)
      const schema = swagger?.definitions?.[name] ?? null
      return { key, name, schema: schema as unknown as Schema }
    }
  }

  static schemaGenerator (data: Data): ComponentSchema<Definition> {
    return Core.schemaGenerator({
      Discriminator: Discriminator.Discriminator,
      Schema
    }, data)
  }

  static spec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#schema-object'
  }
}
