import { asyncDebounce } from "./utils";
import sanitizeHtml from "sanitize-html";

class Component {
  changedVisibility = async (visible) => {};
  parent = null;
  children = [];

  constructor(id, parent, props = {}) {
    this.id = id;
    this.obj = document.querySelector(id);
    this.props = props;

    if (this.obj) {
      console.log(`Found ${this.id}`);
      window.addEventListener("__popstate__", () => this.render());
    } else {
      console.log(`No found ${this.id}`);
    }

    if (this.parent) {
      this.parent = parent;
      window.addEventListener("__init_state__", () => this.init());
    }
  }

  getParent() {
    return this.parent;
  }

  init(props = {}) {
    this.props = props;

    for (const child of this.children) {
      if (child instanceof Component) {
        try {
          child.init();
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  destroy() {
    window.removeEventListener("__init_state__", () => this.render());
    window.removeEventListener("__popstate__", () => this.render());
  }

  hide(delay = 0) {
    asyncDebounce(() => {
      if (this.isVisible()) {
        this.obj.classList.add("hidden");
        this.handleChangedVisibility(false);
      }
    }, delay)();
  }

  show(delay = 0) {
    asyncDebounce(() => {
      // if (this.obj.classList.contains("love-vanilla-body")) {
      //   this.obj.classList.add("fade-in visible");
      // }
      // if (!this.isVisible()) {
      //   this.obj.classList.remove("hidden");
      //   this.obj.removeAttribute("hidden");
      //   this.handleChangedVisibility(true);
      // }
    }, delay)();
  }

  setText(text) {
    this.obj.innerHTML = sanitizeHtml(text);
  }

  reset() {
    this.obj.val = "";
  }

  isVisible() {
    if (!this.obj) {
      // throw new Error(`Element with id ${this.id} not found`);
      return false;
    }
    return (
      !this.obj.classList.contains("hidden") && !this.obj.hasAttribute("hidden")
    );
  }

  handleChangedVisibility(visible) {
    this.changedVisibility(visible);
  }

  getChild(id) {
    for (let child of this.children) {
      if (child?.id == id) {
        return child;
      }
    }
    return null;
  }

  getChildren() {
    return this.children;
  }

  createChild(child) {
    child.setParent(this);
    this.children.push(child);
    return child;
  }

  setParent(parent) {
    this.parent = parent;
  }

  getParent() {
    return this.parent;
  }

  getObject() {
    return this.obj;
  }

  remove() {
    if (this.obj) {
      this.obj.remove();
    }
  }

  render() {}

  setProps(props) {
    this.props = props;
  }

  getProps() {
    return this.props;
  }
}

export default Component;
