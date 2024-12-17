import { Observable } from 'rxjs';

import { OneOf, OneOf3 } from '../../types/one-of';
import { CellValueRenderer, CompareFunction, FormatterFunction, HeaderRenderer } from './common';
import { ExplicitOptionals } from '../../types/explicit-optionals';

export type ColumnHeaderOptions = { name: string | Observable<string> | Promise<string>; renderer?: HeaderRenderer };

export type ColumnValueFormatter<TRow extends object, TCell> = { formatter?: FormatterFunction<TRow, TCell> };
export type ColumnValueStaticFormatter = { format?: string };
export type ColumnValueRenderer<TRow extends object, TCell> = { renderer?: CellValueRenderer<TRow, TCell> };
export type ColumnValueComparer<TCell> = { comparer?: CompareFunction<TCell> };

export type ColumnValueCommon<TRow extends object, TCell> = ExplicitOptionals<
  OneOf3<ColumnValueFormatter<TRow, TCell>, ColumnValueRenderer<TRow, TCell>, ColumnValueStaticFormatter>
>;

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
