import { BehaviorSubject, combineLatest } from 'rxjs';
import { Filter, OrderDirection, Ordering, Pagination } from '../data/query';
import { ColumnId } from '../options';

export class QueryManager {
  private _filters$ = new BehaviorSubject<Filter[]>([]);
  private _ordering$ = new BehaviorSubject<Ordering[]>([]);
  private _pagination$ = new BehaviorSubject<Pagination | undefined>(undefined);

  public readonly query$ = combineLatest({
    filters: this._filters$,
    ordering: this._ordering$,
    pagination: this._pagination$,
  });

  public toggleOrdering(columnId: ColumnId): Ordering | undefined {
    const ordering = [...this._ordering$.getValue()];

    const existingIndex = ordering.findIndex((o) => o.columnId === columnId);
    let newOrdering: Ordering | undefined;

    if (existingIndex >= 0) {
      if (ordering[existingIndex].mode === 'descending') {
        ordering.splice(existingIndex, 1);
        newOrdering = undefined;
      } else {
        newOrdering = ordering[existingIndex] = { columnId, mode: 'descending' };
      }
    } else {
      ordering.push((newOrdering = { columnId, mode: 'ascending' }));
    }

    this._ordering$.next(ordering);

    return newOrdering;
  }
}
