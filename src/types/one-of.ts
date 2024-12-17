export type OneOf<T1 extends object, T2 extends object> = {
  [K in keyof T1 & keyof T2]: T1[K] | T2[K];
} & (
  | ({
      [K1 in Exclude<keyof T1, keyof T2>]: T1[K1];
    } & {
      [K2 in Exclude<keyof T2, keyof T1>]+?: never;
    })
  | ({
      [K2 in Exclude<keyof T2, keyof T1>]: T2[K2];
    } & {
      [K1 in Exclude<keyof T1, keyof T2>]+?: never;
    })
);

export type OneOf3<T1 extends object, T2 extends object, T3 extends object> = OneOf<OneOf<T1, T2>, T3>;
