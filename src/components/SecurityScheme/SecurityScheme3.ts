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
import * as Loader from '../../Loader'
import * as I from '../IInternalTypes'
import * as S from '../Symbols'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.ISecurityScheme3Definition, I.ISecurityScheme3> | null = null

interface IValidatorsMap {
  type: ISchema.IProperty<ISchema.IString>
  description: ISchema.IProperty<ISchema.IString>
  name: ISchema.IProperty<ISchema.IString>
  _in: ISchema.IProperty<ISchema.IString>
  scheme: ISchema.IProperty<ISchema.IString>
  bearerFormat: ISchema.IProperty<ISchema.IString>
  flows: ISchema.IProperty<ISchema.IComponent<I.IOAuthFlows3Definition, I.IOAuthFlows3>>
  openIdConnectUrl: ISchema.IProperty<ISchema.IString>
}

export class SecurityScheme extends EnforcerComponent<I.ISecurityScheme3Definition> implements I.ISecurityScheme3 {
  [S.Extensions]: Record<string, any> = {}
  public type?: 'apiKey'|'http'|'oauth2'|'openIdConnect'
  public description?: string
  public name?: string
  public in?: 'query'|'header'|'cookie'
  public scheme?: string
  public bearerFormat?: string
  public flows?: I.IOAuthFlows3
  public openIdConnectUrl?: string

  constructor (definition: I.ISecurityScheme3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'SECURITY_SCHEME3'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#security-scheme-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#security-scheme-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#security-scheme-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#security-scheme-object'
  }

  static getSchemaDefinition (_data: I.ISecuritySchemeSchemaProcessor): ISchema.ISchemaDefinition<I.ISecurityScheme3Definition, I.ISecurityScheme3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISchema.ISchemaDefinition<I.ISecurityScheme3Definition, I.ISecurityScheme3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.type,
        validators.description,
        validators.name,
        validators._in,
        validators.scheme,
        validators.bearerFormat,
        validators.flows,
        validators.openIdConnectUrl
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<I.ISecurityScheme3Definition> | SecurityScheme | undefined): SecurityScheme {
    return new SecurityScheme(Object.assign({}, definition) as I.ISecurityScheme3Definition)
  }

  static async createAsync (definition?: Partial<I.ISecurityScheme3Definition> | SecurityScheme | string | undefined): Promise<SecurityScheme> {
    if (definition instanceof SecurityScheme) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await Loader.loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.ISecurityScheme3Definition>)
    }
  }

  static createDefinition<T extends Partial<I.ISecurityScheme3Definition>> (definition?: T | undefined): I.ISecurityScheme3Definition & T {
    return Object.assign({}, definition) as I.ISecurityScheme3Definition & T
  }

  static validate (definition: I.ISecurityScheme3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.ISecurityScheme3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await Loader.loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

function getValidatorsMap (): IValidatorsMap {
  return {
    type: {
      name: 'type',
      schema: {
        type: 'string',
        enum: ['apiKey', 'http', 'oauth2', 'openIdConnect']
      }
    },
    description: {
      name: 'description',
      schema: {
        type: 'string'
      }
    },
    name: {
      name: 'name',
      schema: {
        type: 'string'
      }
    },
    _in: {
      name: 'in',
      schema: {
        type: 'string',
        enum: ['query', 'header', 'cookie']
      }
    },
    scheme: {
      name: 'scheme',
      schema: {
        type: 'string'
      }
    },
    bearerFormat: {
      name: 'bearerFormat',
      schema: {
        type: 'string'
      }
    },
    flows: {
      name: 'flows',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.OAuthFlows3
      }
    },
    openIdConnectUrl: {
      name: 'openIdConnectUrl',
      schema: {
        type: 'string'
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
