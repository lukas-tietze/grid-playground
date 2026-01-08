import { from, noop, Observable, of } from 'rxjs';

import { ColumnOptions, GridOptions, VirtualizationOptions } from './grid-options';
import { NormalizedColumnOptions, NormalizedGridOptions, NormalizedVirtualizationOptions } from './normalized-grid-options';
import { HeaderRenderer } from './common';
import { isPromise } from 'rxjs/internal/util/isPromise';
import { universalFormatFunction } from './default-formatter';

const defaultHeaderRenderer: HeaderRenderer = (element: HTMLElement, text: string) => (element.innerText = text);

export function normalizeGridOptions<T extends object>(options: GridOptions<T>): NormalizedGridOptions<T> {
  console.log(options);

  const columnOptions = options.columns.map(normalizeColumnOptions);

  const normalized: NormalizedGridOptions<T> = {
    columns: columnOptions,
    columnsById: new Map(columnOptions.map((o) => [o.id, o])),
    virtualization: makeVirtualizationOptions(options.virtualization),
    rowHeight: options.rowHeight ?? 30,
  };

  console.log(normalized);

  return normalized;
}

function normalizeColumnOptions<T extends object>(column: ColumnOptions<T>, index: number): NormalizedColumnOptions<T> {
  return {
    id: index.toFixed(),
    field: column.field ?? '[computed]',
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
  if ('format' in column && column.format) {
    return (element, value) => {
      element.innerText = universalFormatFunction(value);
    };
  }

  if ('formatter' in column && column.formatter) {
    const formatter = column.formatter;

    return (element, value, context) => {
      element.innerText = formatter(value, { columnIndex: 0, row: context.row });
    };
  }

  if ('renderer' in column && column.renderer) {
    return column.renderer;
  }

  return (element, value) => {
    element.innerText = String(value);
  };
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

function makeVirtualizationOptions(virtualization: VirtualizationOptions | undefined): NormalizedVirtualizationOptions {
  if (typeof virtualization === 'boolean') {
    return { enabled: virtualization, viewSize: 50 };
  }

  return {
    enabled: virtualization?.enabled ?? false,
    viewSize: virtualization?.viewSize ?? 50,
  };
}
