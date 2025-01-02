import sanitizeHtml from "sanitize-html";

export function createDiv(options) {
  const { id, className, text, type = "div" } = options;
  const div = document.createElement(type);

  if (id) div.id = id;
  if (className) div.className = className;
  if (text) div.innerText = text;

  div.add = function (child, text = "") {
    if (child instanceof HTMLElement) {
      this.appendChild(child);
    }
    if (typeof child === "string" || child instanceof String) {
      const childDiv = createDiv({ type: child, text: text });
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
    this.setHTMLUnsafe(sanitizeHtml(html));
    return this;
  };

  return div;
}
