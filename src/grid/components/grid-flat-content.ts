import { takeUntil } from 'rxjs';
import { GridInternals } from '../grid-internals';
import { tbody, td, tr } from '../util/html-elements';
import { GridContent } from './grid-content';
import { StopWatch } from '../util';

export class GridFlatContent<T extends object> extends GridContent<T> {
  private element?: HTMLTableSectionElement;

  constructor(internals: GridInternals<T>) {
    super(internals);
  }

  public render(root: HTMLTableElement): void {
    this.element = tbody({});

    root.appendChild(this.element);

    this.internals.query$.pipe(
      switchMap(),
      takeUntil(this.destroy$)).subscribe((data) => this.renderRows(data));
  }

  private renderRows(rows: T[]): void {
    if (!this.element) {
      return;
    }

    const ws = new StopWatch('grid flat content rendering');

    const rowElements = rows.map((row) => this.renderRow(row));

    this.element.replaceChildren(...rowElements);

    ws.report();
  }

  private renderRow(row: T) {
    return tr({
      class: 'til-grid-content-row',
      children: this.options.columns.map((col) => {
        const element = td({ class: 'til-grid-cell' });
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
