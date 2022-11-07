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
import { ISchemaProcessor } from '../ISchemaProcessor'
import {
  Example3,
  IExample3,
  IExample3Definition,
  IHeader3,
  IHeader3Definition,
  IMediaType3,
  IMediaType3Definition,
  ISchema3,
  ISchema3Definition,
  MediaType3,
  Schema3
} from '../'
// <!# Custom Content Begin: HEADER #!>

// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.IDefinition<IHeader3Definition, IHeader3> | null = null

export class Header extends EnforcerComponent implements IHeader3 {
  [extension: `x-${string}`]: any
  description?: string
  required?: boolean
  deprecated?: boolean
  allowEmptyValue?: boolean
  style?: 'simple'
  explode?: boolean
  allowReserved?: boolean
  schema?: ISchema3
  example?: any
  examples?: Record<string, IExample3>
  content?: Record<string, IMediaType3>

  constructor (definition: IHeader3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#header-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#header-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#header-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#header-object'
  }

  static getSchema (data: ISchemaProcessor): ISchema.IDefinition<IHeader3Definition, IHeader3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const description: ISchema.IProperty<ISchema.IString> = {
      name: 'description',
      schema: {
        type: 'string'
      }
    }

    const required: ISchema.IProperty<ISchema.IBoolean> = {
      name: 'required',
      schema: {
        type: 'boolean'
      }
    }

    const deprecated: ISchema.IProperty<ISchema.IBoolean> = {
      name: 'deprecated',
      schema: {
        type: 'boolean'
      }
    }

    const allowEmptyValue: ISchema.IProperty<ISchema.IBoolean> = {
      name: 'allowEmptyValue',
      schema: {
        type: 'boolean'
      }
    }

    const style: ISchema.IProperty<any> = {
      name: 'style',
      schema: {
        type: ''simple''
      }
    }

    const explode: ISchema.IProperty<ISchema.IBoolean> = {
      name: 'explode',
      schema: {
        type: 'boolean'
      }
    }

    const allowReserved: ISchema.IProperty<ISchema.IBoolean> = {
      name: 'allowReserved',
      schema: {
        type: 'boolean'
      }
    }

    const schema: ISchema.IProperty<ISchema.IComponent<ISchema3Definition, ISchema3>> = {
      name: 'schema',
      schema: {
        type: 'component',
        allowsRef: true,
        component: Schema3
      }
    }

    const example: ISchema.IProperty<any> = {
      name: 'example',
      schema: {
        type: 'any'
      }
    }

    const examples: ISchema.IProperty<ISchema.IComponent<IExample3Definition, IExample3>> = {
      name: 'examples',
      schema: {
        type: 'component',
        allowsRef: true,
        component: Example3
      }
    }

    const content: ISchema.IProperty<ISchema.IComponent<IMediaType3Definition, IMediaType3>> = {
      name: 'content',
      schema: {
        type: 'component',
        allowsRef: false,
        component: MediaType3
      }
    }

    const schema: ISchema.IDefinition<IHeader3Definition, IHeader3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        description,
        required,
        deprecated,
        allowEmptyValue,
        style,
        explode,
        allowReserved,
        schema,
        example,
        examples,
        content
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = schema
    return schema
  }

  static validate (definition: IHeader3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>

// <!# Custom Content End: FOOTER #!>
