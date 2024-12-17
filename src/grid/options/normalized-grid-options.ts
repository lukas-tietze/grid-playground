import { Observable } from 'rxjs';
import { CellValueRenderer, DataTypeNames, HeaderRenderer } from './common';

export type ColumnValueAccessor<TRow extends object, TCell> = (row: TRow) => TCell;

export type NormalizedColumnOptions<TRow extends object> = {
  headerText$: Observable<string>;
  headerRenderer: HeaderRenderer;
  dataType: DataTypeNames;
  valueAccessor: ColumnValueAccessor<TRow, unknown>;
  valueRenderer: CellValueRenderer<TRow, unknown>;
};

export type NormalizedGridOptions<TRow extends object> = {
  columns: NormalizedColumnOptions<TRow>[];
};
