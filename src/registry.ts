import { Connection, CONNECTOR_OPTIONS_SYMBOL } from "./connection.ts";

export abstract class Registry<T extends new () => any> {
  [key: string]: Connection<any> | Function

  public async connect(
    this: InstanceType<T>,
    key: keyof T,
  ): Promise<Connection<any>> {
    const options = Reflect.getMetadata(
      CONNECTOR_OPTIONS_SYMBOL,
      this.constructor,
      key as string,
    );
    this[key as string] =
      await ((this.constructor as unknown as T)[key] as unknown as Function)(
        options,
      );
    return this[key as string].connect();
  }

  public connectInParallel(this: InstanceType<T>) {
    return Promise.all(
      Object.keys(this.constructor).map((key: string) =>
        this.connect(key as keyof T)
      ),
    );
  }

  public async connectInSeries(this: InstanceType<T>) {
    for (const key of Object.keys(this.constructor)) {
      await this.connect(key as keyof T);
    }
  }

  public get(
    this: InstanceType<T>,
    key: keyof T,
  ): ReturnType<T[keyof T] & ((...args: any) => any)> {
    return this[key as string];
  }
}
