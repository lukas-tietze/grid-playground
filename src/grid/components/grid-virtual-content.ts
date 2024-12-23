import { fromEvent, takeUntil, tap } from 'rxjs';
import { GridState } from '../grid-data';
import { table, tbody, td, tr } from '../util/html-elements';
import { GridContent } from './grid-content';
import { StopWatch } from '../util';
import { GridContentColGroup } from './grid-content-col-group';

type View = {
  rowStart: number;
  rowEnd: number;
  hydratedRowElements: HTMLTableRowElement[];
};

export class GridVirtualContent<T extends object> extends GridContent<T> {
  private _element?: HTMLTableElement;

  private _contentRoot?: HTMLTableSectionElement;

  private colGroup?: GridContentColGroup<T>;

  private _view: View = {
    rowStart: 0,
    rowEnd: 0,
    hydratedRowElements: [],
  };

  constructor(internals: GridState<T>) {
    super(internals);
  }

  public render(root: HTMLTableElement): void {
    this._element = table({
      children: [(this._contentRoot = tbody({}))],
    });

    root.appendChild(this._element);

    this.colGroup = new GridContentColGroup(this.internals);

    this.colGroup.render(this._element);

    this.internals.dataManager.data$
      .pipe(
        tap((data) => this.renderRows(data)),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private renderRows(rows: T[]): void {
    if (!this._contentRoot) {
      return;
    }

    const ws = new StopWatch('grid flat content rendering');
    const existingNodes = Array.from(this._contentRoot.children);

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
      this._contentRoot.appendChild(
        tr({
          class: ['tg-content-row', 'tg-dry'],
          children: this.options.columns.map(() => td({ class: 'tg-cell', text: '\u00A0' })),
        })
      );

      i++;
    }

    fromEvent(this._contentRoot, 'scroll').pipe(takeUntil(this.destroy$)).subscribe();

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
