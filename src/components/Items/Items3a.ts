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

/* eslint-disable import/no-duplicates */
import { IComponentSpec, IVersion } from '../IComponent'
import { ExceptionStore } from '../../Exception/ExceptionStore'
import { ISDSchemaDefinition } from '../../ComponentSchemaDefinition/IComponentSchemaDefinition'
import { loadAsync, loadAsyncAndThrow } from '../../Loader'
import { Items as ItemsBase } from './Items'
import { IItems3a, IItems3aDefinition, IItems3aSchemaProcessor } from './IItems'
// <!# Custom Content Begin: HEADER #!>
// Put your code here.
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISDSchemaDefinition<IItems3aDefinition, IItems3a> | null = null

export class Items extends ItemsBase implements IItems3a {
  public extensions: Record<string, any> = {}

  constructor (definition: IItems3aDefinition, version?: IVersion) {
    super(definition, version, arguments[2])
    // <!# Custom Content Begin: CONSTRUCTOR #!>
    // Put your code here.
    // <!# Custom Content End: CONSTRUCTOR #!>
  }

  static id: string = 'ITEMS3A'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': false,
    '3.0.1': false,
    '3.0.2': false,
    '3.0.3': false,
    '3.1.0': 'https://spec.openapis.org/oas/v3.1.0#items-object'
  }

  static getSchemaDefinition (_data: IItems3aSchemaProcessor): ISDSchemaDefinition<IItems3aDefinition, IItems3a> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISDSchemaDefinition<IItems3aDefinition, IItems3a> = {
      type: 'object',
      allowsSchemaExtensions: true
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    // Put your code here.
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<IItems3aDefinition> | Items | undefined): Items {
    return new Items(Object.assign({}, definition) as IItems3aDefinition)
  }

  static async createAsync (definition?: Partial<IItems3aDefinition> | Items | string | undefined): Promise<Items> {
    if (definition instanceof Items) {
      return await this.createAsync(Object.assign({}, definition))
    } else {
      if (definition !== undefined) definition = await loadAsyncAndThrow(definition)
      return this.create(definition as Partial<IItems3aDefinition>)
    }
  }

  static createDefinition<T extends Partial<IItems3aDefinition>> (definition?: T | undefined): IItems3aDefinition & T {
    return Object.assign({}, definition) as IItems3aDefinition & T
  }

  static validate (definition: IItems3aDefinition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  static async validateAsync (definition: IItems3aDefinition | string, version?: IVersion): Promise<ExceptionStore> {
    const result = await loadAsync(definition)
    if (result.error !== undefined) return result.exceptionStore as ExceptionStore
    return super.validate(result.value, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  // Put your code here.
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: AFTER_COMPONENT #!>
// Put your code here.
// <!# Custom Content End: AFTER_COMPONENT #!>

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
