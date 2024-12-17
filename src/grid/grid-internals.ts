import { Grid } from './grid';
import { NormalizedGridOptions } from './options';

export type GridInternals<T extends object> = {
  options: NormalizedGridOptions<T>;
  root: Grid<T>;
};
