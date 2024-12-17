import { GridComponent } from '../grid-component';
import { GridInternals } from '../grid-internals';
import { table } from '../util/html-elements';
import { GridHeader } from './header';

export class GridCore<T extends object> extends GridComponent<T> {
  private _shadow: ShadowRoot;

  private header: GridHeader<T>;

  private element?: HTMLTableElement;

  constructor(shadow: ShadowRoot, internals: GridInternals<T>) {
    super(internals);

    this._shadow = shadow;
    this.header = new GridHeader(this.internals);
  }

  public render(): void {
    this.element = table();

    this._shadow.replaceChildren(this.element);
    this.header.render(this.element);
  }
}
