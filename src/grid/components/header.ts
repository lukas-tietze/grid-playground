import { Observable, Subscription } from 'rxjs';
import { GridComponent } from '../grid-component';
import { th, thead, tr } from '../util/html-elements';
import { GridInternals } from '../grid-internals';
import { HeaderRenderer } from '../options';

type HeaderCell = {
  element: HTMLTableCellElement;
  sub: Subscription;
};

export class GridHeader<T extends object> extends GridComponent<T> {
  private element?: HTMLTableSectionElement;

  private headerCells: HeaderCell[] = [];

  constructor(internals: GridInternals<T>) {
    super(internals);
  }

  public render(root: HTMLTableElement): void {
    for (const { sub } of this.headerCells) {
      sub.unsubscribe();
    }

    this.headerCells = [];

    for (const col of this.options.columns) {
      const element = th();

      this.headerCells.push({
        element,
        sub: col.headerText$.subscribe((text) =>
          col.headerRenderer(element, text, {
            dataType: col.dataType,
          })
        ),
      });
    }

    this.element = thead({
      children: [
        tr({
          children: this.headerCells.map(({ element }) => element),
          class: 'til-grid-header-row',
        }),
      ],
    });

    root.appendChild(this.element);
  }
}
