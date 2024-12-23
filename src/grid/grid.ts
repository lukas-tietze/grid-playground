import './styles/index.scss';

import { GridCore } from './components/grid-core';
import { GridOptions, normalizeGridOptions } from './options';
import { GridState } from './grid-data';
import { QueryManager } from './querying/query-manager';
import { Observable } from 'rxjs';
import { FlatDataManager } from './data/flat-data-manager';
import { ColumnData } from './column-data';

export class Grid<T extends object> {
  private _options: GridOptions<T>;

  private _core: GridCore<T> | undefined;

  private _internals: GridState<T>;

  constructor(options: GridOptions<T>) {
    this._options = options;

    const normalizedOptions = normalizeGridOptions(options);

    this._internals = new GridState<T>({
      options: normalizedOptions,
      dataManager: new FlatDataManager(normalizedOptions),
      root: this,
      queryManager: new QueryManager(),
    });

    //// TODO: sub
    this._internals.queryManager.query$.subscribe((q) => this._internals.dataManager.handleChangedQuery(q));
  }

  public get options(): GridOptions<T> {
    return this._options;
  }

  public setData(data: T[] | Observable<T[]> | Promise<T[]>) {
    if (this._internals.dataManager instanceof FlatDataManager) {
      this._internals.dataManager.src = data;
    } else {
      throw new Error('not implemented.');
    }
  }

  public attachTo(element: HTMLElement) {
    element.replaceChildren();

    // element.attachShadow({ mode: 'open' });

    // if (!element.shadowRoot) {
    //   throw new Error('Shadow root not created');
    // }

    this._core = new GridCore(element, this._internals);
    this._core.render();
  }
}
