import { Grid } from './grid';
import { ColumnId, NormalizedGridOptions } from './options';
import { DataManager } from './data/data-manager';
import { QueryManager } from './querying/query-manager';
import { ColumnData } from './column-data';
import { Observable, Subject } from 'rxjs';

export interface GridStateInit<T extends object> {
  options: NormalizedGridOptions<T>;
  dataManager: DataManager<T>;
  root: Grid<T>;
  queryManager: QueryManager;
}

export interface GridComponentAccessor {
  getColumnHeaderElement(colId: string): HTMLElement;
  getRootElement(): HTMLElement;
}

const uninitializedGridComponentAccessor: GridComponentAccessor = {
  getRootElement(): HTMLElement {
    throw new Error('GridComponentAccessor not initialized yet.');
  },
  getColumnHeaderElement(colId: string): HTMLElement {
    throw new Error('GridComponentAccessor not initialized yet.');
  },
};

export class GridState<T extends object> {
  private readonly _columnsById: Map<string, ColumnData<T>>;

  private _gridComponentAccessor?: GridComponentAccessor;

  constructor(init: GridStateInit<T>) {
    this.options = init.options;
    this.dataManager = init.dataManager;
    this.grid = init.root;
    this.queryManager = init.queryManager;
    this.cols = init.options.columns.map((c) => new ColumnData(c));
    this._columnsById = new Map(this.cols.map((col) => [col.options.id, col]));
  }

  public readonly options: NormalizedGridOptions<T>;
  public readonly dataManager: DataManager<T>;
  public readonly grid: Grid<T>;
  public readonly queryManager: QueryManager;
  public readonly cols: ColumnData<T>[];

  public get gridComponentAccessor(): GridComponentAccessor {
    return this._gridComponentAccessor ?? uninitializedGridComponentAccessor;
  }

  public set gridComponentAccessor(accessor: GridComponentAccessor) {
    this._gridComponentAccessor = accessor;
  }

  public getColumnById(id: string): ColumnData<T> {
    const res = this._columnsById.get(id);

    if (!res) {
      throw new Error(`Column with id "${id}" not found`);
    }

    return res;
  }

  public readonly columnMenuOpened$ = new Subject<ColumnId>();
  public readonly columnMenuClosed$ = new Subject<ColumnId>();
}
