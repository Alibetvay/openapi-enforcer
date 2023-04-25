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

let cachedSchema: ISchema.ISchemaDefinition<I.IInfo3Definition, I.IInfo3> | null = null

interface IValidatorsMap {
  title: ISchema.IProperty<ISchema.IString>
  description: ISchema.IProperty<ISchema.IString>
  termsOfService: ISchema.IProperty<ISchema.IString>
  contact: ISchema.IProperty<ISchema.IComponent<I.IContact3Definition, I.IContact3>>
  license: ISchema.IProperty<ISchema.IComponent<I.ILicense3Definition, I.ILicense3>>
  version: ISchema.IProperty<ISchema.IString>
}

export class Info extends EnforcerComponent<I.IInfo3Definition> implements I.IInfo3 {
  [S.Extensions]: Record<string, any> = {}

  constructor (definition: I.IInfo3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'INFO3'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#info-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#info-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#info-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#info-object'
  }

  static getSchemaDefinition (_data: I.IInfoSchemaProcessor): ISchema.ISchemaDefinition<I.IInfo3Definition, I.IInfo3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const validators = getValidatorsMap()
    const result: ISchema.ISchemaDefinition<I.IInfo3Definition, I.IInfo3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      properties: [
        validators.title,
        validators.description,
        validators.termsOfService,
        validators.contact,
        validators.license,
        validators.version
      ]
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<I.IInfo3Definition> | Info | undefined): Info {
    if (definition instanceof Info) {
      return new Info(Object.assign({}, definition as unknown) as I.IInfo3Definition)
    } else {
      return new Info(Object.assign({
        title: '',
        version: ''
      }, definition) as I.IInfo3Definition)
    }
  }

  static async createAsync (definition?: Partial<I.IInfo3Definition> | Info | string | undefined): Promise<Info> {
    if (definition instanceof Info) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await Loader.loadAsyncAndThrow(definition)
      return this.create(definition as Partial<I.IInfo3Definition>)
    }
  }

  static createDefinition<T extends Partial<I.IInfo3Definition>> (definition?: T | undefined): I.IInfo3Definition & T {
    return Object.assign({
      title: '',
      version: ''
    }, definition) as I.IInfo3Definition & T
  }

  static validate (definition: I.IInfo3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: I.IInfo3Definition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await Loader.loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  get title (): string {
    return this.getProperty('title')
  }

  set title (value: string) {
    this.setProperty('title', value)
  }

  get description (): string | undefined {
    return this.getProperty('description')
  }

  set description (value: string | undefined) {
    this.setProperty('description', value)
  }

  get termsOfService (): string | undefined {
    return this.getProperty('termsOfService')
  }

  set termsOfService (value: string | undefined) {
    this.setProperty('termsOfService', value)
  }

  get contact (): I.IContact3 | undefined {
    return this.getProperty('contact')
  }

  set contact (value: I.IContact3 | undefined) {
    this.setProperty('contact', value)
  }

  get license (): I.ILicense3 | undefined {
    return this.getProperty('license')
  }

  set license (value: I.ILicense3 | undefined) {
    this.setProperty('license', value)
  }

  get version (): string {
    return this.getProperty('version')
  }

  set version (value: string) {
    this.setProperty('version', value)
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

function getValidatorsMap (): IValidatorsMap {
  return {
    title: {
      name: 'title',
      required: true,
      schema: {
        type: 'string'
      }
    },
    description: {
      name: 'description',
      schema: {
        type: 'string'
      }
    },
    termsOfService: {
      name: 'termsOfService',
      schema: {
        type: 'string'
      }
    },
    contact: {
      name: 'contact',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.Contact3
      }
    },
    license: {
      name: 'license',
      schema: {
        type: 'component',
        allowsRef: false,
        component: I.License3
      }
    },
    version: {
      name: 'version',
      required: true,
      schema: {
        type: 'string'
      }
    }
  }
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
