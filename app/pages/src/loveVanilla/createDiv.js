export function createDiv(options) {
  const { id, className, text } = options;
  const div = document.createElement("div");

  if (id) div.id = id;
  if (className) div.className = className;
  if (text) div.innerText = text;

  // Custom method to append a new child and return the parent
  div.add = function (child) {
    if (child instanceof HTMLElement) {
      this.appendChild(child);
    }
    return this; // Return the parent div to allow chaining
  };

  div.addText = function (htype, text) {
    const child = document.createElement(htype);
    child.innerText = text;
    this.appendChild(child);
    return this;
  };

  return div;
}
