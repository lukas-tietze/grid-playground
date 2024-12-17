import { Observable } from 'rxjs';
import { DataType, HeaderRenderer } from './common';

export type ColumnValueAccessor<TRow extends object, TCell> = (row: TRow) => TCell;

export type NormalizedColumnOptions<TRow extends object> = {
  headerText$: Observable<string>;
  headerRenderer: HeaderRenderer;
  dataType: DataType;
  valueAccessor: ColumnValueAccessor<TRow, unknown>;
};

export type NormalizedGridOptions<TRow extends object> = {
  columns: NormalizedColumnOptions<TRow>[];
};
