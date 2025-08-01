import { takeUntil } from 'rxjs';
import { GridState } from '../grid-data';
import { table, tbody, td, tr } from '../util/html-elements';
import { GridContent } from './grid-content';
import { StopWatch } from '../util';

export class GridFlatContent<T extends object> extends GridContent<T> {
  private _element?: HTMLTableElement;

  constructor(internals: GridState<T>) {
    super(internals);
  }

  public render(root: HTMLDivElement): void {
    this._element = table({
      children: [tbody({})],
    });

    root.appendChild(this._element);

    this.internals.dataManager.data$.pipe(takeUntil(this.destroy$)).subscribe((data) => this.renderRows(data));
  }

  private renderRows(rows: T[]): void {
    if (!this._element) {
      return;
    }

    const ws = new StopWatch('grid flat content rendering');

    const rowElements = rows.map((row) => this.renderRow(row));

    this._element.replaceChildren(...rowElements);

    ws.report();
  }

  private renderRow(row: T) {
    return tr({
      class: 'tg-content-row',
      children: this.options.columns.map((col) => {
        const element = td({ class: 'tg-cell' });
        const value = col.valueAccessor(row);

        col.valueRenderer(element, value, {
          dataType: col.dataType,
          row,
          field: 'TODO',
        });

        return element;
      }),
    });
  }
}
