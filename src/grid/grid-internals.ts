import { Grid } from './grid';
import { NormalizedGridOptions } from './options';
import { DataManager } from './data/data-manager';
import { Observable } from 'rxjs';
import { Query } from './data/query';

export type GridInternals<T extends object> = {
  options: NormalizedGridOptions<T>;
  data: DataManager<T>;
  root: Grid<T>;
  query$: Observable<Query>;
};
