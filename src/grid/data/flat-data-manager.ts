import { DataManager } from './data-manager';
import { Pagination, Query } from './query';
import { Filter, Ordering } from './query';
import { StopWatch } from '../util';
import { NormalizedGridOptions } from '../options';
import { BehaviorSubject, combineLatest, from, map, Observable, of, switchMap, withLatestFrom } from 'rxjs';

type DataSource<T> = T[] | Observable<T[]> | Promise<T[]>;

export class FlatDataManager<T extends object> extends DataManager<T> {
  private _src$ = new BehaviorSubject<DataSource<T>>([]);

  private _query$ = new BehaviorSubject<Query>({
    filters: [],
    ordering: [],
    pagination: undefined,
  });

  constructor(private options: NormalizedGridOptions<T>) {
    super();
  }

  public get src(): DataSource<T> {
    return this._src$.getValue();
  }

  public set src(src: DataSource<T>) {
    this._src$.next(src);
  }

  public readonly data$: Observable<T[]> = combineLatest([
    this._src$.pipe(switchMap((src) => (Array.isArray(src) ? of(src) : from(src)))),

    this._query$,
  ]).pipe(
    map(([data, query]) => {
      const sw = new StopWatch('ordering and sorting grid');

      data = this.filterData(data, query.filters);
      data = this.orderData(data, query.ordering);
      data = this.applyPagination(data, query.pagination);

      sw.report();

      return data;
    })
  );

  public override handleChangedQuery(query: Query): void {
    this._query$.next(query);
  }

  private applyPagination(data: T[], pagination: Pagination | undefined): T[] {
    return pagination ? data.slice(pagination.offset, pagination.offset + pagination.count) : data;
  }

  private filterData(data: T[], filters: Filter[]): T[] {
    return data.filter((v) => {
      for (const filter of filters) {
        const col = this.options.columnsById.get(filter.columnId);

        if (!col) {
          throw new Error();
        }

        switch (filter.type) {
          case 'equal':
            return col.comparer(col.valueAccessor(v), filter.compareValue) === 0;
          case 'not-equal':
            return col.comparer(col.valueAccessor(v), filter.compareValue) !== 0;
          default:
            throw new Error();
        }
      }

      return data;
    });
  }

  private orderData(data: T[], orderings: Ordering[]): T[] {
    if (orderings.length === 0) {
      return data;
    }

    return data.sort((a, b) => {
      let res = 0;

      for (const ordering of orderings) {
        const col = this.options.columnsById.get(ordering.columnId);

        if (!col) {
          throw new Error();
        }

        res = col.comparer(col.valueAccessor(a), col.valueAccessor(b));

        if (res !== 0) {
          if (ordering.mode === 'descending') {
            res *= -1;
          }

          break;
        }
      }

      return res;
    });
  }
}
