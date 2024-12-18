export type FilterOpCommon<T extends string> = {
  type: T;
};

export type FilterOpEqual = FilterOpCommon<'equal'> & {
  compareValue: unknown;
};

export type FilterOpNotEqual = FilterOpCommon<'not-equal'> & {
  compareValue: unknown;
};

export type Filter = {
  columnId: string;
} & (FilterOpEqual | FilterOpNotEqual);

export type OrderDirection = 'ascending' | 'descending';

export type Ordering = {
  columnId: string;
  mode: OrderDirection;
};

export type Pagination = {
  offset: number;
  count: number;
};

export type Query = {
  filters: Filter[];
  ordering: Ordering[];
  pagination?: Pagination;
};
