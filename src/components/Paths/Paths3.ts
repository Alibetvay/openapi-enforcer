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
import { build, validate, findPathMatches } from './common'
import { IFindPathMatchesOptions, IFindPathMatchesResult } from '../PathItem'
import * as config from '../../global-config'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<I.IPaths3Definition, I.IPaths3> | null = null

const additionalProperties: ISchema.IComponent<I.IPathItem3Definition, I.IPathItem3> = {
  type: 'component',
  allowsRef: false,
  component: I.PathItem3
}

export class Paths extends EnforcerComponent<I.IPaths3Definition> implements I.IPaths3 {
  [S.Extensions]: Record<string, any> = {};
  [key: `/${string}`]: I.IPathItem3

  constructor (definition: I.IPaths3Definition, version?: IVersion) {
    super(definition, version, arguments[2])
    Object.keys(definition).forEach(key => {
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        get () {
          return this[GetProperty](key)
        },
        set (value) {
          this[SetProperty](key, value)
        }
      })
    })
  }

  static id: string = 'PATHS3'

  static spec: IComponentSpec = {
    '2.0': true,
    '3.0.0': 'https://spec.openapis.org/oas/v3.0.0#paths-object',
    '3.0.1': 'https://spec.openapis.org/oas/v3.0.1#paths-object',
    '3.0.2': 'https://spec.openapis.org/oas/v3.0.2#paths-object',
    '3.0.3': 'https://spec.openapis.org/oas/v3.0.3#paths-object'
  }

  static getSchemaDefinition (_data: I.IPathsSchemaProcessor): ISchema.ISchemaDefinition<I.IPaths3Definition, I.IPaths3> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const result: ISchema.ISchemaDefinition<I.IPaths3Definition, I.IPaths3> = {
      type: 'object',
      allowsSchemaExtensions: true,
      additionalProperties
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    result.build = build
    result.validate = validate
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static create (definition?: Partial<I.IPaths3Definition> | Paths | undefined): Paths {
    return new Paths(Object.assign({}, definition) as I.IPaths3Definition)
  }

  static createDefinition (definition?: Partial<I.IPaths3Definition> | undefined): I.IPaths3Definition {
    return Object.assign({}, definition) as I.IPaths3Definition
  }

  static validate (definition: I.IPaths3Definition, version?: IVersion): ExceptionStore {
    return super.validate(definition, version, arguments[2])
  }

  // <!# Custom Content Begin: BODY #!>
  findMatches (path: string, options?: IFindPathMatchesOptions): IFindPathMatchesResult {
    return findPathMatches(this, path,
      config.normalize<IFindPathMatchesOptions>('components.paths.findPathMatches', options) as Required<IFindPathMatchesOptions>)
  }
  // <!# Custom Content End: BODY #!>
}

// <!# Custom Content Begin: FOOTER #!>
// Put your code here.
// <!# Custom Content End: FOOTER #!>
