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
import { IExampleSchemaProcessor } from '../IInternalTypes'
import {
  IExample3,
  IExample3Definition
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<IExample3Definition, IExample3> | null = null

export class Example extends EnforcerComponent<IExample3Definition, IExample3> implements IExample3 {
  [extension: `x${string}`]: any

  constructor (definition: IExample3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#example-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#example-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#example-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#example-object'
  }

  static getSchemaDefinition (_data: IExampleSchemaProcessor): ISchema.ISchemaDefinition<IExample3Definition, IExample3> {
    if (cachedSchema !== null) {
      return cachedSchema
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

    const value: ISchema.IProperty<any> = {
      name: 'value',
      schema: {
        type: 'any'
      }
    }

    const externalValue: ISchema.IProperty<ISchema.IString> = {
      name: 'externalValue',
      schema: {
        type: 'string'
      }
    }

    const result: ISchema.ISchemaDefinition<IExample3Definition, IExample3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        summary,
        description,
        value,
        externalValue
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IExample3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  get summary (): string | undefined {
    return this.getProperty('summary')
  }

  set summary (value: string | undefined) {
    this.setProperty('summary', value)
  }

  get description (): string | undefined {
    return this.getProperty('description')
  }

  set description (value: string | undefined) {
    this.setProperty('description', value)
  }

  get value (): any | undefined {
    return this.getProperty('value')
  }

  set value (value: any | undefined) {
    this.setProperty('value', value)
  }

  get externalValue (): string | undefined {
    return this.getProperty('externalValue')
  }

  set externalValue (value: string | undefined) {
    this.setProperty('externalValue', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
