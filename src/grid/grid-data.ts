import { Grid } from './grid';
import { NormalizedGridOptions } from './options';
import { DataManager } from './data/data-manager';
import { QueryManager } from './querying/query-manager';

export type GridState<T extends object> = {
  options: NormalizedGridOptions<T>;
  dataManager: DataManager<T>;
  root: Grid<T>;
  query: QueryManager;
};
