import { Observable } from 'rxjs';
import { CellValueRenderer, CompareFunction, DataTypeNames, HeaderRenderer } from './common';

export type ColumnValueAccessor<TRow extends object, TCell> = (row: TRow) => TCell;

export type NormalizedColumnOptions<TRow extends object> = {
  id: string;
  headerText$: Observable<string>;
  headerRenderer: HeaderRenderer;
  dataType: DataTypeNames;
  valueAccessor: ColumnValueAccessor<TRow, unknown>;
  valueRenderer: CellValueRenderer<TRow, unknown>;
  comparer: CompareFunction<unknown>;
};

export type NormalizedGridOptions<TRow extends object> = {
  columns: NormalizedColumnOptions<TRow>[];
  displayColumns: NormalizedColumnOptions<TRow>[];
  columnsById: Map<string, NormalizedColumnOptions<TRow>>;
};
