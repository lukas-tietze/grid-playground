import { Observable } from 'rxjs';
import { Component } from './component';
import { Grid } from './grid';
import { GridInternals } from './grid-internals';
import { NormalizedGridOptions } from './options';
import { DataManager } from './data-manager';

export class GridComponent<T extends object> extends Component {
  constructor(internals: GridInternals<T>) {
    super();

    this.internals = internals;
    this.options = internals.options;
    this.root = internals.root;
    this.data = internals.data;
  }

  protected readonly internals: GridInternals<T>;

  protected readonly root: Grid<T>;

  protected readonly options: NormalizedGridOptions<T>;

  protected readonly data: DataManager<T>;
}
