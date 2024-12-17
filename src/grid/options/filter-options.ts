import { CompareFunction } from './common';

export type FilterMode = 'equality' | 'relational' | 'string';

export type FilterOptions<T> = {
  filterModes?: FilterMode;
  comparer?: CompareFunction<T>;
};
