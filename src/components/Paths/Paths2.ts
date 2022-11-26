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
import { IPathsSchemaProcessor } from '../IInternalTypes'
import {
  IPathItem2,
  IPathItem2Definition,
  IPaths2,
  IPaths2Definition,
  PathItem2
} from '../'
// <!# Custom Content Begin: HEADER #!>
import { after, findPathMatches } from './common'
import * as config from '../../global-config'
// <!# Custom Content End: HEADER #!>

let cachedSchema: ISchema.ISchemaDefinition<IPaths2Definition, IPaths2> | null = null

export class Paths extends EnforcerComponent<IPaths2Definition, IPaths2> implements IPaths2 {
  [extension: `x${string}`]: any
  [key: `/${string}`]: IPathItem2

  constructor (definition: IPaths2Definition, version?: IVersion) {
    super(definition, version, arguments[2])
  }

  static spec: IComponentSpec = {
    '2.0': 'https://spec.openapis.org/oas/v2.0#paths-object',
    '3.0.0': true,
    '3.0.1': true,
    '3.0.2': true,
    '3.0.3': true
  }

  static getSchemaDefinition (_data: IPathsSchemaProcessor): ISchema.ISchemaDefinition<IPaths2Definition, IPaths2> {
    if (cachedSchema !== null) {
      return cachedSchema
    }

    const additionalProperties: ISchema.IComponent<IPathItem2Definition, IPathItem2> = {
      type: 'component',
      allowsRef: false,
      component: PathItem2
    }

    const result: ISchema.ISchemaDefinition<IPaths2Definition, IPaths2> = {
      type: 'object',
      allowsSchemaExtensions: true,
      additionalProperties
    }

    // <!# Custom Content Begin: SCHEMA_DEFINITION #!>
    result.after = after
    // <!# Custom Content End: SCHEMA_DEFINITION #!>

    cachedSchema = result
    return result
  }

  static validate (definition: IPaths2Definition, version?: IVersion): ExceptionStore {
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
