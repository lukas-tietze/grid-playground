import './header-cell.scss';

import { filter, finalize, fromEvent, map, merge, Subscription, switchMap, take, takeUntil, tap } from 'rxjs';
import { GridComponent } from '../grid-component';
import { GridState } from '../grid-state';
import { ColumnId } from '../options';
import { button, div, th } from '../util';
import { Filter, Ordering } from '../data/query';
import { ColumnMenu } from './column-menu';

export class HeaderCell<T extends object> extends GridComponent<T> {
  private _element?: HTMLTableCellElement;

  private _colId: ColumnId;

  private _ordering: Ordering | undefined;

  private _filter: Filter | undefined;

  private _columnMenu?: ColumnMenu<T>;

  constructor(state: GridState<T>, colId: ColumnId) {
    super(state);

    this._colId = colId;
  }

  public get ordering(): Ordering | undefined {
    return this._ordering;
  }

  public get filter(): Filter | undefined {
    return this._filter;
  }

  public get element(): HTMLTableCellElement {
    if (!this._element) {
      throw new Error('HeaderCell element not rendered yet.');
    }

    return this._element;
  }

  public get colId(): ColumnId {
    return this._colId;
  }

  public render(parent: HTMLTableRowElement) {
    const col = this.internals.getColumnById(this._colId);

    const textElement = div({ class: 'tg-column-title' });
    const orderingStateElement = div({ class: ['tg-column-state', 'tg-column-state-ordering'] });
    const filterStateElement = div({ class: ['tg-column-state', 'tg-column-state-filter'] });
    const resizeHandleElement = div({ class: ['tg-column-resize-handle'] });
    const columnMenuButton = button({ class: ['tg-column-menu-button'] });

    const element = (this._element = th({
      children: [
        div({
          children: [textElement, columnMenuButton, orderingStateElement, filterStateElement, resizeHandleElement],
        }),
      ],
      class: 'tg-column-header',
    }));

    this.bindResize(resizeHandleElement);
    this.bindColumnMenu(columnMenuButton);

    const textSub = col.options.headerText$.subscribe((text) =>
      col.options.headerRenderer(textElement, text, { dataType: col.options.dataType })
    );

    const clickSub = fromEvent(element, 'click', { passive: true }).subscribe(() => {
      this._ordering = this.internals.queryManager.toggleOrdering(this._colId);
    });

    const stateSub = this.internals.queryManager.query$
      .pipe(
        map(({ ordering, filters }) => ({
          ordering: ordering.find((o) => o.columnId === this._colId),
          filter: filters.find((f) => f.columnId === this._colId),
        }))
      )
      .subscribe(({ filter, ordering }) => {
        if (filter !== this._filter) {
          this._filter;
        }

        if (ordering !== this._ordering) {
          this._ordering = ordering;
        }

        this.setColumnState();
      });

    const sub = new Subscription();

    sub.add(textSub);
    sub.add(clickSub);
    sub.add(stateSub);

    parent.appendChild(this._element);
  }

  public override dispose(): void {
    super.dispose();

    this._columnMenu?.dispose();
    this._element?.remove();
  }

  private bindColumnMenu(columnMenuButton: HTMLButtonElement) {
    fromEvent<MouseEvent>(columnMenuButton, 'click')
      .pipe(takeUntil(this.destroy$))
      .subscribe((ev) => {
        ev.stopPropagation();

        if (!this._columnMenu) {
          this._columnMenu = new ColumnMenu(this.internals);

          this._columnMenu.render(this._colId);
        }
      });

    merge(this.internals.columnMenuOpened$.pipe(filter((colId) => colId !== this._colId)), this.internals.columnMenuClosed$)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this._columnMenu?.dispose();
        this._columnMenu = undefined;
      });
  }

  private bindResize(element: HTMLElement) {
    fromEvent<MouseEvent>(element, 'mousedown')
      .pipe(
        switchMap((ev: MouseEvent) => {
          ev.preventDefault();
          ev.stopPropagation();

          const startX = ev.clientX;
          const startWidth = this.internals.getColumnById(this._colId).width;
          const rootElement = this.internals.gridComponentAccessor.getRootElement();

          rootElement.classList.add('tg-column-resizing');

          const cancel$ = merge(
            fromEvent<MouseEvent>(document, 'mouseup').pipe(tap((ev) => ev.stopPropagation())),
            fromEvent<MouseEvent>(document, 'mouseleave').pipe(tap((ev) => ev.stopPropagation())),
            this.destroy$
          ).pipe(
            take(1),
            finalize(() => rootElement.classList.remove('tg-column-resizing'))
          );

          return fromEvent<MouseEvent>(document, 'mousemove').pipe(
            map((moveEv) => {
              moveEv.preventDefault();
              moveEv.stopPropagation();

              const deltaX = moveEv.clientX - startX;

              return Math.max(50, startWidth + deltaX);
            }),
            takeUntil(cancel$)
          );
        })
      )
      .subscribe((newWidth) => (this.internals.getColumnById(this._colId).width = newWidth));
  }

  private setColumnState() {
    if (!this._element) {
      return;
    }

    this._element.classList.toggle('tg-ordered-asc', this.ordering?.mode === 'ascending');
    this._element.classList.toggle('tg-ordered-desc', this.ordering?.mode === 'descending');
    this._element.classList.toggle('tg-filtered', !!this._filter);
  }
}
