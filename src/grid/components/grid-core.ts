import { GridComponent } from '../grid-component';
import { GridState } from '../grid-data';
import { table } from '../util/html-elements';
import { GridContent } from './grid-content';
import { GridFlatContent } from './grid-flat-content';
import { GridHeader } from './header';

export class GridCore<T extends object> extends GridComponent<T> {
  private _root: ShadowRoot | HTMLElement;

  private header: GridHeader<T>;
  private content: GridContent<T>;

  private element?: HTMLTableElement;

  constructor(root: ShadowRoot | HTMLElement, internals: GridState<T>) {
    super(internals);

    this._root = root;
    this.header = new GridHeader(this.internals);
    this.content = new GridFlatContent(this.internals);
  }

  public render(): void {
    this.element = table({ class: 'til-grid' });

    this._root.replaceChildren(this.element);
    this.header.render(this.element);
    this.content.render(this.element);
  }
}
