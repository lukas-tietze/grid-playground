import { OneOf } from '../../types/one-of';

export type HtmlElementArgs = {
  class?: string | string[];
  styles?: Record<string, string>;
  data?: Record<string, string>;
} & OneOf<
  {
    text?: string;
  },
  {
    children?: HTMLElement[];
  }
>;

const template = document.createElement('template');

export function parseHtmlElement(html: string): HTMLElement {
  template.innerHTML = html;

  return template.content.firstElementChild as HTMLElement;
}

export function applyHtmlElementDefaults(args: HtmlElementArgs | undefined, el: HTMLElement) {
  if (!args) {
    return;
  }

  if (args.class) {
    if (Array.isArray(args.class)) {
      el.classList.add(...args.class);
    } else {
      el.classList.add(args.class);
    }
  }

  if (args.data) {
    for (const key in args.data) {
      el.dataset[key] = args.data[key];
    }
  }

  if (args.text) {
    el.innerText = args.text;
  } else if (args.children) {
    el.append(...args.children);
  }

  if (args.styles) {
    for (const [key, value] of Object.entries(args.styles)) {
      el.style.setProperty(key, value);
    }
  }
}

export type TableElementArgs = HtmlElementArgs;

export function table(args?: TableElementArgs): HTMLTableElement {
  const el = document.createElement('table');

  applyHtmlElementDefaults(args, el);

  return el;
}

export type TableSectionElementArgs = HtmlElementArgs;

export function thead(args?: TableSectionElementArgs): HTMLTableSectionElement {
  const el = document.createElement('thead');

  applyHtmlElementDefaults(args, el);

  return el;
}

export function tbody(args?: TableSectionElementArgs): HTMLTableSectionElement {
  const el = document.createElement('tbody');

  applyHtmlElementDefaults(args, el);

  return el;
}

export type TableRowElementArgs = HtmlElementArgs;

export function tr(args?: TableRowElementArgs): HTMLTableRowElement {
  const el = document.createElement('tr');

  applyHtmlElementDefaults(args, el);

  return el;
}

export type TableCellElementArgs = HtmlElementArgs;

export function td(args?: TableCellElementArgs): HTMLTableCellElement {
  const el = document.createElement('td');

  applyHtmlElementDefaults(args, el);

  return el;
}

export type TableHeaderCellElementArgs = HtmlElementArgs;

export function th(args?: TableHeaderCellElementArgs): HTMLTableCellElement {
  const el = document.createElement('th');

  applyHtmlElementDefaults(args, el);

  return el;
}

export type DivElementArgs = HtmlElementArgs;

export function div(args?: DivElementArgs): HTMLDivElement {
  const el = document.createElement('div');

  applyHtmlElementDefaults(args, el);

  return el;
}
