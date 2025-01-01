import sanitizeHtml from "sanitize-html";

export function createDiv(options) {
  const { id, className, text, type = "div" } = options;
  const div = document.createElement(type);

  if (id) div.id = id;
  if (className) div.className = className;
  if (text) div.innerText = text;

  div.add = function (child) {
    if (child instanceof HTMLElement) {
      this.appendChild(child);
    }
    return this;
  };

  div.addText = function (htype, text) {
    const child = document.createElement(htype);
    child.innerText = text;
    this.appendChild(child);
    return this;
  };

  div.setHtml = function (html) {
    this.setHTMLUnsafe(sanitizeHtml(html));
    return this;
  };

  return div;
}
