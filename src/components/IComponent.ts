import { IExceptionLevel } from '../Exception/IException'
import { ExceptionStore } from '../Exception/ExceptionStore'
// import { ISchemaProcessor } from './ISchemaProcessor'
// import { IDefinition } from './IComponentSchema'
export { IExceptionLevel } from '../Exception/IException'
export { ExceptionStore } from '../Exception/ExceptionStore'

// export interface IComponentClass<Definition, ComponentInstance> {
//   new (definition: Definition, version?: IVersion, data?: ISchemaProcessor): ComponentInstance
//   getSchema: (data: ISchemaProcessor<Definition, ComponentInstance>) => IDefinition<Definition, ComponentInstance>
//   spec: IComponentSpec
//   validate: (definition: any, version?: IVersion, data?: ISchemaProcessor<Definition, ComponentInstance>) => ExceptionStore
// }

// This is the base component interface. All other component interfaces inherit from this.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IComponentInstance {
  cached: <T>(id: string, callback: (...p: any[]) => T, ...params: any[]) => T
  clearCache: (id: string) => void
  watchProperty: <T>(key: string, handler: (newValue: T, oldValue: T) => void) => void
}

// if an openapi extension of x-enforcer is found then the value will have this interface
export interface IEnforcerExtensionDefinition {
  exceptions?: Record<string, IExceptionLevel> // the key is the id to modify the level on and the value is the new level
  nullable?: boolean
}

// string is reference to spec, true means it's supported but not by this version of the component
// false means that the component is not supported for this version
export type IComponentSpec = Record<IVersion, string | boolean>

export type IVersion = '2.0' | '3.0.0' | '3.0.1' | '3.0.2' | '3.0.3'
