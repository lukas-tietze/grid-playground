import { Grid } from './grid';
import { NormalizedGridOptions } from './options';
import { DataManager } from './data/data-manager';
import { QueryManager } from './querying/query-manager';
import { ColumnData } from './column-data';

export type GridStateInit<T extends object> = {
  options: NormalizedGridOptions<T>;
  dataManager: DataManager<T>;
  root: Grid<T>;
  queryManager: QueryManager;
};

export class GridState<T extends object> {
  private readonly _columnsById: Map<string, ColumnData<T>>;

  constructor(init: GridStateInit<T>) {
    this.options = init.options;
    this.dataManager = init.dataManager;
    this.root = init.root;
    this.queryManager = init.queryManager;
    this.cols = init.options.columns.map((c) => new ColumnData(c));
    this._columnsById = new Map(this.cols.map((col) => [col.options.id, col]));
  }

  public readonly options: NormalizedGridOptions<T>;
  public readonly dataManager: DataManager<T>;
  public readonly root: Grid<T>;
  public readonly queryManager: QueryManager;
  public readonly cols: ColumnData<T>[];

  public getColumnById(id: string): ColumnData<T> {
    const res = this._columnsById.get(id);

    if (!res) {
      throw new Error(`Column with id "${id}" not found`);
    }

    return res;
  }
}
