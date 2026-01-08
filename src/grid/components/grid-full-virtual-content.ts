import { debounceTime, fromEvent, merge, takeUntil, tap } from 'rxjs';
import { GridState } from '../grid-data';
import { tbody, tr } from '../util/html-elements';
import { GridContent } from './grid-content';
import { StopWatch } from '../util';
import { VirtualViewState } from './types';
import { clearRow, createRow } from './row-helper';

/**
 * Paints only required rows and ads padding to simulate invisible rows.
 */
export class GridFullVirtualContent<T extends object> extends GridContent<T> {
  private _element?: HTMLTableSectionElement;
  private _startPaddingElement?: HTMLTableRowElement;
  private _endPaddingElement?: HTMLTableRowElement;
  private _data: T[] = [];

  private _view: VirtualViewState = {
    rowStart: 0,
    rowEnd: 0,
    rows: [],
  };

  constructor(internals: GridState<T>) {
    super(internals);
  }

  public render(root: HTMLTableElement): void {
    this._element = tbody({
      children: [
        (this._startPaddingElement = tr({ class: 'tg-padding-row' })),
        (this._endPaddingElement = tr({ class: 'tg-padding-row' })),
      ],
    });

    root.appendChild(this._element);

    const updateSources = [
      this.internals.dataManager.data$.pipe(tap((data) => (this._data = data))),
      fromEvent(this.scrollRoot(), 'scroll', { passive: true }).pipe(debounceTime(10)),
    ];

    merge(...updateSources)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.renderRows());
  }

  private renderRows(): void {
    if (!this._element || !this._endPaddingElement || !this._startPaddingElement) {
      return;
    }

    const renderRange = this.getRenderRowRange();
    const sw = new StopWatch(`grid virtual content updating view for rows: ${renderRange.start} - ${renderRange.end}`);

    if (renderRange.start === this._view.rowStart && renderRange.end === this._view.rowEnd) {
      console.log('No changes in render range, skipping view update');

      sw.report();

      return;
    }

    this._view.rows.forEach((row) => clearRow(row));

    this._view = {
      rowStart: renderRange.start,
      rowEnd: renderRange.end,
      rows: this._data.slice(renderRange.start, renderRange.end).map((row) => createRow(row, this.internals)),
    };

    this._startPaddingElement.style.height = `${renderRange.start * this.options.rowHeight}px`;
    this._endPaddingElement.style.height = `${(this._data.length - renderRange.end) * this.options.rowHeight}px`;

    this._element.replaceChildren(this._startPaddingElement, ...this._view.rows.map((r) => r.element), this._endPaddingElement);

    sw.report();
  }

  private scrollRoot(): HTMLElement {
    const scrollRoot = this._element?.parentElement?.parentElement;

    if (!scrollRoot) {
      throw new Error('Unable to find scrollable root element for virtual content');
    }

    return scrollRoot;
  }

  private getRenderRowRange(): { start: number; end: number } {
    const visibleRange = this.getVisibleRowRange();
    const buffer = 5; /// Should be an option

    const start = Math.max(0, visibleRange.start - buffer);
    const end = Math.min(this._data.length, visibleRange.end + buffer);

    return { start, end };
  }

  private getVisibleRowRange(): { start: number; end: number } {
    const element = this.scrollRoot();

    const scrollTop = element.scrollTop;
    const clientHeight = element.clientHeight;
    const rowHeight = this.options.rowHeight;

    const start = Math.floor(scrollTop / rowHeight);
    const end = Math.min(this._data.length, start + Math.ceil(clientHeight / rowHeight));

    return { start, end };
  }
}
