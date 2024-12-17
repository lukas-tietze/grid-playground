export type FormatterFunctionContext<TRow extends object> = {
  row: TRow;
  columnIndex: number;
};

export type HeaderRendererContext = {
  field?: string;
  dataType: DataTypeNames;
};

export type CellValueRendererContext<TRow extends object> = {
  field?: string;
  dataType: DataTypeNames;
  row: TRow;
};

export type FormatterFunction<TRow extends object, TCell> = (value: TCell, context: FormatterFunctionContext<TRow>) => string;
export type HeaderRenderer = (element: HTMLTableCellElement, text: string, context: HeaderRendererContext) => void;
export type CellValueRenderer<TRow extends object, TCell> = (
  element: HTMLTableCellElement,
  value: TCell,
  context: CellValueRendererContext<TRow>
) => void;
export type CompareFunction<T> = (a: T, b: T) => number;

export type DefaultSupportedDataTypes = string | number | boolean | Date;
export type DataTypeNames = 'string' | 'number' | 'boolean' | 'date' | 'other';

export type InferDataTypeName<TCell> = TCell extends string
  ? 'string'
  : TCell extends number
  ? 'number'
  : TCell extends boolean
  ? 'boolean'
  : TCell extends Date
  ? 'date'
  : 'other';
