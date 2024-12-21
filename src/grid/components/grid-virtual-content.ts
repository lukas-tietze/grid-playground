import { fromEvent, takeUntil, tap } from 'rxjs';
import { GridState } from '../grid-data';
import { tbody, td, tr } from '../util/html-elements';
import { GridContent } from './grid-content';
import { StopWatch } from '../util';
import { ro } from '@faker-js/faker';

type View = {
  rowStart: number;
  rowEnd: number;
  hydratedRowElements: HTMLTableRowElement[];
};

export class GridVirtualContent<T extends object> extends GridContent<T> {
  private _element?: HTMLTableSectionElement;

  private _view: View = {
    rowStart: 0,
    rowEnd: 0,
    hydratedRowElements: [],
  };

  constructor(internals: GridState<T>) {
    super(internals);
  }

  public render(root: HTMLTableElement): void {
    this._element = tbody({});

    root.appendChild(this._element);

    this.internals.dataManager.data$
      .pipe(
        tap((data) => this.renderRows(data)),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private renderRows(rows: T[]): void {
    if (!this._element) {
      return;
    }

    const ws = new StopWatch('grid flat content rendering');
    const existingNodes = Array.from(this._element.children);

    //// reset nodes
    let i = 0;

    while (i < existingNodes.length && i < rows.length) {
      existingNodes[i].classList.add('tg-dry');
      existingNodes[i].classList.remove('tg-hydrated');

      i++;
    }

    while (i < existingNodes.length) {
      existingNodes[i].remove();

      i++;
    }

    while (i < rows.length) {
      this._element.appendChild(
        tr({
          class: ['tg-content-row', 'tg-dry'],
          children: this.options.columns.map(() => td({ class: 'tg-cell', text: '\u00A0' })),
        })
      );

      i++;
    }

    fromEvent(this._element, 'scroll').pipe(takeUntil(this.destroy$)).subscribe();

    ws.report();
  }

  private hydrateRow(rowData: T, rowElement: HTMLTableRowElement): void {
    for (let i = 0; i < rowElement.children.length; i++) {
      const td = rowElement.children[i] as HTMLTableCellElement;
      const col = this.options.columns[i];
      const value = col.valueAccessor(rowData);

      col.valueRenderer(td, value, {
        dataType: col.dataType,
        row: rowData,
        field: 'TODO',
      });
    }
  }
}
