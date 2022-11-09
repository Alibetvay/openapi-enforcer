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
  IOAuthFlow3,
  IOAuthFlow3Definition,
  IOAuthFlows3,
  IOAuthFlows3Definition,
  OAuthFlow3
} from '../'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.IDefinition<IOAuthFlows3Definition, IOAuthFlows3> | null = null

export class OAuthFlows extends EnforcerComponent implements IOAuthFlows3 {
  [extension: `x-${string}`]: any
  implicit?: IOAuthFlow3
  password?: IOAuthFlow3
  clientCredentials?: IOAuthFlow3
  authorizationCode?: IOAuthFlow3

  constructor (definition: IOAuthFlows3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': false,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#oauth-flows-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#oauth-flows-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#oauth-flows-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#oauth-flows-object'
  }

  static getSchema (_data: ISchemaProcessor): ISchema.IDefinition<IOAuthFlows3Definition, IOAuthFlows3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const implicit: ISchema.IProperty<ISchema.IComponent<IOAuthFlow3Definition, IOAuthFlow3>> = {
      name: 'implicit',
      schema: {
        type: 'component',
        allowsRef: false,
        component: OAuthFlow3
      }
    }

    const password: ISchema.IProperty<ISchema.IComponent<IOAuthFlow3Definition, IOAuthFlow3>> = {
      name: 'password',
      schema: {
        type: 'component',
        allowsRef: false,
        component: OAuthFlow3
      }
    }

    const clientCredentials: ISchema.IProperty<ISchema.IComponent<IOAuthFlow3Definition, IOAuthFlow3>> = {
      name: 'clientCredentials',
      schema: {
        type: 'component',
        allowsRef: false,
        component: OAuthFlow3
      }
    }

    const authorizationCode: ISchema.IProperty<ISchema.IComponent<IOAuthFlow3Definition, IOAuthFlow3>> = {
      name: 'authorizationCode',
      schema: {
        type: 'component',
        allowsRef: false,
        component: OAuthFlow3
      }
    }

    const result: ISchema.IDefinition<IOAuthFlows3Definition, IOAuthFlows3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        implicit,
        password,
        clientCredentials,
        authorizationCode
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IOAuthFlows3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
