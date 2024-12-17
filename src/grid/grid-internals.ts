import { Grid } from './grid';
import { NormalizedGridOptions } from './options';
import { DataManager } from './data-manager';

export type GridInternals<T extends object> = {
  options: NormalizedGridOptions<T>;
  data: DataManager<T>;
  root: Grid<T>;
};
