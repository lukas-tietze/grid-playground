import { from, Observable, of } from 'rxjs';

import { ColumnOptions, GridOptions } from './grid-options';
import { NormalizedColumnOptions, NormalizedGridOptions } from './normalized-grid-options';
import { HeaderRenderer } from './common';
import { isPromise } from 'rxjs/internal/util/isPromise';

export function normalizeGridOptions<T extends object>(options: GridOptions<T>): NormalizedGridOptions<T> {
  console.log(options);

  const columnOptions = options.columns.map(normalizeColumnOptions);

  const normalized: NormalizedGridOptions<T> = {
    columns: columnOptions,
    displayColumns: columnOptions,
    columnsById: new Map(columnOptions.map((o) => [o.id, o])),
  };

  console.log(normalized);

  return normalized;
}

function normalizeColumnOptions<T extends object>(column: ColumnOptions<T>, index: number): NormalizedColumnOptions<T> {
  return {
    id: index.toFixed(),
    headerText$: createHeaderTextProvider(column),
    headerRenderer: createHeaderRenderer(column),
    dataType: 'other',
    valueAccessor: makeValueAccessor(column),
    valueRenderer: makeValueRenderer(column),
    comparer: makeComparer(column),
  };
}

function makeComparer<T extends object>(column: ColumnOptions<T>): NormalizedColumnOptions<T>['comparer'] {
  if (column.comparer) {
    return column.comparer;
  }

  return (a, b) => String(a).localeCompare(String(b));
}

function makeValueRenderer<T extends object>(column: ColumnOptions<T>): NormalizedColumnOptions<T>['valueRenderer'] {
  // if (column.format) {
  //   return () => {
  //     throw new Error('not implemented');
  //   };
  // }
  // if (column.formatter) {
  //   const formatter = column.formatter;
  //   return (element, value, context) => (element.innerText = formatter(value, { columnIndex: 0, row: context.row }));
  // }
  // if (column.renderer) {
  //   return column.renderer;
  // }
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

const defaultHeaderRenderer: HeaderRenderer = (element: HTMLElement, text: string) => (element.innerText = text);
