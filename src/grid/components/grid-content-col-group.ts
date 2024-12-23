import { takeUntil } from 'rxjs';
import { GridComponent } from '../grid-component';
import { GridState } from '../grid-data';
import { GridContent } from './grid-content';

export class GridContentColGroup<T extends object> extends GridComponent<T> {
  private _element?: HTMLTableColElement;

  constructor(internals: GridState<T>) {
    super(internals);
  }

  public render(root: HTMLTableElement): void {
    this._element = document.createElement('colgroup');

    for (const col of this.internals.cols) {
      const colElement = document.createElement('col');

      col.width$.pipe(takeUntil(this.destroy$)).subscribe(() => {
        colElement.style.width = `${col.width}px`;
      });

      this._element.appendChild(colElement);
    }

    root.appendChild(this._element);
  }
}
