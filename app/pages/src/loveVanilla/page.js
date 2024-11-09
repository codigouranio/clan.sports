import { Component } from "./component";

export class Page {
  children = [];

  constructor(app, url) {
    this.app = app;
    this.url = url;
  }

  getUrl() {
    return this.url;
  }

  getUrlParams(paramName) {
    const params = new URLSearchParams(window.location.search);

    if (paramName && paramName.length > 0) {
      if (params.has(paramName)) {
        return params.get(paramName);
      }
      return "";
    }

    return params;
  }

  init(props) {
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

  getApp() {
    return this.app;
  }

  render() {
    for (const child of this.children) {
      if (child instanceof Component) {
        try {
          child.render();
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  createChild(child) {
    child.setParent(this);
    this.children.push(child);
    return child;
  }
}
