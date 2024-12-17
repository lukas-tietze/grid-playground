import './styles/index.scss';

import { GridCore } from './components/grid-core';
import { DataManager } from './data-manager';
import { GridOptions, normalizeGridOptions } from './options';
import { GridInternals } from './grid-internals';

export class Grid<T extends object> {
  private _options: GridOptions<T>;

  private _dataManager: DataManager<T>;

  private _core: GridCore<T> | undefined;

  private internals: GridInternals<T>;

  constructor(options: GridOptions<T>, data: DataManager<T>) {
    this._options = options;
    this._dataManager = data;
    this.internals = {
      options: normalizeGridOptions(options),
      root: this,
    };
  }

  public get options(): GridOptions<T> {
    return this._options;
  }

  public get dataManager(): DataManager<T> {
    return this._dataManager;
  }

  public attachTo(element: HTMLElement) {
    element.replaceChildren();

    // element.attachShadow({ mode: 'open' });

    // if (!element.shadowRoot) {
    //   throw new Error('Shadow root not created');
    // }

    this._core = new GridCore(element, this.internals);
    this._core.render();
  }
}
