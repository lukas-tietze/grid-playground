import { ro } from '@faker-js/faker';
import { GridState } from '../grid-data';
import { ColumnOptions, NormalizedColumnOptions } from '../options';
import { td, tr } from '../util';
import { VirtualCellState, VirtualRowState } from './types';

export function clearRow(row: VirtualRowState): void {
  for (const cell of row.cells) {
    cell.disposeCallback?.();
    cell.disposeCallback = undefined;
  }

  row.element.classList.remove('tg-hydrated');
  row.element.classList.add('tg-dry');
}

export function createRow<T extends object>(rowData: T, internals: GridState<T>, element?: HTMLTableRowElement): VirtualRowState {
  const rowElement = element || tr({ class: ['tg-content-row', 'tg-dry'] });
  const rowState: VirtualRowState = {
    rowValue: rowData,
    cells: [],
    element: rowElement,
  };

  if (rowElement.childElementCount !== internals.options.columns.length) {
    rowElement.replaceChildren(...internals.options.columns.map(() => td({ class: 'tg-cell', text: '\u00A0' })));
  }

  for (let i = 0; i < internals.options.columns.length; i++) {
    const col = internals.options.columns[i];
    const tdElement = rowElement.children[i] as HTMLTableCellElement;

    const value = col.valueAccessor(rowData);

    const disposeCallback =
      col.valueRenderer(tdElement, value, {
        dataType: col.dataType,
        row: rowData,
        field: col.field,
      }) || undefined;

    rowState.cells.push({
      cellValue: value,
      field: col.field,
      disposeCallback,
    });
  }

  rowElement.classList.remove('tg-dry');
  rowElement.classList.add('tg-hydrated');

  return rowState;
}
