import sanitizeHtml from "sanitize-html";
import { createDiv, createSpan } from "./createDiv";
import { murmurhash3_32_gc } from "./crypto";
import { getData, setData } from "./data";
import { Page } from "./page";
import { asyncDebounce } from "./utils";

export class Component {
  changedVisibility = async (visible) => {};

  parent = null;
  children = [];
  $object = null;
  keys = [];

  constructor(id, props) {
    this.id = id;
    this.props = props;

    this.keys = [this.id];
    for (let i = 0; i < this.props?.keys?.length; i++) {
      this.keys.push(this.props.keys[i]);
    }

    if (props?.parent) {
      this.parent = props.parent;
    }

    this.self = this;
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
        // this.obj.classList.add("hidden");
        this.getObject().style.display = "none";
        this.handleChangedVisibility(false);
      }
    }, delay)();
  }

  show(delay = 0) {
    asyncDebounce(() => {
      this.getObject().style.display = "block";
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
    if (this.getObject()) {
      this.getObject().innerHTML = sanitizeHtml(text);
    }
  }

  reset() {
    this.obj.val = "";
  }

  isVisible() {
    return this.getObject()?.style.display !== "none";
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
    if (this.$object) {
      return this.$object;
    }

    if (this.id === undefined) {
      this.$object = createSpan();
    } else {
      this.$object = createDiv({ selector: this.id });
    }

    return this.$object;
  }

  setHtml(html) {
    if (this.getObject() && this.getObject().innerHTML !== html) {
      this.getObject().innerHTML = html;
    }
  }

  remove() {
    this.children.forEach((child) => child.getObject()?.remove());
  }

  getKeys() {
    return this.keys;
  }

  getHashCode() {
    return murmurhash3_32_gc(JSON.stringify(this.keys.join("")));
  }

  disable() {
    this.getObject().disabled = true;
  }

  enable() {
    this.getObject().disabled = false;
  }

  setBeforeRender(beforeRender = () => {}) {
    if (beforeRender) {
      this.beforeRender = beforeRender;
    }
    return this;
  }

  setRender(render = () => {}) {
    if (this.render) {
      this.render = render;
    }
    return this;
  }

  setAfterRender(afterRender = () => {}) {
    if (this.afterRender) {
      this.afterRender = afterRender;
    }
    return this;
  }

  setUpdatedData(updatedData) {
    if (updatedData) {
      this.updatedData = updatedData;
    }
    return this;
  }

  beforeRender() {
    return this;
  }

  render() {
    for (var child in this.children) {
      if (this.children[child] instanceof Component) {
        this.children[child].render();
      }
    }
  }

  afterRender() {
    return this;
  }

  updatedData() {
    return this;
  }

  getObjectPath() {
    let obj = this;
    let path = [];
    while (obj) {
      if (obj instanceof Component) {
        path.push(obj.id);
        obj = obj.getParent();
      } else if (obj instanceof Page) {
        path.push(obj.getUrl());
        break;
      } else {
        break;
      }
    }
    return path.reverse().join("|");
  }

  setState(state) {
    setData({
      [`${this.getObjectPath()}-${this.getHashCode()}`]: {
        ...getData()?.[this.getHashCode()],
        ...state,
      },
    });
  }

  getState() {
    return getData()?.[`${this.getObjectPath()}-${this.getHashCode()}`];
  }

  getValue() {
    return this.getObject().value;
  }

  setClass(className) {
    this.getObject()?.classList.add(className);
  }

  removeClass(className) {
    this.getObject()?.classList.remove(className);
  }

  setAttribute(name, value) {
    this.getObject()?.setAttribute(name, value);
  }

  appendChild(child) {
    if (child instanceof Component) {
      child.setParent(this);
      this.children.push(child);

      if (this.getObject()) {
        this.getObject().prepend(child.getObject());
      }
    }
    return child;
  }

  renderChild(newChild) {
    if (newChild instanceof Component) {
      if (this.getObject().children.length > 0) {
        this.getObject().replaceChild(
          newChild.render(),
          this.getObject().children[0]
        );
      } else {
        this.getObject().appendChild(newChild.render());
      }
      return this.getObject();
    }
    if (newChild instanceof HTMLElement) {
      if (this.getObject().children.length > 0) {
        this.getObject().replaceChild(newChild, this.getObject().children[0]);
      } else {
        this.getObject().appendChild(newChild);
      }
    }
    return newChild;
  }

  add(newChild) {
    if (this.getObject()) {
      let child;
      if (newChild instanceof Component) {
        newChild.setParent(this);
        this.children.push(newChild);
        child = newChild.render();
      }
      if (newChild instanceof HTMLElement) {
        child = newChild;
      }
      if (child && child instanceof HTMLElement) {
        this.getObject().appendChild(child);
      }
    }
    return this;
  }
}
