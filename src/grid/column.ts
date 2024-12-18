import { Filter, Ordering } from './data/query';
import { NormalizedColumnOptions } from './options';

export class Column<T extends object> {
  constructor(options: NormalizedColumnOptions<T>) {
    this.options = options;
    this.id = options.id;
  }

  public filter: Filter | undefined;

  public ordering: Ordering | undefined;

  public id: string;

  public options: NormalizedColumnOptions<T>;
}
