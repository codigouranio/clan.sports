import sanitizeHtml from "sanitize-html";
import { Component } from "./component";

export function createHeader(options) {
  const { headers } = options;
  const thead = createDiv({
    ...options,
    ...{ type: "thead" },
  });

  const headerRow = document.createElement("tr");
  for (const item of headers) {
    const th = document.createElement("th");
    th.innerText = item;
    th.scope = "col";
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  return thead;
}

export function createRow(options) {
  const row = createDiv({
    ...options,
    ...{ type: "tr" },
  });

  row.addCell = function (child, className) {
    const th = document.createElement("th");

    if (className) th.classList.add(...className.split(" "));

    if (this.children.length === 0) {
      th.scope = "row";
    }

    if (
      typeof child === "string" ||
      child instanceof String ||
      typeof child === "number" ||
      child instanceof Number
    ) {
      th.appendChild(document.createTextNode(child));
    }

    if (child instanceof Component) {
      th.appendChild(child.render());
    }

    if (child instanceof HTMLElement) {
      th.appendChild(child);
    }

    this.appendChild(th);

    return this;
  };

  return row;
}

export function createTable(options) {
  const table = createDiv({
    ...options,
    ...{ type: "table" },
  });

  table.addBody = function (rows) {
    const tbody = createDiv({ type: "tbody" });
    for (const row of rows) {
      tbody.appendChild(row);
    }
    this.appendChild(tbody);
    return this;
  };

  return table;
}

export function createSpan(options) {
  const span = createDiv({ ...options, ...{ type: "span" } });
  return span;
}

export function createList(options) {
  const list = createDiv({ ...options, ...{ type: "list" } });
  list.addItems = function (items) {
    if (!items) {
      return this;
    }
    for (const item of items) {
      const li = document.createElement("li");
      if (typeof item === "string" || item instanceof String) {
        li.appendChild(document.createTextNode(item));
      }
      if (item instanceof Component) {
        li.appendChild(item.render());
      }
      if (item instanceof HTMLElement) {
        li.appendChild(item);
      }
      this.appendChild(li);
    }
    return this;
  };
  return list;
}

export function createItem(options) {
  const item = createDiv({ ...options, ...{ text: "", type: "li" } });
  if (options && options.text) {
    item.appendChild(document.createTextNode(options.text));
  }
  return item;
}

export function createImg(options) {
  const { src, alt, title } = options;
  const img = createDiv({
    ...options,
    ...{ type: "img" },
  });

  if (src) img.src = src;
  if (alt) img.alt = alt;
  if (title) img.title = title;

  return img;
}

export function createDiv(options) {
  const { id, className, text, type, selector } = {
    ...{
      id: "",
      className: "",
      text: "",
      type: "div",
      selector: "",
    },
    ...options,
  };
  const div = selector
    ? document.querySelector(selector)
    : document.createElement(type);

  if (id) div.id = id;
  if (className) div.classList.add(...className.split(" "));
  if (text) div.innerText = text;

  div.noop = function () {
    return this;
  };

  div.add = function (child, text = "", className = "") {
    if (child instanceof HTMLElement) {
      this.appendChild(child);
    }
    if (child instanceof Component) {
      this.appendChild(child.render() || document.createElement("span"));
    }
    if (typeof child === "string" || child instanceof String) {
      const childDiv = createDiv({ type: child, text, className });
      this.appendChild(childDiv);
    }
    return this;
  };

  div.addText = function (text) {
    const child = document.createTextNode(text);
    this.appendChild(child);
    return this;
  };

  div.addClassName = function (className) {
    this.classList.add(className);
    return this;
  };

  div.setHtml = function (html) {
    // console.log(html);
    // this.setHTMLUnsafe(sanitizeHtml(html));
    this.innerHTML = html;
    return this;
  };

  return div;
}
