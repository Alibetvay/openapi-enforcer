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
import { IXmlSchemaProcessor } from '../IInternalTypes'
import {
  IXml3,
  IXml3Definition
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<IXml3Definition, IXml3> | null = null

interface IValidatorsMap {
  name: ISchema.IProperty<ISchema.IString>
  namespace: ISchema.IProperty<ISchema.IString>
  prefix: ISchema.IProperty<ISchema.IString>
  attribute: ISchema.IProperty<ISchema.IBoolean>
  wrapped: ISchema.IProperty<ISchema.IBoolean>
}

const validators: IValidatorsMap = {
  name: {
    name: 'name',
    schema: {
      type: 'string'
    }
  },
  namespace: {
    name: 'namespace',
    schema: {
      type: 'string'
    }
  },
  prefix: {
    name: 'prefix',
    schema: {
      type: 'string'
    }
  },
  attribute: {
    name: 'attribute',
    schema: {
      type: 'boolean'
    }
  },
  wrapped: {
    name: 'wrapped',
    schema: {
      type: 'boolean'
    }
  }
}

export class Xml extends EnforcerComponent<IXml3Definition, IXml3> implements IXml3 {
  [extension: `x${string}`]: any

  constructor (definition: IXml3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static id: string = 'XML3'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#xml-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#xml-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#xml-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#xml-object'
  }

  static getSchemaDefinition (_data: IXmlSchemaProcessor): ISchema.ISchemaDefinition<IXml3Definition, IXml3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<IXml3Definition, IXml3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.name,
        validators.namespace,
        validators.prefix,
        validators.attribute,
        validators.wrapped
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IXml3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get name (): string | undefined {
    return this.getProperty('name')
  }

  set name (value: string | undefined) {
    this.setProperty('name', value)
  }

  get namespace (): string | undefined {
    return this.getProperty('namespace')
  }

  set namespace (value: string | undefined) {
    this.setProperty('namespace', value)
  }

  get prefix (): string | undefined {
    return this.getProperty('prefix')
  }

  set prefix (value: string | undefined) {
    this.setProperty('prefix', value)
  }

  get attribute (): boolean | undefined {
    return this.getProperty('attribute')
  }

  set attribute (value: boolean | undefined) {
    this.setProperty('attribute', value)
  }

  get wrapped (): boolean | undefined {
    return this.getProperty('wrapped')
  }

  set wrapped (value: boolean | undefined) {
    this.setProperty('wrapped', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
