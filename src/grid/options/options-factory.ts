import { from, Observable, of } from 'rxjs';

import { ColumnOptions, ColumnValueCommon, GridOptions } from './grid-options';
import { NormalizedColumnOptions, NormalizedGridOptions } from './normalized-grid-options';
import { HeaderRenderer } from './common';
import { isPromise } from 'rxjs/internal/util/isPromise';

export function normalizeGridOptions<T extends object>(options: GridOptions<T>): NormalizedGridOptions<T> {
  console.log(options);

  const normalized: NormalizedGridOptions<T> = {
    columns: options.columns.map(normalizeColumnOptions),
  };

  console.log(normalized);

  return normalized;
}

function normalizeColumnOptions<T extends object>(column: ColumnOptions<T>): NormalizedColumnOptions<T> {
  return {
    headerText$: createHeaderTextProvider(column),
    headerRenderer: createHeaderRenderer(column),
    dataType: 'other',
    valueAccessor: makeValueAccessor(column),
    valueRenderer: makeValueRenderer(column),
  };
}

function makeValueRenderer<T extends object>(column: ColumnValueCommon<T, any>): NormalizedColumnOptions<T>['valueRenderer'] {
  if (column.format) {
    return () => {
      throw new Error('not implemented');
    };
  }

  if (column.formatter) {
    const formatter = column.formatter;

    return (element, value, context) => (element.innerText = formatter(value, { columnIndex: 0, row: context.row }));
  }

  if (column.renderer) {
    return column.renderer;
  }

  return (element, value) => (element.innerText = String(value));
}

function makeValueAccessor<T extends object>(column: ColumnOptions<T>): NormalizedColumnOptions<T>['valueAccessor'] {
  return column.computed ? column.computed : (row) => row[column.field];
}

function createHeaderTextProvider<T extends object>(column: ColumnOptions<T>): Observable<string> {
  return typeof column.name == 'string' ? of(column.name) : isPromise(column.name) ? from(column.name) : column.name;
}

function createHeaderRenderer<T extends object>(column: ColumnOptions<T>): NormalizedColumnOptions<T>['headerRenderer'] {
  return column.headerRenderer ?? defaultHeaderRenderer;
}

const defaultHeaderRenderer: HeaderRenderer = (element: HTMLTableCellElement, text: string) => (element.innerText = text);
