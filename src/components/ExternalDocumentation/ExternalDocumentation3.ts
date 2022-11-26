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
import { IExternalDocumentationSchemaProcessor } from '../IInternalTypes'
import {
  IExternalDocumentation3,
  IExternalDocumentation3Definition
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<IExternalDocumentation3Definition, IExternalDocumentation3> | null = null

export class ExternalDocumentation extends EnforcerComponent<IExternalDocumentation3Definition, IExternalDocumentation3> implements IExternalDocumentation3 {
  [extension: `x${string}`]: any

  constructor (definition: IExternalDocumentation3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#external-documentation-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#external-documentation-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#external-documentation-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#external-documentation-object'
  }

  static getSchemaDefinition (_data: IExternalDocumentationSchemaProcessor): ISchema.ISchemaDefinition<IExternalDocumentation3Definition, IExternalDocumentation3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const description: ISchema.IProperty<ISchema.IString> = {
      name: 'description',
      schema: {
        type: 'string'
      }
    }

    const url: ISchema.IProperty<ISchema.IString> = {
      name: 'url',
      required: true,
      schema: {
        type: 'string'
      }
    }

    const result: ISchema.ISchemaDefinition<IExternalDocumentation3Definition, IExternalDocumentation3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        description,
        url
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IExternalDocumentation3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get description (): string | undefined {
    return this.getProperty('description')
  }

  set description (value: string | undefined) {
    this.setProperty('description', value)
  }

  get url (): string {
    return this.getProperty('url')
  }

  set url (value: string) {
    this.setProperty('url', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
