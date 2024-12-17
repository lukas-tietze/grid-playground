import { GridComponent } from '../grid-component';
import { GridInternals } from '../grid-internals';
import { table } from '../util/html-elements';
import { GridHeader } from './header';

export class GridCore<T extends object> extends GridComponent<T> {
  private _root: ShadowRoot | HTMLElement;

  private header: GridHeader<T>;

  private element?: HTMLTableElement;

  constructor(root: ShadowRoot | HTMLElement, internals: GridInternals<T>) {
    super(internals);

    this._root = root;
    this.header = new GridHeader(this.internals);
  }

  public render(): void {
    this.element = table({ class: 'til-grid' });

    this._root.replaceChildren(this.element);
    this.header.render(this.element);
  }
}
