import { debounceTime, fromEvent, Subscription, takeUntil, tap } from 'rxjs';
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

  private _colGroup?: GridContentColGroup<T>;

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
    this._element = table({
      children: [(this._contentRoot = tbody({}))],
    });

    root.appendChild(this._element);

    this._colGroup = new GridContentColGroup(this.internals);

    this._colGroup.render(this._element);

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

    const sw = new StopWatch('grid virtual content rendering');
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

    this._scrollSubscription?.unsubscribe();
    this._scrollSubscription = fromEvent(this._contentRoot, 'scroll', { passive: true })
      .pipe(
        debounceTime(10),
        takeUntil(this.destroy$))
      .subscribe(() => this.updateView());

    sw.report();
  }

  private updateView(): void {

  }

  private getVisibleRowRange(): { start: number; end: number } {
    if (!this._contentRoot) {
      return { start: 0, end: 0 };
    }

    const scrollTop = this._contentRoot.scrollTop;
    const clientHeight = this._contentRoot.clientHeight;
    const rowHeight = this.options.rowHeight || 30;
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
