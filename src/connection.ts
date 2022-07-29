import { Target } from "./deps.ts";
export const CONNECTOR_OPTIONS_SYMBOL = Symbol();

export interface ConnectionConstructor<Opts> {
  new (options?: Opts): Connection<Opts>;
}

export interface Connection<Opts> {
  connect(): Promise<Connection<Opts>>;
}

export function DefineConnectionOptions<Opts>(options: Opts) {
  return function (target: Target, propertyKey: string) {
    return Reflect.defineMetadata(
      CONNECTOR_OPTIONS_SYMBOL,
      options,
      target,
      propertyKey,
    );
  };
}
