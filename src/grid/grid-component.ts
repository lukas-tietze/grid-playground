import { Observable } from 'rxjs';
import { Component } from './component';
import { Grid } from './grid';
import { GridState } from './grid-data';
import { NormalizedGridOptions } from './options';
import { DataManager } from './data/data-manager';

export class GridComponent<T extends object> extends Component {
  constructor(internals: GridState<T>) {
    super();

    this.internals = internals;
    this.options = internals.options;
    this.root = internals.root;
    this.data = internals.dataManager;
  }

  protected readonly internals: GridState<T>;

  protected readonly root: Grid<T>;

  protected readonly options: NormalizedGridOptions<T>;

  protected readonly data: DataManager<T>;
}
