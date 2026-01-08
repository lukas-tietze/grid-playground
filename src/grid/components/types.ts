export interface VirtualViewState {
  rowStart: number;
  rowEnd: number;
  rows: VirtualRowState[];
}

export interface VirtualRowState {
  rowValue: object;
  cells: VirtualCellState[];
  element: HTMLTableRowElement;
}

export interface VirtualCellState {
  cellValue: unknown;
  field: string;
  disposeCallback?: () => void;
}
