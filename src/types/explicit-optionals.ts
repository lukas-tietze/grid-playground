export type ExplicitOptionals<T extends object> = {
  [Key in keyof T as T[Key] extends undefined | null ? never : Key]: T[Key];
} & {
  [Key in keyof T as T[Key] extends undefined | null ? Key : never]+?: T[Key];
};
