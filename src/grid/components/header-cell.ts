import { fromEvent, map, Subscription } from 'rxjs';
import { GridComponent } from '../grid-component';
import { GridState } from '../grid-data';
import { ColumnId } from '../options';
import { div, th } from '../util';
import { Filter, Ordering } from '../data/query';

export class HeaderCell<T extends object> extends GridComponent<T> {
  private _element?: HTMLTableCellElement;

  private _colId: ColumnId;

  private _ordering: Ordering | undefined;

  private _filter: Filter | undefined;

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

  public render(parent: HTMLTableRowElement) {
    const options = this.options.columnsById.get(this._colId);

    if (!options) {
      throw new Error();
    }

    const textElement = div({ class: 'tg-column-title' });
    const orderingStateElement = div({ class: ['tg-column-state', 'tg-column-state-ordering'] });
    const filterStateElement = div({ class: ['tg-column-state', 'tg-column-state-filter'] });

    const element = (this._element = th({
      children: [
        div({
          children: [textElement, orderingStateElement, filterStateElement],
        }),
      ],
      class: 'tg-column-header',
    }));

    const textSub = options.headerText$.subscribe((text) => options.headerRenderer(textElement, text, { dataType: options.dataType }));

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

  private setColumnState() {
    if (!this._element) {
      return;
    }

    this._element.classList.toggle('tg-ordered-asc', this.ordering?.mode === 'ascending');
    this._element.classList.toggle('tg-ordered-desc', this.ordering?.mode === 'descending');
    this._element.classList.toggle('tg-filtered', !!this._filter);
  }
}
