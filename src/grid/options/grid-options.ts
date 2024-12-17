import { Observable } from 'rxjs';

import { OneOf, OneOf3 } from '../../types/one-of';
import { CompareFunction, FormatterFunction, HeaderRenderer } from './common';

export type ColumnHeaderOptions = { name: string | Observable<string> | Promise<string>; renderer?: HeaderRenderer };

export type ColumnValueFormatter<TRow extends object, TCell> = { formatter?: FormatterFunction<TRow, TCell> };
export type ColumnValueStaticFormatter = { format?: string };
// export type ColumnValueRenderer<TRow extends object, TCell> = { renderer?: HeaderRenderer<TRow, TCell> };
export type ColumnValueComparer<TCell> = { comparer?: CompareFunction<TCell> };

export type ColumnValueCommon<TRow extends object, TCell> = {}; //ColumnValueComparer<TCell>;
// OneOf3<ColumnValueFormatter<TRow, TCell>, ColumnValueRenderer<TRow, TCell>, ColumnValueStaticFormatter>;

export type FieldValue<TRow extends object, TKey extends keyof TRow = keyof TRow> = {
  field: TKey;
} & ColumnValueCommon<TRow, TRow[TKey]>;

export type ComputedValue<TRow extends object, TResult = unknown> = {
  computed: (row: TRow) => TResult;
} & ColumnValueCommon<TRow, TResult>;

export type ColumnOptions<TRow extends object> = ColumnHeaderOptions & OneOf<FieldValue<TRow>, ComputedValue<TRow>>;

export type GridOptions<TRow extends object> = {
  columns: ColumnOptions<TRow>[];
};
