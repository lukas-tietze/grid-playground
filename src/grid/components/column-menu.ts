import './column-menu.scss';

import { GridComponent } from '../grid-component';
import { GridState } from '../grid-state';
import { ColumnId } from '../options';
import { div, StopWatch } from '../util';
import { filter, fromEvent, merge, takeUntil } from 'rxjs';

export class ColumnMenu<T extends object> extends GridComponent<T> {
  private _element: HTMLElement | undefined;

  constructor(state: GridState<T>) {
    super(state);
  }

  public render(colId: ColumnId) {
    const sw = new StopWatch(`Rendering column menu for column ${colId}`);

    this.internals.columnMenuOpened$.next(colId);

    const headerElement = this.internals.gridComponentAccessor.getColumnHeaderElement(colId);

    this._element = div({
      class: 'tg-column-menu',
      styles: {
        top: `${headerElement.getBoundingClientRect().bottom + window.scrollY}px`,
        left: `${headerElement.getBoundingClientRect().left + window.scrollX}px`,
      },
    });

    this.renderMenuContent(this._element);

    document.body.appendChild(this._element);

    this.bindCloseEvent();

    sw.report();
  }

  private bindCloseEvent() {
    merge(
      fromEvent(document, 'click', { passive: true }).pipe(filter((e) => !!this._element && !this._element.contains(e.target as Node))),
      this.destroy$
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.dispose());
  }

  private renderMenuContent(element: HTMLElement) {}

  public override dispose(): void {
    super.dispose();

    this._element?.remove();
  }
}
