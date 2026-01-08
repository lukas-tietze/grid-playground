import { Observable } from 'rxjs';
import { CellValueRenderer, CompareFunction, DataTypeNames, HeaderRenderer } from './common';

export type ColumnValueAccessor<TRow extends object, TCell> = (row: TRow) => TCell;

export type NormalizedColumnOptions<TRow extends object> = {
  id: string;
  field: string;
  headerText$: Observable<string>;
  headerRenderer: HeaderRenderer;
  dataType: DataTypeNames;
  valueAccessor: ColumnValueAccessor<TRow, any>;
  valueRenderer: CellValueRenderer<TRow, any>;
  comparer: CompareFunction<any>;
};

export type NormalizedVirtualizationOptions = {
  enabled: boolean;
  viewSize: number;
};

export type NormalizedGridOptions<TRow extends object> = {
  /**
   * Options for the columns to be displayed in the grid.
   */
  columns: NormalizedColumnOptions<TRow>[];

  /**
   * Mapping of column IDs to their respective options.
   */
  columnsById: Map<string, NormalizedColumnOptions<TRow>>;

  /**
   * Virtualization options for the grid.
   * Object is set even if virtualization is disabled.
   */
  virtualization: NormalizedVirtualizationOptions;

  /**
   * Fixed height for each row in pixels.
   */
  rowHeight: number;
};
