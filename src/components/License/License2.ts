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
import * as S from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.ILicense2Definition, I.ILicense2> | null = null

interface IValidatorsMap {
  name: ISchema.IProperty<ISchema.IString>
  url: ISchema.IProperty<ISchema.IString>
}

const validators: IValidatorsMap = {
  name: {
    name: 'name',
    required: true,
    schema: {
      type: 'string'
    }
  },
  url: {
    name: 'url',
    schema: {
      type: 'string'
    }
  }
}

export class License extends EnforcerComponent<I.ILicense2Definition> implements I.ILicense2 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.ILicense2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'LICENSE2'

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#license-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchemaDefinition (_data: I.ILicenseSchemaProcessor): ISchema.ISchemaDefinition<I.ILicense2Definition, I.ILicense2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<I.ILicense2Definition, I.ILicense2> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.name,
        validators.url
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<I.ILicense2Definition> | License | undefined): License {
    if (definition instanceof License) {
      return new License(Object.assign({}, definition))
    } else {
      return new License(Object.assign({
        name: ""
      }, definition) as I.ILicense2Definition)
    }
  }

  static createDefinition (definition?: Partial<I.ILicense2Definition> | undefined): I.ILicense2Definition {
    return Object.assign({
        name: ""
      }, definition) as I.ILicense2Definition
  }

  static validate (definition: I.ILicense2Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get name (): string {
    return this[GetProperty]('name')
  }

  set name (value: string) {
    this[SetProperty]('name', value)
  }

  get url (): string | undefined {
    return this[GetProperty]('url')
  }

  set url (value: string | undefined) {
    this[SetProperty]('url', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
