import { GridComponent } from '../grid-component';
import { GridInternals } from '../grid-internals';

export abstract class GridContent<T extends object> extends GridComponent<T> {
  constructor(internals: GridInternals<T>) {
    super(internals);
  }

  public abstract render(root: HTMLTableElement): void;
}
