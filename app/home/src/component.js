import { asyncDebounce } from "./utils";
import sanitizeHtml from "sanitize-html";

class Component {
  changedVisibility = async (visible) => {};
  parent = null;

  constructor(id, parent) {
    this.obj = document.querySelector(id);
    this.parent = parent;
    window.addEventListener("__init_state__", () => this.init());
    this.visible = this.isVisible();
    this.init();
  }

  getParent() {
    return this.parent;
  }

  init() {
    window.addEventListener("__popstate__", () => this.render());
  }

  destroy() {
    window.removeEventListener("__init_state__", () => this.render());
    window.removeEventListener("__popstate__", () => this.render());
  }

  hide(delay = 0) {
    asyncDebounce(() => {
      if (this.isVisible()) {
        this.obj.classList.add("hide");
        this.handleChangedVisibility(false);
      }
    }, delay)();
  }

  show(delay = 0) {
    asyncDebounce(() => {
      if (!this.isVisible()) {
        this.obj.classList.remove("hide");
        this.handleChangedVisibility(true);
      }
    }, delay)();
  }

  setText(text) {
    this.obj.innerHTML = sanitizeHtml(text);
  }

  reset() {
    this.obj.val = "";
  }

  isVisible() {
    return !this.obj.classList.contains("hide");
  }

  handleChangedVisibility(visible) {
    this.changedVisibility(visible);
  }

  render() {}
}

export default Component;
