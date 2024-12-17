import { ExplicitOptionals } from './explicit-optionals';

type CommonProperties<T1 extends object, T2 extends object> = ExplicitOptionals<{
  [K in keyof T1 & keyof T2]: T1[K] | T2[K];
}>;

type ExclusiveProperties<T1 extends object, T2 extends object> = {
  [K1 in keyof T1 as Exclude<K1, keyof T2>]: T1[K1];
} & {
  [K2 in keyof T2 as Exclude<K2, keyof T1>]+?: never;
};

export type OneOf<T1 extends object, T2 extends object> = CommonProperties<T1, T2> &
  (ExclusiveProperties<T1, T2> | ExclusiveProperties<T2, T1>);

export type OneOf3<T1 extends object, T2 extends object, T3 extends object> = OneOf<OneOf<T1, T2>, T3>;
