import { GridComponent } from '../grid-component';
import { table, thead, tr } from '../util/html-elements';
import { GridState } from '../grid-data';
import { HeaderCell } from './header-cell';

export class GridHeader<T extends object> extends GridComponent<T> {
  private element?: HTMLTableElement;

  private headerCells: HeaderCell<T>[] = [];

  constructor(internals: GridState<T>) {
    super(internals);
  }

  public render(root: HTMLDivElement): void {
    for (const cell of this.headerCells) {
      cell.dispose();
    }

    this.headerCells = [];

    const row = tr({
      class: 'tg-header-row',
    });

    for (const col of this.options.columns) {
      const cell = new HeaderCell(this.internals, col.id);

      this.headerCells.push(cell);

      cell.render(row);
    }

    this.element = table({
      class: 'tg-header',
      children: [
        thead({
          children: [row],
        }),
      ],
    });

    root.appendChild(this.element);
  }
}
