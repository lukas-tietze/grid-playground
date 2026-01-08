import { debounceTime, fromEvent, startWith, Subscription, takeUntil, tap } from 'rxjs';
import { GridState } from '../grid-data';
import { tbody, td, tr } from '../util/html-elements';
import { GridContent } from './grid-content';
import { StopWatch } from '../util';

type View = {
  rowStart: number;
  rowEnd: number;
  hydratedRowElements: HTMLTableRowElement[];
};

/**
 * Paints all required rows, but only renders data to those rows that are currently visible in the viewport.
 */
export class GridVirtualRowContent<T extends object> extends GridContent<T> {
  private _element?: HTMLTableSectionElement;

  private _data: T[] = [];

  private _view: View = {
    rowStart: 0,
    rowEnd: 0,
    hydratedRowElements: [],
  };

  private _scrollSubscription?: Subscription;

  constructor(internals: GridState<T>) {
    super(internals);
  }

  public render(root: HTMLTableElement): void {
    this._element = tbody({});

    root.appendChild(this._element);

    this.internals.dataManager.data$
      .pipe(
        tap((data) => {
          this._data = data;
          this.renderRows();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private renderRows(): void {
    if (!this._element) {
      return;
    }

    const sw = new StopWatch('grid virtual content rendering');
    const existingNodes = Array.from(this._element.children);

    //// reset nodes
    let i = 0;

    while (i < existingNodes.length && i < this._data.length) {
      existingNodes[i].classList.add('tg-dry');
      existingNodes[i].classList.remove('tg-hydrated');

      i++;
    }

    while (i < existingNodes.length) {
      existingNodes[i].remove();

      i++;
    }

    while (i < this._data.length) {
      this._element.appendChild(
        tr({
          class: ['tg-content-row', 'tg-dry'],
          children: this.options.columns.map(() => td({ class: 'tg-cell', text: '\u00A0' })),
        })
      );

      i++;
    }

    this._scrollSubscription?.unsubscribe();
    this._scrollSubscription = fromEvent(this.scrollRoot(), 'scroll', { passive: true })
      .pipe(debounceTime(10), startWith(1), takeUntil(this.destroy$))
      .subscribe(() => this.updateView());

    sw.report();
  }

  private scrollRoot(): HTMLElement {
    const scrollRoot = this._element?.parentElement?.parentElement;

    if (!scrollRoot) {
      throw new Error('Unable to find scrollable root element for virtual content');
    }

    return scrollRoot;
  }

  private updateView(): void {
    if (!this._element) {
      return;
    }

    const renderRange = this.getRenderRowRange();

    const sw = new StopWatch(`grid virtual content updating view for rows: ${renderRange.start} - ${renderRange.end}`);

    if (renderRange.start === this._view.rowStart && renderRange.end === this._view.rowEnd) {
      console.log('No changes in render range, skipping view update');

      sw.report();

      return;
    }

    if (renderRange.start < this._view.rowStart) {
      for (let i = renderRange.start; i < this._view.rowStart; i++) {
        const rowElement = this._element.children[i] as HTMLTableRowElement;

        this.hydrateRow(this._data[i], rowElement);

        this._view.hydratedRowElements.push(rowElement);
      }
    } else {
      const removed = this._view.hydratedRowElements.splice(0, this._view.rowStart - renderRange.start);

      for (const rowElement of removed) {
        this.clearRow(rowElement);
      }
    }

    if (renderRange.end > this._view.rowEnd) {
      for (let i = this._view.rowEnd; i < renderRange.end; i++) {
        const rowElement = this._element.children[i] as HTMLTableRowElement;

        this.hydrateRow(this._data[i], rowElement);

        this._view.hydratedRowElements.push(rowElement);
      }
    } else {
      const removeCount = this._view.rowEnd - renderRange.end;
      const startIndex = this._view.hydratedRowElements.length - removeCount;

      const removed = this._view.hydratedRowElements.splice(startIndex, removeCount);

      for (const rowElement of removed) {
        this.clearRow(rowElement);
      }
    }

    sw.report();
  }

  private getRenderRowRange(): { start: number; end: number } {
    const visibleRange = this.getVisibleRowRange();
    const buffer = 5; /// Should be an option

    const start = Math.max(0, visibleRange.start - buffer);
    const end = Math.min(this._data.length, visibleRange.end + buffer);

    return { start, end };
  }

  private getVisibleRowRange(): { start: number; end: number } {
    const element = this.scrollRoot();

    const scrollTop = element.scrollTop;
    const clientHeight = element.clientHeight;
    const rowHeight = this.options.rowHeight;

    const start = Math.floor(scrollTop / rowHeight);
    const end = Math.min(this._data.length, start + Math.ceil(clientHeight / rowHeight));

    return { start, end };
  }

  private clearRow(rowElement: HTMLTableRowElement): void {
    for (let i = 0; i < rowElement.children.length; i++) {
      const td = rowElement.children[i] as HTMLTableCellElement;
      td.textContent = '\u00A0';
    }

    rowElement.classList.remove('tg-hydrated');
    rowElement.classList.add('tg-dry');
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

    rowElement.classList.remove('tg-dry');
    rowElement.classList.add('tg-hydrated');
  }
}
