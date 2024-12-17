import { from, Observable, of } from 'rxjs';

import { ColumnOptions, GridOptions } from './grid-options';
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
    valueAccessor: column.computed ? column.computed : (row) => row[column.field],
  };
}

function createHeaderTextProvider<T extends object>(column: ColumnOptions<T>): Observable<string> {
  return typeof column.name == 'string' ? of(column.name) : isPromise(column.name) ? from(column.name) : column.name;
}

function createHeaderRenderer<T extends object>(column: ColumnOptions<T>): NormalizedColumnOptions<T>['headerRenderer'] {
  return column.renderer ?? defaultHeaderRenderer;
}

const defaultHeaderRenderer: HeaderRenderer = (element: HTMLTableCellElement, text: string) => (element.innerText = text);
