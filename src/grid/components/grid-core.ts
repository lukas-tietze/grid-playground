import { GridComponent } from '../grid-component';
import { GridState } from '../grid-data';
import { div, table } from '../util/html-elements';
import { GridContent } from './grid-content';
import { GridContentColGroup } from './grid-content-col-group';
import { GridFlatContent } from './grid-flat-content';
import { GridVirtualContent } from './grid-virtual-content';
import { GridHeader } from './header';

export class GridCore<T extends object> extends GridComponent<T> {
  private _root: ShadowRoot | HTMLElement;

  private _header: GridHeader<T>;
  private _content: GridContent<T>;
  private _contentTableElement?: HTMLTableElement;
  private _colGroup: GridContentColGroup<T>;

  private _element?: HTMLDivElement;

  constructor(root: ShadowRoot | HTMLElement, internals: GridState<T>) {
    super(internals);

    this._root = root;
    this._header = new GridHeader(this.internals);
    this._content = this.options.virtualization.enabled ? new GridVirtualContent(this.internals) : new GridFlatContent(this.internals);
    this._colGroup = new GridContentColGroup(this.internals);
  }

  public render(): void {
    this._element = div({
      class: 'tg-wrapper',
      children: [(this._contentTableElement = table({}))],
      styles: {
        '--tg-row-height': `${this.options.rowHeight || 30}px`,
      },
    });

    this._root.replaceChildren(this._element);
    this._colGroup.render(this._contentTableElement);
    this._header.render(this._contentTableElement);
    this._content.render(this._contentTableElement);
  }
}
