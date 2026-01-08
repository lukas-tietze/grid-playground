import { Observable } from 'rxjs';

import { OneOf, OneOf3 } from '../../types/one-of';
import { CellValueRenderer, CompareFunction, FormatterFunction, HeaderRenderer } from './common';
import { ExplicitOptionals } from '../../types/explicit-optionals';

export type ColumnValueComparer<TCell> = { comparer?: CompareFunction<TCell> };

export type ColumnHeaderOptions = { name: string | Observable<string> | Promise<string>; headerRenderer?: HeaderRenderer };

export type ColumnValueFormatter<TRow extends object, TCell> = { formatter?: FormatterFunction<TRow, TCell> };
export type ColumnValueStaticFormatter = { format?: string };
export type ColumnValueRenderer<TRow extends object, TCell> = { renderer?: CellValueRenderer<TRow, TCell> };

export type ColumnValueCommon<TRow extends object, TCell> = ExplicitOptionals<
  OneOf3<ColumnValueFormatter<TRow, TCell>, ColumnValueStaticFormatter, ColumnValueRenderer<TRow, TCell>>
> &
  ColumnValueComparer<TCell>;

export type FieldValue<TRow extends object, TKey extends keyof TRow = keyof TRow> = {
  field: TKey & string;
} & ColumnValueCommon<TRow, TRow[TKey]>;

export type ComputedValue<TRow extends object, TResult = unknown> = {
  computed: (row: TRow) => TResult;
} & ColumnValueCommon<TRow, TResult>;

export type ColumnOptions<TRow extends object> = ColumnHeaderOptions & OneOf<FieldValue<TRow>, ComputedValue<TRow>>;

export type VirtualizationOptions =
  | boolean
  | {
      enabled: boolean;
      viewSize: number;
    };

export type GridOptions<TRow extends object> = {
  /**
   * Options for the columns to be displayed in the grid.
   */
  columns: ColumnOptions<TRow>[];

  /**
   * Options for virtualization of the grid.
   * Improves performance for large datasets by only rendering visible rows.
   */
  virtualization?: VirtualizationOptions;

  /**
   * Sets the fixed height for each row in pixels.
   * Defaults to 30 if not specified.
   */
  rowHeight?: number;
};
