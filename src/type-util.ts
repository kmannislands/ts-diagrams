/**
 * Used to ensure that switch/if blocks are exhaustive over a union at compile-time.
 *
 * Errors of this type are never expected to be thrown at runtime. They represent a mismatch in compile-time
 * guarantees and runtime behavior so something really funky is going on if you land here
 *
 * @todo Pass error message template in generically?
 */
export function assertUnreachable(unreachableValue: never): never {
  throw new Error(`Unreachable: diagram type ${String(unreachableValue)}`);
}

/**
 * Used to provide a narrower type than string that is still string compatible. Ie: to differentiate amongst
 * different types that are assignable to string based on some other semantic value.
 */
export type BrandedStr<Brand extends string> = string & { __brand: Brand };

declare global {
  interface ObjectConstructor {
    /**
     * Returns an object created by key-value entries for properties and methods
     * @param entries An iterable object that contains key-value entries for properties and methods.
     */
    fromEntries<ValueType = any, KeyType extends string = string>(
      entries: Iterable<readonly [KeyType, ValueType]>
    ): { [k in KeyType]: ValueType };
  }
}
