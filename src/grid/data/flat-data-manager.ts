import { BehaviorSubject } from 'rxjs';
import { DataManager } from './data-manager';
import { Pagination, Query } from './query';
import { Filter, Ordering } from './query';
import { StopWatch } from '../util';
import { GridInternals } from '../grid-internals';

export class FlatDataManager<T extends object> extends DataManager<T> {
  constructor(internals: GridInternals<T>) {
    super(internals);
  }

  public data: T[] = [];

  public override getData(query: Query): Promise<T[]> {
    this.onBeginLoad();

    const sw = new StopWatch('ordering and sorting grid');

    let data = this.data;

    data = this.filterData(data, query.filters);
    data = this.orderData(data, query.ordering);
    data = this.applyPagination(data, query.pagination);

    sw.report();

    this.onEndLoad();

    return Promise.resolve(data);
  }

  private applyPagination(data: T[], pagination: Pagination | undefined): T[] {
    return pagination ? data.slice(pagination.offset, pagination.offset + pagination.count) : data;
  }

  private filterData(data: T[], filters: Filter[]): T[] {
    return data.filter((v) => {
      for (const filter of filters) {
        const col = this.internals.options.columnsById.get(filter.columnId);

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
        const col = this.internals.options.columnsById.get(ordering.columnId);

        if (!col) {
          throw new Error();
        }

        res = col.comparer(col.valueAccessor(a), col.valueAccessor(b));

        if (res !== 0) {
          break;
        }
      }

      return res;
    });
  }
}
