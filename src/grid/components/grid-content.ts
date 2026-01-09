import './grid-content.scss';

import { GridComponent } from '../grid-component';
import { GridState } from '../grid-state';

export abstract class GridContent<T extends object> extends GridComponent<T> {
  constructor(internals: GridState<T>) {
    super(internals);
  }

  public abstract render(root: HTMLTableElement): void;
}
