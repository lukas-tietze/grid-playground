import { OneOf } from '../../types/one-of';

export type HtmlElementArgs = {
  class?: string | string[];
  styles?: Record<string, string>;
  data?: Record<string, string>;
  attributes?: Record<string, string>;
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

  if (args.attributes) {
    for (const [key, value] of Object.entries(args.attributes)) {
      el.setAttribute(key, value);
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

export type InputElementArgs = HtmlElementArgs & {
  type?: string;
  value?: string;
  id?: string;
  name?: string;
};

export function input(args?: InputElementArgs): HTMLInputElement {
  const el = document.createElement('input');

  applyHtmlElementDefaults(args, el);

  if (args?.type) {
    el.type = args.type;
  }

  if (args?.value) {
    el.value = args.value;
  }

  if (args?.id) {
    el.id = args.id;
  }

  if (args?.name) {
    el.name = args.name;
  }

  return el;
}

export type ButtonElementArgs = HtmlElementArgs & {
  type?: 'button' | 'submit' | 'reset';
  name?: string;
  value?: string;
  id?: string;
};

export function button(args?: ButtonElementArgs): HTMLButtonElement {
  const el = document.createElement('button');

  applyHtmlElementDefaults(args, el);

  if (args?.type) {
    el.type = args.type;
  }

  if (args?.name) {
    el.name = args.name;
  }

  if (args?.value) {
    el.value = args.value;
  }

  if (args?.id) {
    el.id = args.id;
  }

  return el;
}
